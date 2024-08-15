import pandas as pd
from langchain_core.documents import Document


def dataconveter():
    product_data=pd.read_csv("../data/scraped_data.csv")

    product_data['Rating'] = product_data['Rating'].astype(str)

    # Combine all relevant fields into a single string for embedding generation
    product_data['Combined_Info'] = " Product:"+product_data['Product'] + " Descrpition:" + product_data['Description'] + " Specification:" + product_data['Specification'] + " Review:" + product_data['Review']

    # Replace NaN values with an empty string if necessary
    product_data['Combined_Info'] = product_data['Combined_Info'].fillna('')


    data=product_data[["Product","Combined_Info"]]

    product_list = []

    # Iterate over the rows of the DataFrame
    for index, row in data.iterrows():
        # Construct an object with 'product_name' and 'review' attributes
        obj = {
                'product_name': row['Product'],
                'review': row['Combined_Info']
            }
        # Append the object to the list
        product_list.append(obj)

        
            
    docs = []
    for entry in product_list:
        metadata = {"product_name": entry['product_name']}
        doc = Document(page_content=entry['review'], metadata=metadata)
        docs.append(doc)
    return docs