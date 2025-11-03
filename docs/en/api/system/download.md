# File Download

Download converted or processed files from the server.

## API Information

- **Method**: `GET`
- **Endpoint**: `/download/{filename}`
- **Description**: Download file using the filename from conversion response

## Features

- Automatic cleanup after download
- Supports resume downloads
- Correct MIME types included
- Files are cleaned periodically

## Request Example

### cURL Example

```bash
# Download file
curl -O https://api.xyin.online/download/document.pdf

# Download with custom filename
curl -o my_document.pdf https://api.xyin.online/download/document.pdf
```

### Python Example

```python
import requests

def download_file(download_url, output_path):
    full_url = f"https://api.xyin.online{download_url}"
    
    try:
        response = requests.get(full_url, timeout=300)
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ File downloaded: {output_path}")
            return True
        else:
            print(f"✗ Download failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ Download error: {e}")
        return False

# Usage
download_file("/download/document.pdf", "my_document.pdf")
```

## Response

- **200**: File content (binary data)
- **404**: File not found or already cleaned
- **403**: Access denied (invalid filename)

## Notes

- Files are automatically cleaned after download
- Download files promptly to avoid cleanup
- Use the exact filename from API response

