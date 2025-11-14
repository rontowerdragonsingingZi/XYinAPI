# PDF Extract Text

Extract text content from PDF documents.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/extract-text`
- **Authorization Header**: API Key (JWT)

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | PDF file to extract text from |

## Request Example

### cURL Example

```bash
curl -X POST "https://api.xyin.online/pdf/extract-text" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Python Example

```python
import requests

def extract_pdf_text(file_path):
    url = "https://api.xyin.online/pdf/extract-text"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        
        response = requests.post(url, files=files, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                return result['text']
            else:
                print(f"Extraction failed: {result['error']}")
        else:
            print(f"Request failed: {response.status_code}")
    
    return None

# Usage
text = extract_pdf_text("document.pdf")
if text:
    print(f"Extracted text:\n{text}")
```

## Success Response

```json
{
  "success": true,
  "text": "Extracted text content...",
  "page_count": 10,
  "error": null
}
```

