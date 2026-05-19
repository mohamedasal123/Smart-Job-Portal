"""
Skill Extractor — Extracts and categorizes skills from CV text.
Uses a master skill vocabulary built from the job dataset.
"""

import re
import os


# Common soft skills to separate from technical skills
SOFT_SKILLS_KEYWORDS = {
    'leadership', 'communication', 'teamwork', 'team leadership',
    'problem solving', 'problem-solving', 'critical thinking',
    'time management', 'project management', 'agile', 'scrum',
    'collaboration', 'adaptability', 'creativity', 'negotiation',
    'presentation', 'mentoring', 'coaching', 'decision making',
    'conflict resolution', 'interpersonal', 'organizational',
    'analytical', 'attention to detail', 'multitasking',
    'self-motivated', 'work ethic', 'flexibility', 'empathy',
    'emotional intelligence', 'strategic thinking', 'planning',
    'customer service', 'relationship building', 'agile methodology',
}


class SkillExtractor:
    def __init__(self, data_path=None):
        """Initialize with master skill vocabulary from dataset."""
        self.master_skills = set()
        self.skill_patterns = []

        if data_path and os.path.exists(data_path):
            self._build_vocabulary(data_path)

    def _build_vocabulary(self, data_path):
        """Build master skill vocabulary from job descriptions dataset."""
        try:
            import pandas as pd

            df = pd.read_csv(data_path, usecols=['Skills'])
            all_skills_raw = df['Skills'].dropna().unique()

            for skills_str in all_skills_raw:
                # Skills are separated by various delimiters
                individual_skills = re.split(r'[,\n;•·|/]', str(skills_str))
                for skill in individual_skills:
                    skill = skill.strip().strip('()[]{}')
                    # Remove common prefixes like "e.g."
                    skill = re.sub(r'^(e\.g\.\s*|such as\s*|including\s*)', '', skill, flags=re.IGNORECASE)
                    if 3 <= len(skill) <= 50:  # Reasonable skill length
                        self.master_skills.add(skill.lower())

            # Create regex patterns for efficient matching
            # Sort by length (longest first) to match more specific skills first
            sorted_skills = sorted(self.master_skills, key=len, reverse=True)
            # Build patterns in batches to avoid regex size limits
            batch_size = 500
            for i in range(0, len(sorted_skills), batch_size):
                batch = sorted_skills[i:i + batch_size]
                escaped = [re.escape(s) for s in batch]
                pattern = re.compile(r'\b(' + '|'.join(escaped) + r')\b', re.IGNORECASE)
                self.skill_patterns.append(pattern)

            print(f"Built skill vocabulary: {len(self.master_skills)} unique skills")
        except Exception as e:
            print(f"Warning: Could not build skill vocabulary: {e}")

    def extract_skills(self, text):
        """
        Extract skills from text using master vocabulary matching.
        Returns dict with 'technical' and 'soft' skill lists.
        """
        if not text:
            return {'technical': [], 'soft': []}

        text_lower = text.lower()
        found_skills = set()

        # Method 1: Match against master vocabulary
        for pattern in self.skill_patterns:
            matches = pattern.findall(text_lower)
            found_skills.update(m.strip() for m in matches)

        # Method 2: Simple keyword extraction for common tech terms
        common_tech = [
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby',
            'go', 'golang', 'rust', 'swift', 'kotlin', 'php', 'scala', 'r',
            'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
            'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'fastapi',
            'spring', 'spring boot', '.net', 'asp.net',
            'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ansible',
            'git', 'github', 'gitlab', 'ci/cd', 'jenkins', 'github actions',
            'machine learning', 'deep learning', 'nlp', 'computer vision',
            'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
            'html', 'css', 'sass', 'tailwind', 'bootstrap',
            'rest api', 'graphql', 'microservices',
            'linux', 'unix', 'bash', 'powershell',
            'agile', 'scrum', 'jira', 'confluence',
            'figma', 'sketch', 'adobe', 'photoshop', 'illustrator',
            'tableau', 'power bi', 'excel', 'data analysis', 'data visualization',
            'cybersecurity', 'penetration testing', 'network security',
        ]
        for skill in common_tech:
            if skill.lower() in text_lower:
                found_skills.add(skill.lower())

        # Categorize into technical vs soft
        technical = []
        soft = []
        for skill in sorted(found_skills):
            if skill in SOFT_SKILLS_KEYWORDS:
                soft.append(skill.title())
            else:
                technical.append(skill.title())

        return {
            'technical': technical,
            'soft': soft,
            'all': technical + soft,
        }

    def extract_from_cv(self, parsed_cv):
        """
        Extract skills from a parsed CV dict.
        Looks at skills section first, then full text.
        """
        # Prioritize skills section if detected
        skills_text = parsed_cv.get('skills_section', '')
        full_text = parsed_cv.get('raw_text', '')

        # Combine both sources
        combined = skills_text + "\n" + full_text
        return self.extract_skills(combined)
