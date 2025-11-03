# DOCX ↔ PDF 转换

## DOCX 转 PDF

将 Microsoft Word 文档转换为 PDF 格式。

### 接口信息

- **请求方式**: `POST`
- **接口地址**: `/convert`
- **底层技术**: LibreOffice

### 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待转换的 DOCX 文件 |
| `output_format` | FormData | 是 | 输出格式，固定为 `pdf` |
| `custom_filter` | FormData | 否 | 自定义 LibreOffice 过滤器 |

### 请求示例

#### cURL
```bash
curl -X POST "https://api.xyin.online/convert" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.docx" \
  -F "output_format=pdf"
```

#### Python
```python
import requests

def docx_to_pdf(file_path):
    url = "https://api.xyin.online/convert"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        data = {'output_format': 'pdf'}
        
        response = requests.post(url, files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                return result['download_url']
            else:
                print(f"转换失败: {result['error']}")
        else:
            print(f"请求失败: {response.status_code}")
    
    return None

# 使用示例
download_url = docx_to_pdf("report.docx")
if download_url:
    print(f"转换成功，下载地址: {download_url}")
```

### 成功响应

```json
{
  "success": true,
  "message": "转换成功",
  "output_file": "document.pdf",
  "download_url": "/download/document.pdf",
  "error": null
}
```

### 错误响应

```json
{
  "success": false,
  "message": "转换失败",
  "output_file": null,
  "download_url": null,
  "error": "LibreOffice conversion failed: [具体错误]"
}
```

---

## PDF 转 DOCX

将 PDF 文档转换为 Microsoft Word 格式。

### 接口信息

- **请求方式**: `POST`
- **接口地址**: `/convert/pdf-to-word`
- **底层技术**: pdf2docx

### 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待转换的 PDF 文件 |

### 请求示例

#### cURL
```bash
curl -X POST "https://api.xyin.online/convert/pdf-to-word" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

#### Python
```python
import requests

def pdf_to_docx(file_path):
    url = "https://api.xyin.online/convert/pdf-to-word"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        
        response = requests.post(url, files=files)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                return result['download_url']
            else:
                print(f"转换失败: {result['error']}")
        else:
            print(f"请求失败: {response.status_code}")
    
    return None

# 使用示例
download_url = pdf_to_docx("document.pdf")
if download_url:
    print(f"转换成功，下载地址: {download_url}")
```

### 成功响应

```json
{
  "success": true,
  "message": "PDF转Word成功",
  "output_file": "document.docx",
  "download_url": "/download/document.docx",
  "error": null
}
```

### 错误响应

```json
{
  "success": false,
  "message": "转换失败",
  "output_file": null,
  "download_url": null,
  "error": "pdf2docx conversion failed: [具体错误]"
}
```

## 高级用法

### 自定义转换过滤器

对于 DOCX 转 PDF，可以使用 `custom_filter` 参数指定 LibreOffice 过滤器：

```bash
curl -X POST "https://api.xyin.online/convert" \
  -F "file=@document.docx" \
  -F "output_format=pdf" \
  -F "custom_filter=writer_pdf_Export"
```

常用过滤器选项：
- `writer_pdf_Export`: 标准 PDF 导出
- `writer_web_pdf_Export`: 网页优化 PDF

### 批量转换示例

```python
import os
import requests
import time

def batch_convert_to_pdf(input_dir, output_dir):
    """批量将 DOCX 文件转换为 PDF"""
    
    url = "https://api.xyin.online/convert"
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 遍历输入目录中的所有 DOCX 文件
    for filename in os.listdir(input_dir):
        if filename.lower().endswith('.docx'):
            input_path = os.path.join(input_dir, filename)
            
            print(f"正在转换: {filename}")
            
            try:
                with open(input_path, 'rb') as file:
                    files = {'file': file}
                    data = {'output_format': 'pdf'}
                    
                    response = requests.post(url, files=files, data=data, timeout=300)
                    
                    if response.status_code == 200:
                        result = response.json()
                        if result['success']:
                            # 下载转换后的文件
                            download_url = result['download_url']
                            pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                            
                            # 保存到输出目录
                            output_filename = os.path.splitext(filename)[0] + '.pdf'
                            output_path = os.path.join(output_dir, output_filename)
                            
                            with open(output_path, 'wb') as pdf_file:
                                pdf_file.write(pdf_response.content)
                            
                            print(f"✓ 转换完成: {output_filename}")
                        else:
                            print(f"✗ 转换失败: {result['error']}")
                    else:
                        print(f"✗ 请求失败: {response.status_code}")
                        
            except Exception as e:
                print(f"✗ 处理 {filename} 时出错: {e}")
            
            # 避免服务器过载
            time.sleep(1)

# 使用示例
batch_convert_to_pdf("./input_docs", "./output_pdfs")
```

## 注意事项

### DOCX 转 PDF
1. **字体问题**: 确保服务器安装了文档中使用的字体，否则可能会出现字体替换
2. **复杂布局**: 复杂的表格和图形布局可能在转换过程中略有变化
3. **文件大小**: 含大量图片的文档转换后可能文件较大

### PDF 转 DOCX
1. **排版精度**: PDF 转 Word 可能无法完全保持原始排版
2. **图片质量**: 图片可能会有轻微的质量损失
3. **表格处理**: 复杂表格的转换效果可能不够理想
4. **文字识别**: 扫描版 PDF 的转换效果有限

### 性能优化建议

1. **文件预处理**: 
   - 清理不必要的图片和对象
   - 优化文档结构
   - 压缩图片质量

2. **并发控制**:
   - 单个用户建议控制在 3-5 个并发请求
   - 大文件转换时适当增加超时时间

3. **错误重试**:
   - 网络错误可重试 2-3 次
   - 转换失败检查文件完整性

## 常见问题

**Q: 转换后的 PDF 文件字体不正确？**
A: 这通常是字体缺失导致的，建议使用系统常见字体或提供字体文件。

**Q: PDF 转 Word 后格式错乱？**
A: PDF 转 Word 本身有局限性，建议对转换结果进行人工校对和调整。

**Q: 转换速度很慢？**
A: 检查文件大小和复杂度，大文件或复杂文档需要更长处理时间。

**Q: 支持加密的 PDF 转换吗？**
A: 目前不支持加密 PDF 的直接转换，请先解密后再转换。
