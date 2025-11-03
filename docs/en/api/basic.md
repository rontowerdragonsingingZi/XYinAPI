# Basic Information

## Service Basic Interface

### Test Interface

**Request**: `GET /`

Used to test whether the service is running normally.

**Response**: HTML page

---

### API Information

**Request**: `GET /api`

Get basic API information.

**Response**:
```json
{
  "message": "LibreOffice Document Conversion API",
  "version": "1.0.0",
  "docs": "/docs",
  "health": "/health"
}
```

---

### Health Check

**Request**: `GET /health`

Check service health status and LibreOffice version information.

**Response** (healthy):
```json
{
  "status": "healthy",
  "libreoffice_version": "LibreOffice 7.3.7.2 30(Build:2)",
  "soffice_path": "/usr/bin/soffice"
}
```

**Error Response** (503):
```json
{
  "detail": "Service unhealthy: [error message]"
}
```

## General Specifications

### Request Format

All file upload requests use `multipart/form-data` format:

```http
POST /endpoint
Content-Type: multipart/form-data

file: [file binary data]
param1: value1
param2: value2
```

### Response Format

#### Success Response Structure

```json
{
  "success": true,
  "message": "Description of successful operation",
  "output_file": "generated filename",
  "download_url": "/download/filename",
  "error": null,
  // ... other specific fields
}
```

#### Error Response Structure

```json
{
  "success": false,
  "message": "Description of failure reason",
  "output_file": null,
  "download_url": null,
  "error": "Detailed error information"
}
```

### File Download

Use the `download_url` field in the response to download the generated file:

**Request**: `GET /download/{filename}`

**Response**: File binary stream

**Features**:
- Auto cleanup after download
- Support for resume downloads
- Includes correct MIME types

## Limitations

### File Size Limit
- **Default Limit**: Maximum 10MB
- **Exceed Handling**: Returns 413 error

### Supported File Formats

#### Document Formats
- `.docx` - Microsoft Word
- `.doc` - Microsoft Word (legacy)
- `.pdf` - Portable Document Format

#### Image Formats
- `.png` - Portable Network Graphics
- `.jpg`, `.jpeg` - Joint Photographic Experts Group
- `.bmp` - Bitmap
- `.gif` - Graphics Interchange Format
- `.tiff`, `.tif` - Tagged Image File Format

### Processing Time Limit
- **Single File**: Maximum processing time 300 seconds
- **Batch Operations**: Dynamically adjusted based on file count

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|--------|------|
| 200 | Request successful |
| 400 | Request parameter error |
| 403 | Access denied |
| 404 | File not found |
| 413 | File too large |
| 500 | Internal server error |
| 503 | Service unavailable |

### Common Error Codes

For detailed error handling instructions, please refer to [Error Handling Documentation](/en/api/errors).

