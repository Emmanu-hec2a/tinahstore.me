import requests

url = "https://api-tinahstore.up.railway.app/api/v1/products/test-upload/"
file_path = r"C:\Users\PC\Downloads\ss1.jpeg"

with open(file_path, 'rb') as f:
    response = requests.post(url, files={'image': f})
    print(response.status_code)
    print(response.json())