# PDF to PNG Images

Convert each page of a PDF document into individual HD PNG image files.

## API Information

- **Method**: `POST`
- **Endpoint**: `/pdf/to-png`
- **Technology**: PyMuPDF

## Conversion Settings

- **Resolution**: 2x scaling (HD quality)
- **Format**: PNG
- **Output**: One independent PNG file per page
- **Transparency**: Supports transparent backgrounds (if PDF has transparent elements)

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `file` | FormData | Yes | PDF file to convert |

## Request Examples

### cURL Example

```bash
curl -X POST "https://api.xyin.online/pdf/to-png" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Python Example

```python
import requests
import os

def pdf_to_png(file_path, output_dir="./png_images"):
    url = "https://api.xyin.online/pdf/to-png"
    
    os.makedirs(output_dir, exist_ok=True)
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        
        print(f"Converting {file_path}...")
        response = requests.post(url, files=files, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✓ Conversion successful, generated {result['page_count']} images")
                
                downloaded_files = []
                for i, download_url in enumerate(result['download_urls']):
                    img_response = requests.get(f"https://api.xyin.online{download_url}")
                    
                    if img_response.status_code == 200:
                        base_name = os.path.splitext(os.path.basename(file_path))[0]
                        img_filename = f"{base_name}_page{i+1}.png"
                        img_path = os.path.join(output_dir, img_filename)
                        
                        with open(img_path, 'wb') as img_file:
                            img_file.write(img_response.content)
                        
                        downloaded_files.append(img_path)
                        print(f"  → Saved: {img_filename}")
                
                return downloaded_files
            else:
                print(f"✗ Conversion failed: {result['error']}")
        else:
            print(f"✗ Request failed: {response.status_code}")
    
    return []

# Usage example
images = pdf_to_png("document.pdf")
if images:
    print(f"Conversion completed, generated {len(images)} images")
```

## Success Response

```json
{
  "success": true,
  "message": "PDF successfully converted to 3 PNG images",
  "page_count": 3,
  "png_files": [
    "document_page1.png",
    "document_page2.png",
    "document_page3.png"
  ],
  "download_urls": [
    "/download/document_page1.png",
    "/download/document_page2.png",
    "/download/document_page3.png"
  ],
  "error": null
}
```

## Error Responses

### Invalid file format
```json
{
  "success": false,
  "message": "Conversion failed",
  "error": "Only PDF files are supported",
  "output_file": null,
  "download_url": null
}
```

