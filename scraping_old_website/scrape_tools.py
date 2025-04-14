import json
import requests
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import urlparse
import time

def clean_name(name):
    # Convert to lowercase
    name = name.lower()
    
    # Replace spaces with hyphens
    name = '-'.join(name.split())
    
    # Remove any special characters except hyphens
    name = re.sub(r'[^a-z0-9-]', '', name)
    
    return name

def download_image(url, name, image_dir):
    if not url:
        return None
    
    try:
        # Get the file extension from the URL
        parsed_url = urlparse(url)
        file_ext = os.path.splitext(parsed_url.path)[1]
        if not file_ext:
            file_ext = '.png'  # Default extension if none found
        
        # Create filename from tool's name
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

def scrape_tool_info(resource_div, image_dir):
    try:
        # Initialize result dictionary
        result = {
            "name": "",
            "short_description": "",
            "long_description": "",
            "code_repository": "",
            "website": "",
            "publication": "",
            "image": "",
            "categories": {
                "featured": False,
                "tool": False,
                "database": False
            }
        }
        
        # Extract name
        name_elem = resource_div.find('h3')
        if name_elem:
            result["name"] = extract_text_from_element(name_elem)
        
        # Extract short description
        desc_elem = resource_div.find('p')
        if desc_elem:
            result["short_description"] = extract_text_from_element(desc_elem)
        
        # Extract image
        img = resource_div.find('img', class_='icon')
        if img and 'src' in img.attrs:
            image_url = img['src']
            if image_url.startswith('/'):
                image_url = 'https://saezlab.org' + image_url
            image_filename = download_image(image_url, result["name"], image_dir)
            if image_filename:
                result["image"] = image_filename
        
        # Extract detailed information from the hidden div
        hidden_div = resource_div.find('div', class_='hidden')
        if hidden_div:
            # Extract long description
            desc_p = hidden_div.find('p')
            if desc_p:
                result["long_description"] = extract_text_from_element(desc_p)
            
            # Extract links from the table
            table = hidden_div.find('table')
            if table:
                # Find the data row (second row)
                rows = table.find_all('tr')
                if len(rows) >= 2:
                    data_row = rows[1]  # Get the second row which contains the actual data
                    cols = data_row.find_all('td')
                    
                    # Process each column based on its position
                    for i, col in enumerate(cols):
                        link = col.find('a')
                        if link and 'href' in link.attrs:
                            href = link['href']
                            if i == 0:  # First column is code repository
                                result["code_repository"] = href
                            elif i == 1:  # Second column is website
                                result["website"] = href
                            elif i == 2:  # Third column is publication
                                result["publication"] = href
        
        # Determine categories based on the comment in the hidden div
        comment = hidden_div.find(text=lambda text: isinstance(text, str) and 'array' in text)
        if comment:
            if 'database' in comment:
                result["categories"]["database"] = True
            if 'tool' in comment:
                result["categories"]["tool"] = True
        
        return result
    
    except Exception as e:
        print(f"Error scraping tool information: {e}")
        return None

def main():
    # Create images directory if it doesn't exist
    image_dir = 'tool_images'
    os.makedirs(image_dir, exist_ok=True)
    
    # URL of the tools page
    url = "https://saezlab.org#tools"
    
    try:
        # Get the page content
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Initialize results list
        results = []
        
        # Find all resource divs
        resource_divs = soup.find_all('div', class_='resource')
        
        for resource_div in resource_divs:
            print(f"Scraping information for resource...")
            info = scrape_tool_info(resource_div, image_dir)
            if info:
                results.append(info)
            time.sleep(0.3)  # Be nice to the server
        
        # Save results
        with open('tools_details.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"Scraped information for {len(results)} tools")
    
    except requests.exceptions.RequestException as e:
        print(f"Error accessing the website: {e}")

if __name__ == "__main__":
    main() 