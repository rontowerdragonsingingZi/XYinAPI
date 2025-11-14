# PDF 去除空白页

自动识别并删除 PDF 文档中的空白页。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/remove-blank-pages`
- **Authorization Header**: API Key (JWT)

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待处理的 PDF 文件 |

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/pdf/remove-blank-pages" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Python 示例

```python
import requests

def remove_blank_pages(file_path, output_path="cleaned.pdf"):
    """
    去除 PDF 空白页
    
    Args:
        file_path: PDF 文件路径
        output_path: 输出文件路径
    
    Returns:
        str: 处理后的文件路径，失败时返回 None
    """
    url = "https://api.xyin.online/pdf/remove-blank-pages"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        
        response = requests.post(url, files=files, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                download_url = result['download_url']
                pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                
                with open(output_path, 'wb') as f:
                    f.write(pdf_response.content)
                
                print(f"✓ 清理后的 PDF 已保存为: {output_path}")
                print(f"  删除了 {result['removed_pages']} 个空白页")
                return output_path
            else:
                print(f"✗ 处理失败: {result['error']}")
        else:
            print(f"✗ 请求失败: {response.status_code}")
    
    return None

# 使用示例
cleaned_file = remove_blank_pages("document.pdf")
```

## 成功响应

```json
{
  "success": true,
  "message": "删除了 3 个空白页",
  "removed_pages": 3,
  "output_file": "document_cleaned.pdf",
  "download_url": "/download/document_cleaned.pdf",
  "error": null
}
```

## 错误响应

### 文件格式错误

```json
{
  "success": false,
  "message": "处理失败",
  "error": "只支持 PDF 文件",
  "output_file": null,
  "download_url": null
}
```

### 无空白页

```json
{
  "success": true,
  "message": "未发现空白页",
  "removed_pages": 0,
  "output_file": "document.pdf",
  "download_url": "/download/document.pdf",
  "error": null
}
```

## 空白页识别规则

- **纯白页面**: 完全没有内容的页面
- **极少内容**: 内容占比小于 1% 的页面
- **仅有页眉页脚**: 只包含页眉或页脚的页面
- **空白扫描页**: 扫描文档中的空白页

## 注意事项

1. **识别准确性**: 自动识别可能存在误判，建议检查结果
2. **页码变化**: 删除空白页后页码会重新排列
3. **书签影响**: 原有书签可能失效
4. **加密 PDF**: 不支持加密的 PDF，请先解密
5. **备份建议**: 处理前建议备份原始文件

## 常见问题

**Q: 会误删有内容的页面吗？**
A: 算法会检测页面内容，但建议处理后检查结果。

**Q: 可以自定义空白页判断标准吗？**
A: 当前使用默认标准，暂不支持自定义。

**Q: 处理大文件需要多长时间？**
A: 处理时间取决于文件大小和页数，通常每页 0.1-0.5 秒。

**Q: 删除空白页后文件大小会减小吗？**
A: 会的，删除页面后文件大小会相应减小。

