# Verify Password

Verify if a password can decrypt a PDF file without actually decrypting it.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/verify-password`
- **Technology**: PyMuPDF

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | PDF file to verify |
| `password` | FormData | Yes | Password to verify |

## Request Example

### cURL Example

```bash
curl -X POST "https://api.xyin.online/pdf/verify-password" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@encrypted.pdf" \
  -F "password=testpassword"
```

### Python Example

```python
import requests

def verify_pdf_password(file_path, password):
    url = "https://api.xyin.online/pdf/verify-password"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        data = {'password': password}
        
        response = requests.post(url, files=files, data=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return result['is_valid']
    
    return False

# Usage
if verify_pdf_password("encrypted.pdf", "mypassword"):
    print("✓ Password is correct")
else:
    print("✗ Password is incorrect")
```

## Success Response

### Password is correct
```json
{
  "is_valid": true,
  "message": "Password is correct"
}
```

### Password is incorrect
```json
{
  "is_valid": false,
  "message": "Password is incorrect"
}
```

