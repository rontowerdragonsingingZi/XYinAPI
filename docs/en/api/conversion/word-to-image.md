# Word to HD Images

Convert Microsoft Word documents to high-quality PNG image format, generating one independent image file per page.

## API Information

- **Method**: `POST`
- **Endpoint**: `/word/to-image`
- **Technology**: LibreOffice + PyMuPDF

## Conversion Process

1. **Word → PDF**: Convert Word document to PDF using LibreOffice
2. **PDF → PNG**: Render each PDF page to HD PNG image using PyMuPDF

## Request Parameters

| Parameter | Type | Required | Description | Default | Range |
|--------|------|---------|------|--------|------|
| `file` | FormData | Yes | Word file (.docx, .doc) | - | - |
| `dpi` | FormData | No | Image resolution DPI | 300 | 100-600 |

### DPI Settings

| DPI Range | Quality Level | File Size | Conversion Speed | Recommended Use |
|---------|---------|---------|---------|---------|
| 100-150 | Normal quality | Small | Fast | Preview, web display |
| **200-300** | **HD quality** | **Medium** | **Moderate** | **Printing, archiving (recommended)** |
| 400-600 | Ultra HD quality | Large | Slow | Professional printing, fine design |

## Request Examples

### cURL Example

```bash
# Basic conversion (default 300 DPI)
curl -X POST "https://api.xyin.online/word/to-image" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.docx"

# Custom DPI
curl -X POST "https://api.xyin.online/word/to-image" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.docx" \
  -F "dpi=150"
```

### Python Example

```python
import requests
import os

def word_to_images(file_path, dpi=300, output_dir="./images"):
    url = "https://api.xyin.online/word/to-image"
    
    os.makedirs(output_dir, exist_ok=True)
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        data = {'dpi': str(dpi)}
        
        print(f"Converting {file_path} (DPI: {dpi})...")
        response = requests.post(url, files=files, data=data, timeout=300)
        
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
images = word_to_images("report.docx")
if images:
    print(f"Conversion completed, generated {len(images)} images")
```

## Success Response

```json
{
  "success": true,
  "message": "Word document successfully converted to 3 HD images (DPI: 300)",
  "page_count": 3,
  "image_files": [
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
  "error": "Only Word files are supported",
  "output_file": null,
  "download_url": null
}
```

### Invalid DPI parameter
```json
{
  "success": false,
  "message": "Conversion failed",
  "error": "Invalid DPI range, please use value between 100-600",
  "output_file": null,
  "download_url": null
}
```

