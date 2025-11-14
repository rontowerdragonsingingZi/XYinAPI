# PDF 文字提取

从 PDF 文档中提取文本内容。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/extract-text`
- **Authorization Header**: API Key (JWT)

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待提取文本的 PDF 文件 |

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/pdf/extract-text" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Python 示例

```python
import requests

def extract_pdf_text(file_path):
    """
    从 PDF 提取文本
    
    Args:
        file_path: PDF 文件路径
    
    Returns:
        str: 提取的文本内容，失败时返回 None
    """
    url = "https://api.xyin.online/pdf/extract-text"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        
        response = requests.post(url, files=files, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                return result['text']
            else:
                print(f"提取失败: {result['error']}")
        else:
            print(f"请求失败: {response.status_code}")
    
    return None

# 使用示例
text = extract_pdf_text("document.pdf")
if text:
    print(f"提取的文本:\n{text}")
```

## 成功响应

```json
{
  "success": true,
  "text": "提取的文本内容...",
  "page_count": 10,
  "error": null
}
```

## 错误响应

### 文件格式错误

```json
{
  "success": false,
  "message": "提取失败",
  "error": "只支持 PDF 文件",
  "text": null
}
```

### PDF 无文本

```json
{
  "success": false,
  "message": "提取失败",
  "error": "PDF 中没有可提取的文本",
  "text": null
}
```

## 注意事项

1. **文本质量**: 提取质量取决于 PDF 的创建方式
2. **扫描版 PDF**: 扫描版 PDF（图片）无法提取文本，需要 OCR 处理
3. **格式保留**: 提取的文本不保留原始格式和排版
4. **特殊字符**: 可能包含特殊字符和换行符
5. **加密 PDF**: 不支持加密的 PDF，请先解密

## 常见问题

**Q: 为什么提取不到文本？**
A: 可能是扫描版 PDF，需要使用 OCR 工具进行文字识别。

**Q: 提取的文本格式混乱？**
A: PDF 文本提取不保留原始排版，建议进行后处理。

**Q: 支持提取表格数据吗？**
A: 可以提取表格中的文本，但不保留表格结构。

**Q: 提取速度慢？**
A: 大文件或复杂 PDF 需要更长时间，建议文件不超过 100 页。

