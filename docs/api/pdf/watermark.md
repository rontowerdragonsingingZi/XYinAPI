# PDF 加水印

为 PDF 文档添加文字水印。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/watermark`
- **Authorization Header**: API Key (JWT)

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待添加水印的 PDF 文件 |
| `watermark_text` | FormData | 是 | 水印文字内容 |

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/pdf/watermark" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "watermark_text=机密文件"
```

### Python 示例

```python
import requests

def add_watermark(file_path, watermark_text, output_path="watermarked.pdf"):
    """
    为 PDF 添加水印
    
    Args:
        file_path: PDF 文件路径
        watermark_text: 水印文字
        output_path: 输出文件路径
    
    Returns:
        str: 添加水印后的文件路径，失败时返回 None
    """
    url = "https://api.xyin.online/pdf/watermark"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        data = {'watermark_text': watermark_text}
        
        response = requests.post(url, files=files, data=data, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                download_url = result['download_url']
                pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                
                with open(output_path, 'wb') as f:
                    f.write(pdf_response.content)
                
                print(f"✓ 添加水印的 PDF 已保存为: {output_path}")
                return output_path
            else:
                print(f"✗ 添加水印失败: {result['error']}")
        else:
            print(f"✗ 请求失败: {response.status_code}")
    
    return None

# 使用示例
watermarked_file = add_watermark("document.pdf", "机密文件")
```

## 成功响应

```json
{
  "success": true,
  "message": "水印添加成功",
  "output_file": "document_watermarked.pdf",
  "download_url": "/download/document_watermarked.pdf",
  "error": null
}
```

## 错误响应

### 文件格式错误

```json
{
  "success": false,
  "message": "添加水印失败",
  "error": "只支持 PDF 文件",
  "output_file": null,
  "download_url": null
}
```

### 水印文字为空

```json
{
  "success": false,
  "message": "添加水印失败",
  "error": "水印文字不能为空",
  "output_file": null,
  "download_url": null
}
```

## 水印特性

- **位置**: 水印显示在每页的中心位置
- **样式**: 半透明灰色文字
- **角度**: 对角线倾斜显示
- **大小**: 根据页面大小自动调整
- **覆盖**: 水印覆盖在内容之上

## 注意事项

1. **水印文字**: 建议不超过 20 个字符
2. **中文支持**: 完全支持中文水印
3. **文件大小**: 添加水印后文件大小略有增加
4. **加密 PDF**: 不支持加密的 PDF，请先解密
5. **水印移除**: 水印添加后无法通过本 API 移除

## 常见问题

**Q: 可以自定义水印样式吗？**
A: 当前版本使用默认样式，暂不支持自定义。

**Q: 水印会影响 PDF 内容吗？**
A: 不会，水印仅作为视觉标记，不影响原始内容。

**Q: 可以添加图片水印吗？**
A: 当前仅支持文字水印。

**Q: 水印可以去除吗？**
A: 水印是永久添加的，无法通过本 API 去除。

