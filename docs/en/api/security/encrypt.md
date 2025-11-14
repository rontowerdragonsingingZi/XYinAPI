# PDF Encrypt

Add password protection to PDF files with support for various encryption algorithms and permission controls.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/encrypt`
- **Authorization Header**: API Key (JWT)

## Encryption Features

### Supported Encryption Algorithms
- **RC4-128**: Traditional RC4 encryption
- **AES-128**: AES 128-bit encryption (recommended)
- **AES-256**: AES 256-bit encryption (strongest, recommended)

### Password Types
- **user_password**: User password (required to open PDF)
- **owner_password**: Owner password (controls editing, printing permissions)

### Permission Controls
- **allow_printing**: Whether to allow printing
- **allow_modify**: Whether to allow editing

## Request Parameters

| Parameter | Type | Required | Description | Default |
|--------|------|---------|------|--------|
| `file` | FormData | Yes | PDF file to encrypt | - |
| `user_password` | FormData | No* | User password (open password) | - |
| `owner_password` | FormData | No* | Owner password (permission password) | - |
| `encryption_method` | FormData | No | Encryption algorithm | AES-256 |
| `allow_printing` | FormData | No** | Whether to allow printing | true |
| `allow_modify` | FormData | No** | Whether to allow editing | true |

**Important Restrictions**:
1. `*` At least one of `user_password` or `owner_password` must be provided
2. `**` When `owner_password` is provided, at least one of `allow_printing` or `allow_modify` must be `false`

## Request Examples

### cURL Example

#### Basic user password encryption
```bash
curl -X POST "https://api.xyin.online/pdf/encrypt" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "user_password=mypassword123"
```

#### Full permission control
```bash
curl -X POST "https://api.xyin.online/pdf/encrypt" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "user_password=userpass123" \
  -F "owner_password=ownerpass123" \
  -F "encryption_method=AES-256" \
  -F "allow_printing=false" \
  -F "allow_modify=true"
```

### Python Example

```python
import requests
import os

def encrypt_pdf(file_path, user_password=None, owner_password=None,
                encryption_method="AES-256", allow_printing=True,
                allow_modify=True, output_dir="./encrypted"):
    
    if not user_password and not owner_password:
        print("Error: At least one password is required")
        return None
    
    url = "https://api.xyin.online/pdf/encrypt"
    
    data = {'encryption_method': encryption_method}
    
    if user_password:
        data['user_password'] = user_password
    
    if owner_password:
        data['owner_password'] = owner_password
        data['allow_printing'] = str(allow_printing).lower()
        data['allow_modify'] = str(allow_modify).lower()
    
    os.makedirs(output_dir, exist_ok=True)
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        
        print(f"Encrypting {file_path}...")
        response = requests.post(url, files=files, data=data, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✓ Encryption successful: {result['message']}")
                
                download_url = result['download_url']
                encrypted_response = requests.get(f"https://api.xyin.online{download_url}")
                
                if encrypted_response.status_code == 200:
                    output_filename = result['output_file']
                    output_path = os.path.join(output_dir, output_filename)
                    
                    with open(output_path, 'wb') as encrypted_file:
                        encrypted_file.write(encrypted_response.content)
                    
                    print(f"✓ Encrypted file saved: {output_path}")
                    return output_path
    
    return None

# Usage example
encrypted_file = encrypt_pdf("document.pdf", user_password="secret123")
```

## Success Response

```json
{
  "success": true,
  "message": "PDF encryption successful",
  "output_file": "document_encrypted.pdf",
  "download_url": "/download/document_encrypted.pdf",
  "encryption_method": "AES-256",
  "allow_printing": false,
  "allow_modify": true,
  "error": null
}
```

## Error Responses

### Missing password
```json
{
  "success": false,
  "message": "Encryption failed",
  "error": "At least one password is required",
  "output_file": null,
  "download_url": null
}
```

