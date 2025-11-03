# Health Check

Check service health status and LibreOffice version information to ensure API service is running properly.

## API Information

- **Method**: `GET`
- **Endpoint**: `/health`
- **Description**: Quick health check without parameters

## Request Example

### cURL Example

```bash
curl https://api.xyin.online/health
```

### Python Example

```python
import requests

def check_api_health():
    url = "https://api.xyin.online/health"
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✓ Service status: Healthy")
            print(f"  LibreOffice version: {result['libreoffice_version']}")
            print(f"  LibreOffice path: {result['soffice_path']}")
            return True
        else:
            print(f"✗ Service error: HTTP {response.status_code}")
            if response.status_code == 503:
                error_detail = response.json().get('detail', 'Unknown error')
                print(f"  Error details: {error_detail}")
            return False
            
    except requests.exceptions.Timeout:
        print("✗ Request timeout: Service may be unavailable")
        return False
    except requests.exceptions.ConnectionError:
        print("✗ Connection failed: Cannot connect to server")
        return False
    except Exception as e:
        print(f"✗ Check failed: {e}")
        return False

# Usage
if check_api_health():
    print("Ready to use API service")
else:
    print("Please check service status or try again later")
```

## Success Response

```json
{
  "status": "healthy",
  "libreoffice_version": "LibreOffice 7.3.7.2 30(Build:2)",
  "soffice_path": "/usr/bin/soffice"
}
```

## Error Response

When service is unhealthy, returns 503 status code:

```json
{
  "detail": "Service unhealthy: LibreOffice not found or not responding"
}
```

