from setuptools import setup, find_packages

setup(name="Chatbot",
      version= "0.0.1",
      author="Sukrit",
      author_email="sukritnegi@gmail.com",
      packages= find_packages(),
      install_requires=["django","python-dotenv", "pandas","bs4","logging","pymongo","flask_cors","requests","langchain","langchain-community","langchain_core","langchain-astradb","google-generativeai","langchain-google-genai"]
)