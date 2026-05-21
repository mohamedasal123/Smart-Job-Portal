"""
CV Parser — Extracts text and structured info from PDF, DOCX, TXT resumes.
"""

import logging
import re
import os

_logger = logging.getLogger("smart_job.ai.cv_parser")

# Module-level spaCy singleton. Loading the model takes ~1.5–2 s on cold start;
# previously we called spacy.load() inside extract_name_spacy and
# extract_location_spacy, paying that cost twice per CV. We lazy-load once on
# first use, then reuse — None means "tried and failed, don't retry."
_NLP_SENTINEL = object()
_nlp_singleton = _NLP_SENTINEL


def _get_nlp():
    """Return the cached spaCy English model, or None if loading failed."""
    global _nlp_singleton
    if _nlp_singleton is _NLP_SENTINEL:
        try:
            import spacy
            _nlp_singleton = spacy.load("en_core_web_sm")
        except Exception:
            _logger.exception("Failed to load spaCy 'en_core_web_sm' model; NER features disabled.")
            _nlp_singleton = None
    return _nlp_singleton


def extract_text_from_pdf(filepath):
    """Extract text from a PDF file."""
    from PyPDF2 import PdfReader
    reader = PdfReader(filepath)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text


def extract_text_from_docx(filepath):
    """Extract text from a DOCX file."""
    from docx import Document
    doc = Document(filepath)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text


def extract_text_from_txt(filepath):
    """Extract text from a TXT file."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()


def extract_text(filepath):
    """Extract text from any supported file format."""
    ext = os.path.splitext(filepath)[1].lower()
    if ext == '.pdf':
        return extract_text_from_pdf(filepath)
    elif ext == '.docx':
        return extract_text_from_docx(filepath)
    elif ext == '.txt':
        return extract_text_from_txt(filepath)
    else:
        raise ValueError(f"Unsupported file format: {ext}")


def extract_email(text):
    """Extract email addresses from text."""
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    matches = re.findall(pattern, text)
    return matches[0] if matches else None


def extract_phone(text):
    """Extract phone numbers from text."""
    patterns = [
        r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}',
        r'\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}',
    ]
    for pattern in patterns:
        matches = re.findall(pattern, text)
        # Filter out short matches (likely not phone numbers)
        phones = [m.strip() for m in matches if len(re.sub(r'\D', '', m)) >= 7]
        if phones:
            return phones[0]
    return None


def _is_plausible_name(line):
    """Check if a line looks like a person's name."""
    line = line.strip()
    if not line or len(line) < 2 or len(line) > 60:
        return False
    # Reject lines with email-like content, URLs, phone numbers, or too many digits
    if re.search(r'[@:/\\]', line):
        return False
    if re.search(r'\d{3,}', line):
        return False
    # Reject common section headers
    header_words = {
        'resume', 'cv', 'curriculum', 'vitae', 'objective', 'summary',
        'experience', 'education', 'skills', 'contact', 'profile',
        'references', 'about', 'address', 'phone', 'email', 'tel',
    }
    if line.lower().strip(':').strip() in header_words:
        return False
    # A plausible name: mostly letters/spaces, 2-5 words, mostly capitalized
    words = line.split()
    if len(words) < 2 or len(words) > 5:
        return False
    # Check that all words start with a capital letter (or are short connectors)
    connectors = {'al', 'el', 'de', 'van', 'von', 'bin', 'ibn', 'al-', 'del', 'da', 'di', 'la', 'le'}
    for word in words:
        clean_word = re.sub(r'[^a-zA-Z]', '', word)
        if not clean_word:
            return False
        if clean_word.lower() not in connectors and not clean_word[0].isupper():
            return False
    return True


def extract_name_heuristic(text):
    """Extract person name using heuristic: first plausible name line at the top."""
    lines = text.split('\n')
    # Check the first 5 non-empty lines
    checked = 0
    for line in lines:
        line = line.strip()
        if not line:
            continue
        checked += 1
        if checked > 5:
            break
        if _is_plausible_name(line):
            return line.strip()
    return None


