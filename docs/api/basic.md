# 基础信息

## 服务基本接口

### 测试界面

**请求**: `GET /`

用于测试服务是否正常运行。

**响应**: HTML 页面

---

### API 信息

**请求**: `GET /api`

获取 API 基本信息。

**响应**:
```json
{
  "message": "LibreOffice Document Conversion API",
  "version": "1.0.0",
  "docs": "/docs",
  "health": "/health"
}
```

---

### 健康检查

**请求**: `GET /health`

检查服务健康状态和 LibreOffice 版本信息。

**响应** (健康):
```json
{
  "status": "healthy",
  "libreoffice_version": "LibreOffice 7.3.7.2 30(Build:2)",
  "soffice_path": "/usr/bin/soffice"
}
```

**错误响应** (503):
```json
{
  "detail": "Service unhealthy: [错误信息]"
}
```

## 通用规范

### 请求格式

所有文件上传请求都使用 `multipart/form-data` 格式：

```http
POST /endpoint
Content-Type: multipart/form-data

file: [文件二进制数据]
param1: value1
param2: value2
```

### 响应格式

#### 成功响应结构

```json
{
  "success": true,
  "message": "操作成功的描述",
  "output_file": "生成的文件名",
  "download_url": "/download/文件名",
  "error": null,
  // ... 其他特定字段
}
```

#### 失败响应结构

```json
{
  "success": false,
  "message": "失败原因描述",
  "output_file": null,
  "download_url": null,
  "error": "详细错误信息"
}
```

### 文件下载

使用响应中的 `download_url` 字段下载生成的文件：

**请求**: `GET /download/{filename}`

**响应**: 文件二进制流

**特性**:
- 下载后文件自动清理
- 支持断点续传
- 包含正确的 MIME 类型

## 限制说明

### 文件大小限制
- **默认限制**: 最大 10MB
- **超出处理**: 返回 413 错误

### 支持的文件格式

#### 文档格式
- `.docx` - Microsoft Word
- `.doc` - Microsoft Word (旧版)
- `.pdf` - Portable Document Format

#### 图片格式
- `.png` - Portable Network Graphics
- `.jpg`, `.jpeg` - Joint Photographic Experts Group
- `.bmp` - Bitmap
- `.gif` - Graphics Interchange Format
- `.tiff`, `.tif` - Tagged Image File Format

### 处理时间限制
- **单个文件**: 最大处理时间 300 秒
- **批量操作**: 根据文件数量动态调整

## 错误处理

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 403 | 访问被拒绝 |
| 404 | 文件不存在 |
| 413 | 文件过大 |
| 500 | 服务器内部错误 |
| 503 | 服务不可用 |

### 常见错误码

详细的错误处理说明请参考 [错误处理文档](/api/errors)。
