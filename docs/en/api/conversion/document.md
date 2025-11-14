# DOCX ↔ PDF Conversion

## DOCX to PDF

Convert Microsoft Word documents to PDF format.

### Interface Information

- **Request Method**: `POST`
- **Endpoint**: `/convert`
- **Authorization Header**: API Key (JWT)

### Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | DOCX file to convert |
| `output_format` | FormData | Yes | Output format, fixed as `pdf` |
| `custom_filter` | FormData | No | Custom LibreOffice filter |

### Request Example

#### cURL
```bash
curl -X POST "https://api.xyin.online/convert" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.docx" \
  -F "output_format=pdf"
```

#### Python
```python
import requests

def docx_to_pdf(file_path):
    url = "https://api.xyin.online/convert"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        data = {'output_format': 'pdf'}
        
        response = requests.post(url, files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                return result['download_url']
            else:
                print(f"Conversion failed: {result['error']}")
        else:
            print(f"Request failed: {response.status_code}")
    
    return None

# Usage example
download_url = docx_to_pdf("report.docx")
if download_url:
    print(f"Conversion successful, download URL: {download_url}")
```

### Success Response

```json
{
  "success": true,
  "message": "Conversion successful",
  "output_file": "document.pdf",
  "download_url": "/download/document.pdf",
  "error": null
}
```

### Error Response

```json
{
  "success": false,
  "message": "Conversion failed",
  "output_file": null,
  "download_url": null,
  "error": "LibreOffice conversion failed: [specific error]"
}
```

---

## PDF to DOCX

Convert PDF documents to Microsoft Word format.

### Interface Information

- **Request Method**: `POST`
- **Endpoint**: `/convert/pdf-to-word`
- **Authorization Header**: API Key (JWT)

### Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | PDF file to convert |

### Request Example

#### cURL
```bash
curl -X POST "https://api.xyin.online/convert/pdf-to-word" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

#### Python
```python
import requests

def pdf_to_docx(file_path):
    url = "https://api.xyin.online/convert/pdf-to-word"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        
        response = requests.post(url, files=files)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                return result['download_url']
            else:
                print(f"Conversion failed: {result['error']}")
        else:
            print(f"Request failed: {response.status_code}")
    
    return None

# Usage example
download_url = pdf_to_docx("document.pdf")
if download_url:
    print(f"Conversion successful, download URL: {download_url}")
```

### Success Response

```json
{
  "success": true,
  "message": "PDF to Word conversion successful",
  "output_file": "document.docx",
  "download_url": "/download/document.docx",
  "error": null
}
```