def extract_name_regex(text):
    """Extract person name from labeled fields like 'Name: John Doe'."""
    patterns = [
        r'(?i)(?:full\s*name|name)\s*[:\-–]\s*([A-Z][a-zA-Z]+(?:\s+[A-Za-z]+){1,4})',
        r'(?i)(?:candidate|applicant)\s*[:\-–]\s*([A-Z][a-zA-Z]+(?:\s+[A-Za-z]+){1,4})',
    ]
    for pattern in patterns:
        match = re.search(pattern, text[:1500])
        if match:
            name = match.group(1).strip()
            if len(name) > 2:
                return name
    return None


def extract_name_spacy(text):
    """Extract person name using spaCy NER."""
    nlp = _get_nlp()
    if nlp is None:
        return None
    try:
        # Only process the first few lines (name is usually at the top)
        first_lines = "\n".join(text.split("\n")[:10])
        doc = nlp(first_lines)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text
    except Exception:
        _logger.exception("spaCy name extraction failed")
    return None


def extract_name(text):
    """
    Extract candidate name using multiple strategies:
    1. Heuristic: first plausible name line at top of CV
    2. Regex: labeled fields like 'Name: ...'
    3. spaCy NER as final fallback
    """
    # Strategy 1: Heuristic (most reliable for CVs)
    name = extract_name_heuristic(text)
    if name:
        return name

    # Strategy 2: Regex labeled fields
    name = extract_name_regex(text)
    if name:
        return name

    # Strategy 3: spaCy NER fallback
    name = extract_name_spacy(text)
    if name:
        return name

    return None


def extract_location_spacy(text):
    """Extract location using spaCy NER."""
    nlp = _get_nlp()
    if nlp is None:
        return None
    try:
        doc = nlp(text[:2000])  # Process first 2000 chars for efficiency
        locations = []
        for ent in doc.ents:
            if ent.label_ in ("GPE", "LOC"):
                locations.append(ent.text)
        return locations[0] if locations else None
    except Exception:
        _logger.exception("spaCy location extraction failed")
    return None


# Section header patterns
SECTION_PATTERNS = {
    'education': re.compile(
        r'(?i)(education|academic|qualification|degree|university|college)',
    ),
    'experience': re.compile(
        r'(?i)(experience|employment|work\s*history|professional\s*background|career)',
    ),
    'skills': re.compile(
        r'(?i)(skills|technical\s*skills|competencies|technologies|proficiency)',
    ),
    'certifications': re.compile(
        r'(?i)(certification|certificate|licensed|accreditation)',
    ),
}


def detect_sections(text):
    """Detect and extract resume sections."""
    lines = text.split('\n')
    sections = {}
    current_section = 'header'
    sections[current_section] = []

    for line in lines:
        line_stripped = line.strip()
        if not line_stripped:
            continue

        # Check if this line is a section header
        found_section = None
        for section_name, pattern in SECTION_PATTERNS.items():
            if pattern.search(line_stripped) and len(line_stripped) < 60:
                found_section = section_name
                break

        if found_section:
            current_section = found_section
            if current_section not in sections:
                sections[current_section] = []
        else:
            if current_section not in sections:
                sections[current_section] = []
            sections[current_section].append(line_stripped)

    # Join section content
    return {k: '\n'.join(v) for k, v in sections.items()}


def parse_cv(filepath):
    """
    Full CV parsing pipeline.
    Returns a dict with extracted structured information.
    """
    # Step 1: Extract raw text
    raw_text = extract_text(filepath)

    if not raw_text or len(raw_text.strip()) < 20:
        return {'error': 'Could not extract text from the file.', 'raw_text': ''}

    # Step 2: Extract contact info
    email = extract_email(raw_text)
    phone = extract_phone(raw_text)
    name = extract_name(raw_text)
    location = extract_location_spacy(raw_text)

    # Step 3: Detect sections
    sections = detect_sections(raw_text)

    return {
        'raw_text': raw_text,
        'name': name or 'Not detected',
        'email': email or 'Not detected',
        'phone': phone or 'Not detected',
        'location': location or 'Not detected',
        'sections': sections,
        'education': sections.get('education', ''),
        'experience': sections.get('experience', ''),
        'skills_section': sections.get('skills', ''),
        'certifications': sections.get('certifications', ''),
    }
