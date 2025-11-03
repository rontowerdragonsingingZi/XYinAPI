# Error Handling

## HTTP Status Code Description

### Success Status Codes

| Status Code | Description | Usage Scenario |
|--------|------|---------|
| **200** | Request successful | All successful API calls |

### Client Errors

| Status Code | Description | Common Causes | Solution |
|--------|------|---------|---------|
| **400** | Request parameter error | Unsupported file format, missing parameters, invalid parameter values | Check request parameters and file format |
| **403** | Access denied | Directory traversal attack protection triggered | Use correct filename without path characters |
| **404** | File not found | Downloaded file already cleaned or doesn't exist | Regenerate file or check filename |
| **413** | File too large | Uploaded file exceeds 10MB limit | Compress file or split processing |

### Server Errors

| Status Code | Description | Possible Causes | Suggested Handling |
|--------|------|---------|---------|
| **500** | Internal server error | Conversion failed, system exception | Retry request or contact technical support |
| **503** | Service unavailable | LibreOffice service exception | Wait for service recovery or use health check interface |

## Error Response Format

### Standard Error Response

```json
{
  "success": false,
  "message": "User-friendly error description",
  "output_file": null,
  "download_url": null,
  "error": "Detailed technical error information"
}
```

### HTTP Error Response

For HTTP-level errors (such as 404, 413, etc.), the response format is:

```json
{
  "detail": "Error details"
}
```

## Common Errors and Solutions

### File-Related Errors

#### 1. Unsupported File Type (400)

**Error Message**: `"Only PDF files are supported"` or `"Unsupported file format"`

**Solution**:
- Confirm file extension is correct
- Check if file is corrupted
- Validate against supported file format list

**Example**:
```bash
# Error: Upload txt file to PDF conversion interface
curl -X POST "https://api.xyin.online/pdf/to-png" \
  -F "file=@document.txt"

# Correct: Upload PDF file
curl -X POST "https://api.xyin.online/pdf/to-png" \
  -F "file=@document.pdf"
```

#### 2. File Too Large (413)

**Error Message**: `"File too large"`

**Solution**:
- Compress file size
- Split large file into multiple small files
- Optimize document content (remove large images, etc.)

#### 3. File Corrupted (400/500)

**Error Message**: Various conversion failure messages

**Solution**:
- Check if file is complete
- Regenerate or repair file
- Try opening file with other tools to verify

### Parameter-Related Errors

#### 1. Missing Required Parameters (400)

**Error Message**: `"At least one password is required"` or similar

**Solution**:
```bash
# Error: Missing required parameter
curl -X POST "https://api.xyin.online/pdf/encrypt" \
  -F "file=@document.pdf"

# Correct: Provide required parameter
curl -X POST "https://api.xyin.online/pdf/encrypt" \
  -F "file=@document.pdf" \
  -F "user_password=mypassword"
```

#### 2. Invalid Parameter Value (400)

**Error Message**: `"Split count must be ≥1"` or `"Invalid DPI range"`

**Solution**:
- Check parameter value range
- Refer to parameter descriptions in API documentation
- Use valid enum values

### System-Related Errors

#### 1. LibreOffice Service Exception (503)

**Error Message**: `"Service unhealthy: [error message]"`

**Solution**:
- Use health check interface to confirm service status
- Wait for service to auto-recover
- Retry request

**Health Check Example**:
```bash
curl https://api.xyin.online/health
```

#### 2. Conversion Timeout (500)

**Error Message**: Conversion-related error messages

**Solution**:
- Reduce file size
- Simplify document complexity
- Process multiple files in batches

### Download-Related Errors

#### 1. File Not Found (404)

**Reasons**:
- File already auto-cleaned
- Incorrect filename
- Conversion failed without error

**Solution**:
- Re-execute conversion operation
- Check success field in conversion response
- Download conversion result immediately

#### 2. Access Denied (403)

**Reason**: Filename contains path traversal characters

**Solution**:
- Use exact filename returned in response
- Don't modify path portion of filename

## Best Practices

### 1. Error Handling Flow

```python
import requests

def convert_document(file_path, output_format):
    try:
        with open(file_path, 'rb') as f:
            response = requests.post(
                'https://api.xyin.online/convert',
                files={'file': f},
                data={'output_format': output_format},
                timeout=300
            )
        
        # Check HTTP status code
        if response.status_code != 200:
            print(f"HTTP Error: {response.status_code}")
            print(f"Detail: {response.json().get('detail', 'Unknown error')}")
            return None
            
        # Check business logic status
        result = response.json()
        if not result['success']:
            print(f"Conversion failed: {result['message']}")
            print(f"Error details: {result['error']}")
            return None
            
        return result['download_url']
        
    except requests.exceptions.Timeout:
        print("Request timeout - file too large or server busy")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
```

### 2. Retry Mechanism

```python
import time
import requests

def api_call_with_retry(url, data=None, files=None, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(url, data=data, files=files, timeout=300)
            
            # 5xx errors can be retried
            if response.status_code >= 500:
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                    
            return response
            
        except requests.exceptions.Timeout:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
            
    return response
```

### 3. File Validation

```python
import os
import mimetypes

def validate_file(file_path, allowed_types):
    # Check file size (10MB limit)
    if os.path.getsize(file_path) > 10 * 1024 * 1024:
        raise ValueError("File too large (max 10MB)")
    
    # Check MIME type
    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type not in allowed_types:
        raise ValueError(f"Unsupported file type: {mime_type}")
    
    return True

# Usage example
pdf_types = ['application/pdf']
doc_types = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']

try:
    validate_file('document.pdf', pdf_types)
    # Continue processing
except ValueError as e:
    print(f"File validation failed: {e}")
```

## Troubleshooting

### 1. Service Connection Issues

```bash
# Check if service is reachable
curl -I https://api.xyin.online/health

# Check specific error messages
curl -v https://api.xyin.online/api
```

### 2. File Upload Issues

```bash
# Use -v parameter to view detailed request information
curl -v -X POST "https://api.xyin.online/convert" \
  -F "file=@document.docx" \
  -F "output_format=pdf"
```

### 3. Response Parsing Issues

Ensure correct JSON response parsing, pay special attention to the value of `success` field.

## Technical Support

If you encounter persistent issues:

1. Record complete request and response information
2. Include details like file type, size, etc.
3. Provide steps to reproduce the error
4. Check [Online API Documentation](https://api.xyin.online/docs) for latest information

