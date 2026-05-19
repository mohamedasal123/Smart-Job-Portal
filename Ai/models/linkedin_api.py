"""
LinkedIn Jobs Integration — Scrape live public job postings from LinkedIn.

Uses LinkedIn's public guest API to fetch real-time job listings,
including full descriptions, and extracts relevant skills from them.
"""

import requests
from bs4 import BeautifulSoup
import re
import time
from urllib.parse import quote


# Common tech skills to detect in job descriptions
SKILL_KEYWORDS = [
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go',
    'rust', 'swift', 'kotlin', 'php', 'scala', 'r', 'matlab', 'sql', 'nosql',
    'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django',
    'flask', 'spring', 'fastapi', '.net', 'rails', 'laravel',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
    'git', 'linux', 'ci/cd', 'devops', 'agile', 'scrum',
    'machine learning', 'deep learning', 'nlp', 'computer vision',
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
    'data science', 'data engineering', 'data analysis', 'big data',
    'spark', 'hadoop', 'kafka', 'airflow', 'etl',
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'rest api', 'graphql', 'microservices', 'api design',
    'figma', 'ui/ux', 'product management', 'project management',
    'communication', 'leadership', 'teamwork', 'problem solving',
    'excel', 'power bi', 'tableau', 'sap', 'salesforce', 'jira',
]


def _extract_skills_from_description(description):
    """Extract skill keywords found in a job description."""
    if not description:
        return ''
    desc_lower = description.lower()
    found = []
    for skill in SKILL_KEYWORDS:
        # Use word boundary matching for short skills to avoid false positives
        if len(skill) <= 3:
            if re.search(r'\b' + re.escape(skill) + r'\b', desc_lower):
                found.append(skill.title())
        else:
            if skill in desc_lower:
                found.append(skill.title())
    return ', '.join(found)


def _build_search_keywords(skills, experience, parsed_cv):
    """
    Build smart search queries from CV data.
    Returns a list of keyword strings to search LinkedIn with.
    """
    queries = []

    # Strategy 1: Use top skills combined (most relevant)
    if skills and len(skills) >= 2:
        # Combine top 2-3 skills for a targeted search
        top_skills = skills[:3]
        queries.append(' '.join(top_skills))

    # Strategy 2: Use job title from experience if detectable
    if experience:
        # Try to extract job title patterns
        title_patterns = [
            r'(?:worked as|position[:\s]+|role[:\s]+|title[:\s]+)\s*([A-Za-z\s]+)',
            r'((?:Senior|Junior|Lead|Staff|Principal)?\s*(?:Software|Data|ML|AI|Web|Full[- ]?Stack|Front[- ]?End|Back[- ]?End|DevOps|Cloud|QA|Test|Product|Project|Business|Marketing|Sales|HR|Finance)\s*(?:Engineer|Developer|Analyst|Scientist|Manager|Designer|Architect|Consultant|Specialist|Administrator))',
        ]
        for pattern in title_patterns:
            match = re.search(pattern, experience, re.IGNORECASE)
            if match:
                title = match.group(1).strip()
                if len(title) > 3 and title not in queries:
                    queries.append(title)
                break

    # Strategy 3: First skill as fallback
    if skills:
        if skills[0] not in ' '.join(queries):
            queries.append(skills[0])

    # Fallback
    if not queries:
        queries.append('Software Developer')

    return queries[:2]  # Max 2 queries to avoid rate limits


def fetch_linkedin_jobs(keyword, location="Worldwide", limit=5):
    """
    Fetches live public jobs from LinkedIn's guest API.
    
    Args:
        keyword: Search keyword(s)
        location: Job location filter
        limit: Max number of jobs to fetch
        
    Returns:
        List of job dicts with keys: Job_Title, Company, Location, URL,
        Job_Description, Role, Skills, is_linkedin_live
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/125.0.0.0 Safari/537.36"
        )
    }
    keyword_enc = quote(keyword)
    location_enc = quote(location)

    url = (
        f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
        f"?keywords={keyword_enc}&location={location_enc}&start=0"
    )

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            print(f"LinkedIn API returned status {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        jobs = []

        for card in soup.find_all('li')[:limit]:
            title_elem = card.find('h3', class_='base-search-card__title')
            company_elem = card.find('h4', class_='base-search-card__subtitle')
            location_elem = card.find('span', class_='job-search-card__location')
            link_elem = card.find('a', class_='base-card__full-link')

            if not title_elem or not link_elem:
                continue

            job_url = link_elem.get('href', '').split('?')[0]
            job_id_match = re.search(r'-(\d+)$', job_url)
            job_id = job_id_match.group(1) if job_id_match else None

            # Fetch full job description
            description = ""
            if job_id:
                desc_url = (
                    f"https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"
                )
                try:
                    desc_resp = requests.get(desc_url, headers=headers, timeout=5)
                    if desc_resp.status_code == 200:
                        desc_soup = BeautifulSoup(desc_resp.text, 'html.parser')
                        desc_div = desc_soup.find(
                            'div', class_='show-more-less-html__markup'
                        )
                        if desc_div:
                            description = desc_div.get_text(separator=' ', strip=True)
                except Exception:
                    pass
                time.sleep(0.15)  # Rate limit prevention

            # Extract skills from description
            extracted_skills = _extract_skills_from_description(description)

            jobs.append({
                'Job_Title': title_elem.get_text(strip=True),
                'Company': (
                    company_elem.get_text(strip=True) if company_elem else 'Unknown'
                ),
                'Location': (
                    location_elem.get_text(strip=True) if location_elem else 'Unknown'
                ),
                'URL': job_url,
                'Job_Description': description,
                'Role': title_elem.get_text(strip=True),
                'Skills': extracted_skills,
                'is_linkedin_live': True,
            })

        return jobs

    except Exception as e:
        print(f"Error scraping LinkedIn: {e}")
        return []


def fetch_linkedin_jobs_multi(skills, experience, parsed_cv,
                               location="Worldwide", total_limit=10):
    """
    Fetch LinkedIn jobs using multiple smart search queries derived from CV data.
    
    Args:
        skills: List of candidate skills
        experience: Experience text from CV
        parsed_cv: Full parsed CV dict
        location: Location to search in
        total_limit: Max total jobs to return
        
    Returns:
        List of unique job dicts
    """
    queries = _build_search_keywords(skills, experience, parsed_cv)
    print(f"  LinkedIn search queries: {queries}")

    all_jobs = []
    seen_urls = set()
    per_query_limit = max(total_limit // len(queries), 3)

    for query in queries:
        jobs = fetch_linkedin_jobs(query, location=location, limit=per_query_limit)
        for job in jobs:
            url = job.get('URL', '')
            if url and url not in seen_urls:
                seen_urls.add(url)
                all_jobs.append(job)
            if len(all_jobs) >= total_limit:
                break
        if len(all_jobs) >= total_limit:
            break

    print(f"  LinkedIn: Found {len(all_jobs)} unique live jobs")
    return all_jobs[:total_limit]
