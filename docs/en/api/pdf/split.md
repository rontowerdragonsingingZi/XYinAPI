# PDF Split

Intelligently split a PDF document into specified number of parts with evenly distributed pages.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/split`
- **Technology**: PyMuPDF

## Split Logic

- **10 pages split into 10 parts** = 1 page per part
- **10 pages split into 5 parts** = 2 pages per part
- **10 pages split into 3 parts** = 4 pages + 4 pages + 2 pages (rounded up when not evenly divisible)

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | PDF file to split |
| `split_count` | FormData | Yes | Number of parts (must be ≥ 1 and not exceed total pages) |

## Request Examples

### cURL Example

```bash
curl -X POST "https://api.xyin.online/pdf/split" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "split_count=3"
```

### Python Example

```python
import requests
import os

def split_pdf(file_path, split_count, output_dir="./split_pdfs"):
    url = "https://api.xyin.online/pdf/split"
    
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {'split_count': str(split_count)}
            
            print(f"Splitting {file_path} into {split_count} parts...")
            response = requests.post(url, files=files, data=data, timeout=300)
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    print(f"✓ Split successful: {result['message']}")
                    
                    downloaded_files = []
                    for i, download_url in enumerate(result['download_urls']):
                        pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                        
                        if pdf_response.status_code == 200:
                            filename = result['split_files'][i]
                            filepath = os.path.join(output_dir, filename)
                            
                            with open(filepath, 'wb') as pdf_file:
                                pdf_file.write(pdf_response.content)
                            
                            downloaded_files.append(filepath)
                            print(f"  → Saved: {filename}")
                    
                    return downloaded_files
                else:
                    print(f"✗ Split failed: {result['error']}")
            else:
                print(f"✗ Request failed: {response.status_code}")
                
    except Exception as e:
        print(f"✗ Error during processing: {e}")
    
    return []

# Usage example
split_files = split_pdf("large_document.pdf", 3)
if split_files:
    print(f"Split completed, generated {len(split_files)} files")
```

## Success Response

```json
{
  "success": true,
  "message": "PDF successfully split into 3 files",
  "split_files": [
    "document_part1.pdf",
    "document_part2.pdf",
    "document_part3.pdf"
  ],
  "download_urls": [
    "/download/document_part1.pdf",
    "/download/document_part2.pdf",
    "/download/document_part3.pdf"
  ],
  "error": null
}
```

## Error Response

```json
{
  "success": false,
  "message": "Split failed",
  "error": "Split count must be ≥1",
  "split_files": null,
  "download_urls": null
}
```

