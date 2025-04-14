import json
import requests
from bs4 import BeautifulSoup
import re

def clean_duration(duration):
    # Remove any extra spaces and normalize the format
    duration = duration.strip()
    # Remove any extra spaces around the hyphen
    duration = re.sub(r'\s*-\s*', '-', duration)
    return duration

def clean_position(position):
    # Clean up position text
    position = position.strip()
    # Remove any extra spaces
    position = ' '.join(position.split())
    return position

def scrape_alumni():
    # URL of the website
    url = "https://saezlab.org/"
    
    try:
        # Fetch the webpage content
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the alumni table
        alumni_div = soup.find('div', id='t-alumni')
        if not alumni_div:
            print("Could not find alumni table on the page")
            return
        
        table = alumni_div.find('table', class_='table')
        if not table:
            print("Could not find alumni table in the alumni section")
            return
        
        # Initialize list to store alumni data
        alumni_data = []
        
        # Skip the header row and process each row
        for row in table.find_all('tr')[1:]:  # Skip header row
            cols = row.find_all('td')
            if len(cols) == 3:  # Ensure we have all three columns
                name_link = cols[0].find('a')
                name = name_link.text.strip() if name_link else cols[0].text.strip()
                linkedin = name_link['href'] if name_link and 'href' in name_link.attrs else ""
                duration = clean_duration(cols[1].text)
                position = clean_position(cols[2].text)
                
                alumni_data.append({
                    "name": name,
                    "linkedin": linkedin,
                    "duration": duration,
                    "position": position
                })
        
        # Save to JSON file
        with open('alumni.json', 'w', encoding='utf-8') as f:
            json.dump(alumni_data, f, indent=2, ensure_ascii=False)
        
        print(f"Scraped information for {len(alumni_data)} alumni members")
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the webpage: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    scrape_alumni() 