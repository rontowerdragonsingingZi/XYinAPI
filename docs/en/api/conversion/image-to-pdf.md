# Images to PDF

Convert one or more images into a PDF document, supporting multiple common image formats.

## API Information

- **Method**: `POST`
- **Endpoint**: `/image/to-pdf`
- **Technology**: PyMuPDF

## Supported Image Formats

| Format | Extension | Description |
|------|--------|------|
| **PNG** | `.png` | Recommended format, supports transparency |
| **JPEG** | `.jpg`, `.jpeg` | Common photo format |
| **BMP** | `.bmp` | Windows bitmap format |
| **GIF** | `.gif` | Supports animation (only first frame used) |
| **TIFF** | `.tiff`, `.tif` | Professional image format |

## Request Parameters

| Parameter | Type | Required | Description |
|--------|------|---------|------|
| `files` | FormData | Yes | One or more image files (supports multiple file upload) |

## Request Examples

### cURL Example

```bash
# Single image
curl -X POST "https://api.xyin.online/image/to-pdf" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@image1.png"

# Multiple images
curl -X POST "https://api.xyin.online/image/to-pdf" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@image1.png" \
  -F "files=@image2.jpg" \
  -F "files=@image3.png"
```

### Python Example

```python
import requests
import os

def images_to_pdf(image_paths, output_path=None):
    url = "https://api.xyin.online/image/to-pdf"
    
    files = []
    try:
        for image_path in image_paths:
            if os.path.exists(image_path):
                files.append(('files', open(image_path, 'rb')))
        
        if not files:
            print("Error: No valid image files")
            return None
        
        print(f"Converting {len(files)} images to PDF...")
        
        response = requests.post(url, files=files, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✓ Conversion successful: {result['message']}")
                
                download_url = result['download_url']
                pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                
                if pdf_response.status_code == 200:
                    if not output_path:
                        output_path = result['output_file']
                    
                    with open(output_path, 'wb') as pdf_file:
                        pdf_file.write(pdf_response.content)
                    
                    print(f"✓ PDF saved as: {output_path}")
                    return output_path
        else:
            print(f"✗ Request failed: {response.status_code}")
            
    except Exception as e:
        print(f"✗ Error during processing: {e}")
    finally:
        for _, file_obj in files:
            file_obj.close()
    
    return None

# Usage example
image_list = ["image1.png", "image2.jpg", "image3.png"]
pdf_file = images_to_pdf(image_list, "multi_images.pdf")
```

## Success Response

```json
{
  "success": true,
  "message": "Successfully converted 3 images to PDF",
  "output_file": "images_to_pdf_a1b2c3d4.pdf",
  "download_url": "/download/images_to_pdf_a1b2c3d4.pdf",
  "image_count": 3,
  "error": null
}
```

## Error Responses

### No files uploaded
```json
{
  "success": false,
  "message": "Conversion failed",
  "error": "At least 1 image file is required",
  "output_file": null,
  "download_url": null
}
```

