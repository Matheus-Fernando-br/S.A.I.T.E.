"""Divisão de seções em trechos (chunks) com sobreposição.

Tamanhos em caracteres (~4 caracteres por token em português): o padrão de
1 600 caracteres equivale a ~400 tokens, dentro da faixa de 300–1 000 tokens
recomendada para RAG e abaixo do contexto de 2 048 tokens do nomic-embed-text.
"""

import re
from dataclasses import dataclass

from app.services.knowledge.extract import Section


CHUNK_CHARS = 1600
OVERLAP_CHARS = 200


@dataclass
class Chunk:
    content: str
    location: str


def _pieces(text: str, limit: int) -> list[str]:
    """Quebra em parágrafos; parágrafos longos viram frases; frases longas, palavras."""
    pieces: list[str] = []
    for paragraph in re.split(r"\n\s*\n", text):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        if len(paragraph) <= limit:
            pieces.append(paragraph)
            continue
        for sentence in re.split(r"(?<=[.!?;:])\s+|\n", paragraph):
            while len(sentence) > limit:
                cut = sentence.rfind(" ", 0, limit)
                cut = cut if cut > limit // 2 else limit
                pieces.append(sentence[:cut].strip())
                sentence = sentence[cut:].strip()
            if sentence.strip():
                pieces.append(sentence.strip())
    return pieces


def _tail(text: str, size: int) -> str:
    if len(text) <= size:
        return text
    tail = text[-size:]
    space = tail.find(" ")
    return tail[space + 1 :] if 0 <= space < size // 2 else tail


def chunk_sections(
    sections: list[Section], chunk_chars: int = CHUNK_CHARS, overlap: int = OVERLAP_CHARS
) -> list[Chunk]:
    chunks: list[Chunk] = []
    for section in sections:
        current = ""
        for piece in _pieces(section.text, chunk_chars - overlap):
            candidate = f"{current}\n\n{piece}" if current else piece
            if len(candidate) <= chunk_chars:
                current = candidate
                continue
            chunks.append(Chunk(current, section.location))
            current = f"{_tail(current, overlap)}\n\n{piece}"
        if current.strip():
            chunks.append(Chunk(current, section.location))
    return chunks
