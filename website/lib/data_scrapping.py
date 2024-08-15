import requests
from bs4 import BeautifulSoup as bs
from urllib.request import urlopen
from urllib.error import HTTPError
from time import sleep
import pandas as pd
import logging
import random

# Logging configuration
logging.basicConfig(level=logging.ERROR)

# Initialize an empty DataFrame to store product information
data = pd.DataFrame()
# Search term for Flipkart
users = ["tv","mobile","laptop"]
for user in users:
    print(user)
    try:
        sleep(random.randint(40, 90))
        # Base URL for Flipkart and search URL
        flipkart_url = "https://www.flipkart.com"
        search_url = flipkart_url + "/search?q=" + user

        # Fetch the search results page
        urlclient = urlopen(search_url)
        flipkart_page = urlclient.read()
        flipkart_html = bs(flipkart_page, 'html.parser')

        # Find the product containers on the page
        bigbox = flipkart_html.find_all("div", {"class": "cPHDOP col-12-12"})



        # Loop through the found product containers and extract information
        for producturl in bigbox[3:26]:
            try:
                # Random sleep to avoid detection and rate limiting
                sleep(random.randint(20, 90))

                # Construct the full product URL
                product_link = flipkart_url + producturl.div.div.div.a["href"]
                print(product_link)
                # Fetch the product page
                prod_html = bs(urlopen(product_link).read(), "html.parser")

                # Extract product name
                def products():
                    try:
                        product_name = prod_html.find_all('span', {'class': 'VU-ZEz'})[0].text
                        product = product_name.split('Edition')[0].strip().split("Â Â")[0].strip()
                    except Exception as error:
                        product = "NA"
                        logging.error(error)
                    return product

                # Extract specifications
                def specifications():
                    try:
                        specification = " ".join([f"{x.text} : {y.text}" for x, y in zip(
                            prod_html.find_all('td', {'class': "+fFi1w col col-3-12"}),
                            prod_html.find_all('td', {'class': "Izz52n col col-9-12"})
                        )])
                    except Exception as error:
                        specification = "NA"
                        logging.error(error)

                    return specification

                # Extract description
                def descriptions():
                    try:
                        description = ' '.join([description.p.text for description in prod_html.find_all('div', {'class': "pqHCzB"})])
                    except Exception as error:
                        description = "NA"
                        logging.error(error)
                    # Extract reviews
                    return description

                # Create a list of functions and shuffle it for random execution
                functions = [products, specifications, descriptions]
                random.shuffle(functions)

                # Execute the functions
                product_info = {}
                for func in functions:
                    func_name = func.__name__
                    product_info[func_name] = func()

                for commentbox in prod_html.find_all('div', {'class': "col EPCmJX"}):
                    def ratings():
                        try:
                            rating = commentbox.find_all("div", {"class": "row"})[0].div.text
                        except Exception as error:
                            rating = "NA"
                            logging.error(f"Rating error: {error}")
                        return rating

                    def summarys():
                        try:
                            summary = commentbox.find_all("div", {"class": "row"})[0].p.text
                        except Exception as error:
                            summary = "NA"
                            logging.error(f"Summary error: {error}")
                        return summary

                    def reviews():
                        try:
                            review = commentbox.find_all("div", {"class": "row"})[1].div.div.div.text
                        except Exception as error:
                            review = "NA"
                            logging.error(f"Review error: {error}")
                        return review

                    functions = [ratings, summarys, reviews]
                    random.shuffle(functions)

                    for func in functions:
                        func_name = func.__name__
                        product_info[func_name] = func()

                    # Append extracted information to the DataFrame
                    temp = pd.DataFrame({
                        "Product": [product_info["products"]],
                        "Rating": [product_info['ratings']],
                        "Summary": [product_info['summarys']],
                        "Specification": [product_info['specifications']],
                        "Description": [product_info['descriptions']],
                        "Review": [product_info['reviews']]})

                    data = pd.concat([data, temp], axis=0, ignore_index=True)

            except Exception as e:
                logging.error(f"General error: {e}")
                sleep(300)
                pass
    except Exception as e:
        logging.error(f"General error: {e}")
        sleep(300)
        pass

# Save the extracted data to a CSV file
data.to_csv('../data/scraped_data.csv', index=False)



