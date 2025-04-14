import requests
from bs4 import BeautifulSoup
import json
from typing import List, Dict
import time
from pathlib import Path

def get_publications_from_page(url: str) -> List[Dict]:
    """Get publications from a single page."""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    publications = []
    
    for pub_div in soup.find_all('div', class_='publication'):
        title_link = pub_div.find('a')
        if not title_link:
            continue
            
        title = title_link.text.strip()
        url = title_link.get('href', '')
        
        # Get authors and journal info
        bib_ref = pub_div.find('p', class_='para bib-ref')
        if not bib_ref:
            continue
            
        # Split the reference into authors and journal/year
        ref_text = bib_ref.text.strip()
        parts = ref_text.split('.', 1)
        if len(parts) != 2:
            continue
            
        authors = parts[0].strip()
        journal_info = parts[1].strip()
        
        # Split journal info into journal and year
        journal_parts = journal_info.split(',', 1)
        if len(journal_parts) != 2:
            continue
            
        journal = journal_parts[0].strip()
        year = journal_parts[1].strip()
        
        publications.append({
            'title': title,
            'url': url,
            'authors': authors,
            'journal': journal,
            'year': year
        })
    
    return publications

def get_all_publications() -> List[Dict]:
    """Get all publications across all pages."""
    base_url = "https://saezlab.org/publication/"
    all_publications = []
    seen_titles = set()  # To prevent duplicates
    
    # Get first page
    current_url = base_url
    page = 1
    
    while True:
        print(f"Scraping page {page}...")
        publications = get_publications_from_page(current_url)
        
        # Filter out duplicates
        new_publications = []
        for pub in publications:
            if pub['title'] not in seen_titles:
                seen_titles.add(pub['title'])
                new_publications.append(pub)
        
        all_publications.extend(new_publications)
        
        # Check for next page
        response = requests.get(current_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        next_link = soup.find('a', class_='next page-numbers')
        
        if not next_link:
            break
            
        current_url = next_link['href']
        page += 1
        time.sleep(1)  # Be nice to the server
    
    return all_publications

def main():
    # Get all publications
    publications = get_all_publications()
    
    # Save to JSON
    with open("publications.json", "w") as f:
        json.dump(publications, f, indent=2)
    
    print(f"Saved {len(publications)} unique publications to dumps/publications.json")

if __name__ == "__main__":
    main() 