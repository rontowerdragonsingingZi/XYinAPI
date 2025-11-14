# PDF Page Count

Get the page count information of a PDF document to quickly understand the document size.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/page-count`
- **Authorization Header**: API Key (JWT)

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | PDF file to count |

## Request Examples

### cURL Example

```bash
curl -X POST "https://api.xyin.online/pdf/page-count" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Python Example

```python
import requests

def get_pdf_page_count(file_path):
    url = "https://api.xyin.online/pdf/page-count"
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            
            response = requests.post(url, files=files, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    return result['page_count']
                else:
                    print(f"Failed to get page count: {result['error']}")
            else:
                print(f"Request failed: {response.status_code}")
                
    except Exception as e:
        print(f"Error during processing: {e}")
    
    return None

# Usage example
page_count = get_pdf_page_count("document.pdf")
if page_count is not None:
    print(f"PDF has {page_count} pages")
```

## Success Response

```json
{
  "success": true,
  "page_count": 10,
  "filename": "document.pdf",
  "error": null
}
```

## Error Response

```json
{
  "success": false,
  "page_count": null,
  "filename": null,
  "error": "Only PDF files are supported"
}
```

