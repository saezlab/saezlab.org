import json
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import quote
import time
import unicodedata
import os
from urllib.parse import urlparse

def clean_name(name):
    # Special case mappings for specific names
    special_cases = {
        "Jan Lanzer": "jan-david-lanzer",
        "Thorben Söhngen": "thorben-hennig"
    }
    
    # Check if this is a special case
    if name in special_cases:
        return special_cases[name]
    
    # Convert to lowercase
    name = name.lower()
    
    # Replace specific special characters with their ASCII equivalents
    char_map = {
        'ä': 'a',
        'ö': 'o',
        'ü': 'u',
        'ß': 'ss',
        'ñ': 'n',
        'é': 'e',
        'è': 'e',
        'ê': 'e',
        'ë': 'e',
        'á': 'a',
        'à': 'a',
        'â': 'a',
        'ã': 'a',
        'å': 'a',
        'ç': 'c',
        'í': 'i',
        'ì': 'i',
        'î': 'i',
        'ï': 'i',
        'ó': 'o',
        'ò': 'o',
        'ô': 'o',
        'õ': 'o',
        'ú': 'u',
        'ù': 'u',
        'û': 'u',
        'ý': 'y',
        'ÿ': 'y',
        'æ': 'ae',
        'œ': 'oe',
        'ø': 'o',
        'å': 'a',
        'ł': 'l',
        'ń': 'n',
        'ś': 's',
        'ź': 'z',
        'ż': 'z',
        'ć': 'c',
        'ę': 'e',
        'ą': 'a',
        'š': 's',
        'č': 'c',
        'ž': 'z',
        'đ': 'd'
    }
    
    # Replace special characters
    for char, replacement in char_map.items():
        name = name.replace(char, replacement)
    
    # Remove any remaining special characters except hyphens and spaces
    name = re.sub(r'[^a-z0-9\s-]', '', name)
    
    # Replace spaces with hyphens
    name = '-'.join(name.split())
    
    return name

def download_image(url, name, image_dir):
    if not url:
        return None
    
    try:
        # Get the file extension from the URL
        parsed_url = urlparse(url)
        file_ext = os.path.splitext(parsed_url.path)[1]
        if not file_ext:
            file_ext = '.jpg'  # Default extension if none found
        
        # Create filename from person's name
        filename = f"{clean_name(name)}{file_ext}"
        filepath = os.path.join(image_dir, filename)
        
        # Download the image
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Save the image
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return filename
    
    except Exception as e:
        print(f"Error downloading image for {name}: {e}")
        return None

def extract_text_from_element(element):
    if element:
        return element.get_text(strip=True)
    return ""

def scrape_person_info(name, image_dir):
    base_url = "https://saezlab.org/person/"
    url = base_url + clean_name(name) + "/"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Initialize result dictionary
        result = {
            "name": name,
            "description": "",
            "research_interests": "",
            "professional_career": [],
            "education": [],
            "email": "",
            "telephone": "",
            "orcid": "",
            "image": ""
        }
        
        # Extract image
        img = soup.find('img', class_='img-responsive')
        if img and 'src' in img.attrs:
            image_url = img['src']
            if image_url.startswith('/'):
                image_url = 'https://saezlab.org' + image_url
            image_filename = download_image(image_url, name, image_dir)
            if image_filename:
                result["image"] = image_filename
        
        # Extract description
        desc_div = soup.find('div', class_='desc')
        if desc_div:
            result["description"] = extract_text_from_element(desc_div)
        
        # Extract research interests
        research_section = soup.find('h3', string='Research Interests')
        if research_section:
            next_p = research_section.find_next('p')
            if next_p:
                result["research_interests"] = extract_text_from_element(next_p)
        
        # Extract professional career
        career_section = soup.find('h3', string='Professional Career')
        if career_section:
            table = career_section.find_next('table')
            if table:
                for row in table.find_all('tr'):
                    cols = row.find_all('td')
                    if len(cols) == 2:
                        result["professional_career"].append({
                            "period": cols[0].get_text(strip=True),
                            "position": cols[1].get_text(strip=True)
                        })
        
        # Extract education
        education_section = soup.find('h3', string='Education')
        if education_section:
            table = education_section.find_next('table')
            if table:
                for row in table.find_all('tr'):
                    cols = row.find_all('td')
                    if len(cols) == 2:
                        result["education"].append({
                            "period": cols[0].get_text(strip=True),
                            "degree": cols[1].get_text(strip=True)
                        })
        
        # Extract contact information
        contact_divs = soup.find_all('div', class_='contact')
        for contact in contact_divs:
            # Extract telephone
            tel_link = contact.find('a', href=lambda x: x and x.startswith('tel:'))
            if tel_link:
                result["telephone"] = tel_link.get_text(strip=True).replace('Direct:', '').strip()
            
            # Extract ORCID
            orcid_link = contact.find('a', href=lambda x: x and 'orcid.org' in str(x))
            if orcid_link:
                orcid_text = orcid_link.get_text(strip=True)
                # Extract ORCID ID (format: 0000-0000-0000-0000)
                orcid_match = re.search(r'\d{4}-\d{4}-\d{4}-\d{4}', orcid_text)
                if orcid_match:
                    result["orcid"] = orcid_match.group(0)
                else:
                    result["orcid"] = orcid_text
            
            # Extract email from imMail spans
            im_mail = contact.find('span', class_='imMail')
            if im_mail:
                # First try to get the email from the text content
                email_text = im_mail.get_text(strip=True)
                if '@' in email_text:
                    result["email"] = email_text
                # If no email in text, try to construct from data-mail attribute
                elif 'data-mail' in im_mail.attrs:
                    data_mail = im_mail['data-mail']
                    # The format is usually "domain.foo_bar.username"
                    parts = data_mail.split('.')
                    if len(parts) >= 3:
                        domain = parts[0].replace('_', '.')
                        username = parts[-1].replace('_', '.')
                        result["email"] = f"{username}@{domain}"
        
        # If no email found in imMail spans, try regex on the entire page
        if not result["email"]:
            email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
            page_text = soup.get_text()
            email_matches = re.findall(email_pattern, page_text)
            if email_matches:
                result["email"] = email_matches[0]
        
        return result
    
    except requests.exceptions.RequestException as e:
        print(f"Error scraping {name}: {e}")
        return None

def main():
    # Create images directory if it doesn't exist
    image_dir = 'team_images'
    os.makedirs(image_dir, exist_ok=True)
    
    # Load team data
    with open('src/content/team/team.json', 'r') as f:
        team_data = json.load(f)
    
    # Only use current members, not alumni
    current_members = team_data['current']
    
    # Scrape information for each member
    results = []
    for member in current_members:
        print(f"Scraping information for {member['name']}...")
        info = scrape_person_info(member['name'], image_dir)
        if info:
            results.append(info)
        time.sleep(0.3)  # Be nice to the server
    
    # Save results
    with open('team_details.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"Scraped information for {len(results)} current team members")

if __name__ == "__main__":
    main() 