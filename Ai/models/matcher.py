"""
Matching Engine — High-accuracy job matching using:
  1. Bi-encoder (sentence-transformer) for fast candidate retrieval
  2. Cross-encoder for precise re-ranking of top candidates
  3. Skill overlap for keyword-level matching

This two-stage approach (retrieve + re-rank) is the industry standard
used by search engines to achieve >90% accuracy.
"""

import pickle
import os
import re


class MatchingEngine:
    def __init__(self, embeddings_path=None, cross_encoder_model=None):
        """Load pre-computed job embeddings and cross-encoder."""
        self.job_data = []
        self.job_embeddings = None
        self.cross_encoder = None

        if embeddings_path and os.path.exists(embeddings_path):
            self.load_embeddings(embeddings_path)

        if cross_encoder_model:
            from sentence_transformers import CrossEncoder

            print(f"Loading cross-encoder: {cross_encoder_model}...")
            self.cross_encoder = CrossEncoder(cross_encoder_model)
            print("Cross-encoder loaded.")

    def load_embeddings(self, path):
        """Load pre-computed job embeddings from pickle file."""
        with open(path, 'rb') as f:
            data = pickle.load(f)
        self.job_data = data['job_data']
        self.job_embeddings = data['embeddings']
        print(f"Loaded {len(self.job_data)} job embeddings.")

    def _build_job_text(self, job):
        """Build a text representation of a job for cross-encoder scoring."""
        parts = []
        if job.get('Job_Title'):
            parts.append(str(job['Job_Title']))
        if job.get('Skills'):
            parts.append(f"Skills: {job['Skills']}")
        if job.get('Role'):
            parts.append(f"Role: {job['Role']}")
        if job.get('Job_Description'):
            desc = str(job['Job_Description'])[:500]  # Limit length
            parts.append(desc)
        return " | ".join(parts) if parts else ""

    def _compute_skill_overlap(self, candidate_skills, job_skills_str):
        """Compute skill overlap score (0-100) with fuzzy matching."""
        if not candidate_skills or not job_skills_str:
            return 0.0

        candidate_lower = {s.lower().strip() for s in candidate_skills if s}
        if not candidate_lower:
            return 0.0

        job_skills_raw = re.split(r'[,\n;•·|/]', str(job_skills_str))
        job_skills = set()
        for s in job_skills_raw:
            s = s.strip()
            if 2 <= len(s) <= 50:
                job_skills.add(s.lower())

        if not job_skills:
            return 0.0

        matched = 0
        for js in job_skills:
            for cs in candidate_lower:
                if js in cs or cs in js:
                    matched += 1
                    break

        return (matched / len(job_skills)) * 100

    def _normalize_scores(self, scores):
        """
        Normalize scores to 0-100 range using min-max scaling
        with a floor so that top matches show strong scores.
        """
        if len(scores) == 0:
            return scores
        import numpy as np

        arr = np.array(scores)
        min_s = arr.min()
        max_s = arr.max()
        if max_s - min_s < 1e-6:
            return np.full_like(arr, 75.0)
        # Normalize to 50-100 range (top matches get high scores)
        normalized = 50 + 50 * (arr - min_s) / (max_s - min_s)
        return normalized

    def compute_matches(self, candidate_embedding, top_n=20, threshold=0,
                        candidate_skills=None, cv_text='',
                        rerank_pool=100):
        """
        Two-stage matching: fast retrieval + cross-encoder re-ranking.

        Stage 1: Bi-encoder cosine similarity → top rerank_pool candidates
        Stage 2: Cross-encoder re-ranking → precise top_n results
        Stage 3: Hybrid with skill overlap bonus

        Args:
            candidate_embedding: numpy array of shape (dim,)
            top_n: number of top matches to return
            threshold: minimum match percentage (0-100)
            candidate_skills: list of candidate skill strings
            cv_text: raw CV text for cross-encoder pairing
            rerank_pool: how many candidates to re-rank (default 100)
        """
        if self.job_embeddings is None or len(self.job_data) == 0:
            return []

        import numpy as np
        from sklearn.metrics.pairwise import cosine_similarity

        # ── Stage 1: Fast retrieval with bi-encoder ──────────
        cand_vec = candidate_embedding.reshape(1, -1)
        similarities = cosine_similarity(cand_vec, self.job_embeddings)[0]
        cosine_scores = (similarities * 100).clip(0, 100)

        # Get top candidates for re-ranking
        pool_size = min(rerank_pool, len(self.job_data))
        top_indices = np.argsort(cosine_scores)[::-1][:pool_size]

        # ── Stage 2: Cross-encoder re-ranking ────────────────
        if self.cross_encoder and cv_text:
            # Build text pairs for cross-encoder
            pairs = []
            for idx in top_indices:
                job_text = self._build_job_text(self.job_data[idx])
                pairs.append([cv_text[:512], job_text[:512]])

            # Score with cross-encoder
            ce_scores = self.cross_encoder.predict(pairs)
            # Normalize cross-encoder scores to 0-100
            ce_normalized = self._normalize_scores(ce_scores)

            # Combine: 50% cross-encoder + 30% cosine + 20% skill overlap
            results = []
            for i, idx in enumerate(top_indices):
                job = self.job_data[idx]
                ce_score = float(ce_normalized[i])
                cos_score = float(cosine_scores[idx])

                if candidate_skills:
                    skill_score = self._compute_skill_overlap(
                        candidate_skills, job.get('Skills', '')
                    )
                    hybrid = ce_score * 0.50 + cos_score * 0.30 + skill_score * 0.20
                else:
                    hybrid = ce_score * 0.60 + cos_score * 0.40

                if hybrid >= threshold:
                    result = {
                        **job,
                        'match_score': round(float(hybrid), 1),
                        'cosine_score': round(cos_score, 1),
                        'rerank_score': round(ce_score, 1),
                    }
                    if candidate_skills:
                        result['skill_overlap'] = round(float(skill_score), 1)
                    results.append(result)
        else:
            # Fallback: cosine + skill overlap only (no cross-encoder)
            results = []
            for idx in top_indices:
                job = self.job_data[idx]
                cos_score = float(cosine_scores[idx])

                if candidate_skills:
                    skill_score = self._compute_skill_overlap(
                        candidate_skills, job.get('Skills', '')
                    )
                    hybrid = cos_score * 0.70 + skill_score * 0.30
                else:
                    hybrid = cos_score

                if hybrid >= threshold:
                    result = {
                        **job,
                        'match_score': round(float(hybrid), 1),
                        'cosine_score': round(cos_score, 1),
                    }
                    if candidate_skills:
                        result['skill_overlap'] = round(float(skill_score), 1)
                    results.append(result)

        # Sort by score descending
        results.sort(key=lambda x: x['match_score'], reverse=True)
        return results[:top_n]

    def compute_skill_gap(self, candidate_skills, job_skills_str):
        """Compute matched and missing skills between candidate and job."""
        candidate_lower = {s.lower() for s in candidate_skills}

        job_skills_raw = re.split(r'[,\n;•·|]', str(job_skills_str))
        job_skills = set()
        for s in job_skills_raw:
            s = s.strip()
            if 3 <= len(s) <= 50:
                job_skills.add(s.lower())

        matched = []
        missing = []

        for js in sorted(job_skills):
            is_matched = False
            for cs in candidate_lower:
                if js in cs or cs in js:
                    is_matched = True
                    break
            if is_matched:
                matched.append(js.title())
            else:
                missing.append(js.title())

        return {
            'matched': matched,
            'missing': missing,
            'matched_count': len(matched),
            'missing_count': len(missing),
            'total_required': len(job_skills),
        }
