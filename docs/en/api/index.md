# API Documentation

LibreOffice Document Conversion API is a powerful document conversion service that provides conversion functions between various document formats.

## 🌐 Service Address

- **API Base URL**: `https://api.xyin.online`
- **Swagger UI**: [https://api.xyin.online/docs](https://api.xyin.online/docs)
- **ReDoc**: [https://api.xyin.online/redoc](https://api.xyin.online/redoc)

## 📋 Supported Conversion Types

| Conversion Type | Description |
|---------|------|
| **DOCX → PDF** | Word to PDF |
| **PDF → DOCX** | PDF to Word |
| **PDF → PNG** | PDF to Images |
| **Word → HD Image** | Word to High-Quality Images |
| **Image → PDF** | Images to PDF |
| **PDF Page Count** | Get PDF page information |
| **PDF Split** | Split PDF into multiple files |
| **PDF Merge** | Merge multiple PDF files |
| **PDF Extract Text** | Extract text from PDF |
| **PDF Watermark** | Add watermark to PDF |
| **Remove Blank Pages** | Auto-detect and remove blank pages |
| **PDF Encrypt** | Add password protection to PDF |
| **PDF Decrypt** | Remove PDF password protection |

## 🚀 Quick Start

### 1. Authentication

All API requests require JWT (JSON Web Token) authentication in the HTTP request header.

**Authentication Method**: Add your API Key (JWT Token) to the `Authorization` Header

```http
Authorization: Bearer YOUR_API_KEY
```

::: tip Get API Key
If you don't have an API Key yet, please visit the [Get API Key](/en/apikey) page to apply.
:::

### 2. Basic Request

All file upload requests use `multipart/form-data` format and must include authentication:

```http
POST /convert
Authorization: Bearer YOUR_API_KEY
Content-Type: multipart/form-data

file: [file content]
output_format: pdf
```

**Complete cURL Example**:

```bash
curl -X POST "https://api.xyin.online/convert" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.docx" \
  -F "output_format=pdf"
```

### 3. Response Format

Success response:
```json
{
  "success": true,
  "message": "Conversion successful",
  "output_file": "document.pdf",
  "download_url": "/download/document.pdf",
  "error": null
}
```

Error response:
```json
{
  "success": false,
  "message": "Conversion failed",
  "output_file": null,
  "download_url": null,
  "error": "Error details"
}
```

### 4. File Download

Use the returned `download_url` to download the converted file:

```bash
curl -O https://api.xyin.online/download/document.pdf
```

**Note**: Files are automatically cleaned after download, please save them promptly.

## 📚 API Categories

### [Document Conversion](/en/api/conversion/document)
- DOCX ↔ PDF Conversion
- Word → HD Images
- Images → PDF
- PDF → PNG

### [PDF Operations](/en/api/pdf/page-count)
- Page Count
- File Split & Merge
- Text Extraction
- Watermark Processing
- Blank Page Removal

### [PDF Security](/en/api/security/encrypt)
- Encryption Protection
- Password Verification
- Secure Decryption

### [System Management](/en/api/system/health)
- Health Check
- File Management
- System Cleanup

## ⚡ Performance Metrics

- **File Size Limit**: Maximum 10MB
- **Concurrent Processing**: Supports multiple users simultaneously
- **Processing Speed**: 
  - Document conversion: < 5 seconds
  - PDF operations: < 3 seconds
  - Image processing: < 2 seconds

## 🛡️ Security Features

- **File Validation**: Strict file format checking
- **Path Protection**: Prevent directory traversal attacks
- **Auto Cleanup**: Regular cleanup of temporary files
- **Encryption Support**: Multiple PDF encryption algorithms

## 📝 Usage Recommendations

1. **File Format**: Ensure uploaded file format is correct
2. **File Size**: Recommended under 10MB for best performance
3. **Error Handling**: Always check the `success` field in response
4. **Timely Download**: Converted files are cleaned periodically
5. **Batch Processing**: For large number of files, process in batches

## 🔗 Related Links

- [Error Codes](/en/api/errors)
- [Online Testing Tool](https://api.xyin.online/docs)

