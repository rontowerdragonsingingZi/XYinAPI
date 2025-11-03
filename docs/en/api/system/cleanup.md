# Cleanup Files

Clean up temporary files and converted documents from the server.

## API Information

- **Method**: `POST`
- **Endpoint**: `/cleanup`
- **Description**: Clean up old temporary files

## Features

- Removes temporary conversion files
- Cleans up downloaded files
- Frees server disk space
- Automatic periodic cleanup

## Request Example

### cURL Example

```bash
curl -X POST https://api.xyin.online/cleanup
```

### Python Example

```python
import requests

def cleanup_files():
    url = "https://api.xyin.online/cleanup"
    
    try:
        response = requests.post(url, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ Cleanup successful: {result['message']}")
            return True
        else:
            print(f"✗ Cleanup failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

# Usage
cleanup_files()
```

## Success Response

```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "files_removed": 42
}
```

## Notes

- Server automatically cleans up old files periodically
- Manual cleanup can free disk space immediately
- Downloaded files will be removed
- In-progress conversions are not affected

