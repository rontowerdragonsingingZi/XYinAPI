# PDF Decrypt

Remove password protection from PDF files.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/decrypt`
- **Authorization Header**: API Key (JWT)

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | Encrypted PDF file |
| `password` | FormData | Yes | Password to decrypt the PDF |

## Request Example

### cURL Example

```bash
curl -X POST "https://api.xyin.online/pdf/decrypt" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@encrypted.pdf" \
  -F "password=mypassword123"
```

### Python Example

```python
import requests

def decrypt_pdf(file_path, password, output_path="decrypted.pdf"):
    url = "https://api.xyin.online/pdf/decrypt"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        data = {'password': password}
        
        response = requests.post(url, files=files, data=data, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                download_url = result['download_url']
                pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                
                with open(output_path, 'wb') as f:
                    f.write(pdf_response.content)
                
                print(f"✓ Decrypted PDF saved as: {output_path}")
                return output_path
    
    return None

# Usage
decrypted_file = decrypt_pdf("encrypted.pdf", "mypassword123")
```

## Success Response

```json
{
  "success": true,
  "message": "PDF decryption successful",
  "output_file": "document_decrypted.pdf",
  "download_url": "/download/document_decrypted.pdf",
  "error": null
}
```

