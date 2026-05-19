"""
Embedding Engine — Converts skill lists to semantic vectors
using sentence-transformers for similarity comparison.
"""

from sentence_transformers import SentenceTransformer
import numpy as np


class EmbeddingEngine:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        """Load the sentence-transformer model."""
        print(f"Loading embedding model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        print("Embedding model loaded.")

    def embed_skills(self, skills_list):
        """
        Convert a list of skills into a single embedding vector.
        Encodes all skills together as a single semantic representation.
        """
        if not skills_list:
            return np.zeros(self.model.get_sentence_embedding_dimension())

        # Join skills into a meaningful sentence
        skills_text = ", ".join(skills_list)
        embedding = self.model.encode(skills_text, normalize_embeddings=True)
        return embedding

    def embed_text(self, text):
        """Embed arbitrary text."""
        if not text or not text.strip():
            return np.zeros(self.model.get_sentence_embedding_dimension())
        return self.model.encode(text, normalize_embeddings=True)

    def embed_batch(self, texts, batch_size=64, show_progress=True):
        """Embed a batch of texts efficiently."""
        if not texts:
            return np.array([])
        return self.model.encode(
            texts,
            batch_size=batch_size,
            normalize_embeddings=True,
            show_progress_bar=show_progress,
        )

    def get_dimension(self):
        """Return the embedding dimensionality."""
        return self.model.get_sentence_embedding_dimension()
