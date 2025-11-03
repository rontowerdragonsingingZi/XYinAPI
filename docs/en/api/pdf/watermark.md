# PDF Watermark

Add watermark to PDF documents.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/watermark`
- **Technology**: PyMuPDF

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | PDF file to add watermark |
| `watermark_text` | FormData | Yes | Watermark text content |

## Request Example

### cURL Example

```bash
curl -X POST "https://api.xyin.online/pdf/watermark" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "watermark_text=CONFIDENTIAL"
```

### Python Example

```python
import requests

def add_watermark(file_path, watermark_text, output_path="watermarked.pdf"):
    url = "https://api.xyin.online/pdf/watermark"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        data = {'watermark_text': watermark_text}
        
        response = requests.post(url, files=files, data=data, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                download_url = result['download_url']
                pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                
                with open(output_path, 'wb') as f:
                    f.write(pdf_response.content)
                
                print(f"✓ Watermarked PDF saved as: {output_path}")
                return output_path
    
    return None

# Usage
watermarked_file = add_watermark("document.pdf", "CONFIDENTIAL")
```

## Success Response

```json
{
  "success": true,
  "message": "Watermark added successfully",
  "output_file": "document_watermarked.pdf",
  "download_url": "/download/document_watermarked.pdf",
  "error": null
}
```

