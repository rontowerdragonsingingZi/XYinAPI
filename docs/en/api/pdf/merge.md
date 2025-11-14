# PDF Merge

Merge multiple PDF files into a single document.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/merge`
- **Authorization Header**: API Key (JWT)

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `files` | FormData | Yes | Multiple PDF files to merge |

## Request Example

### cURL Example

```bash
curl -X POST "https://api.xyin.online/pdf/merge" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@file1.pdf" \
  -F "files=@file2.pdf" \
  -F "files=@file3.pdf"
```

### Python Example

```python
import requests

def merge_pdfs(pdf_files, output_path="merged.pdf"):
    url = "https://api.xyin.online/pdf/merge"
    
    files = [('files', open(pdf, 'rb')) for pdf in pdf_files]
    
    try:
        response = requests.post(url, files=files, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                download_url = result['download_url']
                pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                
                with open(output_path, 'wb') as f:
                    f.write(pdf_response.content)
                
                print(f"✓ Merged PDF saved as: {output_path}")
                return output_path
    finally:
        for _, f in files:
            f.close()
    
    return None

# Usage
merged_file = merge_pdfs(["file1.pdf", "file2.pdf", "file3.pdf"])
```

## Success Response

```json
{
  "success": true,
  "message": "Successfully merged 3 PDF files",
  "output_file": "merged.pdf",
  "download_url": "/download/merged.pdf",
  "error": null
}
```

