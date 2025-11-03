# API 文档

LibreOffice Document Conversion API 是一个强大的文档转换服务，提供多种文档格式之间的转换功能。

## 🌐 服务地址

- **API Base URL**: `https://api.xyin.online`
- **Swagger UI**: [https://api.xyin.online/docs](https://api.xyin.online/docs)
- **ReDoc**: [https://api.xyin.online/redoc](https://api.xyin.online/redoc)

## 📋 支持的转换类型

| 转换类型 | 描述 | 底层技术 |
|---------|------|---------|
| **DOCX → PDF** | Word 文档转 PDF | LibreOffice |
| **PDF → DOCX** | PDF 转 Word 文档 | pdf2docx |
| **PDF → PNG** | PDF 转图片 | PyMuPDF |
| **Word → 高清图片** | Word 转高质量图片 | LibreOffice + PyMuPDF |
| **图片 → PDF** | 图片合成 PDF | PyMuPDF |
| **PDF 页数识别** | 获取 PDF 页数信息 | PyMuPDF |
| **PDF 拆分** | 将 PDF 拆分为多个文件 | PyMuPDF |
| **PDF 合并** | 合并多个 PDF 文件 | PyMuPDF |
| **PDF 文字提取** | 提取 PDF 中的文本 | PyMuPDF |
| **PDF 加水印** | 为 PDF 添加水印 | PyMuPDF |
| **PDF 去除空白页** | 自动识别并删除空白页 | PyMuPDF |
| **PDF 加密** | 为 PDF 添加密码保护 | PyMuPDF |
| **PDF 解密** | 解除 PDF 密码保护 | PyMuPDF |

## 🚀 快速开始

### 1. 基础请求

所有文件上传请求都使用 `multipart/form-data` 格式：

```http
POST /convert
Content-Type: multipart/form-data

file: [文件内容]
output_format: pdf
```

### 2. 响应格式

成功响应：
```json
{
  "success": true,
  "message": "转换成功",
  "output_file": "document.pdf",
  "download_url": "/download/document.pdf",
  "error": null
}
```

失败响应：
```json
{
  "success": false,
  "message": "转换失败",
  "output_file": null,
  "download_url": null,
  "error": "错误详细信息"
}
```

### 3. 文件下载

使用返回的 `download_url` 下载转换后的文件：

```bash
curl -O https://api.xyin.online/download/document.pdf
```

**注意**: 文件下载后会自动清理，请及时保存。

## 📚 API 分类

### [文档转换](/api/conversion/document)
- DOCX ↔ PDF 转换
- Word → 高清图片
- 图片 → PDF
- PDF → PNG

### [PDF 操作](/api/pdf/page-count)
- 页数统计
- 文件拆分与合并
- 文字提取
- 水印处理
- 空白页清理

### [PDF 安全](/api/security/encrypt)
- 加密保护
- 密码验证
- 安全解密

### [系统管理](/api/system/health)
- 健康检查
- 文件管理
- 系统清理

## ⚡ 性能指标

- **文件大小限制**: 最大 10MB
- **并发处理**: 支持多用户同时使用
- **处理速度**: 
  - 文档转换: &lt; 5 秒
  - PDF 操作: &lt; 3 秒
  - 图片处理: &lt; 2 秒

## 🛡️ 安全特性

- **文件验证**: 严格的文件格式检查
- **路径保护**: 防止目录遍历攻击
- **自动清理**: 临时文件定期清理
- **加密支持**: 多种 PDF 加密算法

## 📝 使用建议

1. **文件格式**: 确保上传的文件格式正确
2. **文件大小**: 建议小于 10MB 以获得最佳性能
3. **错误处理**: 始终检查响应中的 `success` 字段
4. **及时下载**: 转换后的文件会定期清理
5. **批量处理**: 对于大量文件，建议分批处理

## 🔗 相关链接

- [错误码说明](/api/errors)
- [在线测试工具](https://api.xyin.online/docs)
