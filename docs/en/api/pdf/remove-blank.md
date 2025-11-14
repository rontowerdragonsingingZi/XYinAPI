# Remove Blank Pages

Auto-detect and remove blank pages from PDF documents.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/remove-blank-pages`
- **Authorization Header**: API Key (JWT)

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | PDF file to process |

## Request Example

### cURL Example

```bash
curl -X POST "https://api.xyin.online/pdf/remove-blank-pages" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Python Example

```python
import requests

def remove_blank_pages(file_path, output_path="cleaned.pdf"):
    url = "https://api.xyin.online/pdf/remove-blank-pages"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        
        response = requests.post(url, files=files, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                download_url = result['download_url']
                pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                
                with open(output_path, 'wb') as f:
                    f.write(pdf_response.content)
                
                print(f"✓ Cleaned PDF saved as: {output_path}")
                print(f"  Removed {result['removed_pages']} blank pages")
                return output_path
    
    return None

# Usage
cleaned_file = remove_blank_pages("document.pdf")
```

## Success Response

```json
{
  "success": true,
  "message": "Removed 3 blank pages",
  "removed_pages": 3,
  "output_file": "document_cleaned.pdf",
  "download_url": "/download/document_cleaned.pdf",
  "error": null
}
```

