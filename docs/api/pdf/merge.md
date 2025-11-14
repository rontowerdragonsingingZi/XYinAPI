# PDF 合并

将多个 PDF 文件合并为一个文档。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/merge`
- **Authorization Header**: API Key (JWT)

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `files` | FormData | 是 | 多个待合并的 PDF 文件 |

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/pdf/merge" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@file1.pdf" \
  -F "files=@file2.pdf" \
  -F "files=@file3.pdf"
```

### Python 示例

```python
import requests

def merge_pdfs(pdf_files, output_path="merged.pdf"):
    """
    合并多个 PDF 文件
    
    Args:
        pdf_files: PDF 文件路径列表
        output_path: 输出文件路径
    
    Returns:
        str: 合并后的文件路径，失败时返回 None
    """
    url = "https://api.xyin.online/pdf/merge"
    
    files = [('files', open(pdf, 'rb')) for pdf in pdf_files]
    
    try:
        response = requests.post(url, files=files, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                download_url = result['download_url']
                pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                
                with open(output_path, 'wb') as f:
                    f.write(pdf_response.content)
                
                print(f"✓ 合并后的 PDF 已保存为: {output_path}")
                return output_path
            else:
                print(f"✗ 合并失败: {result['error']}")
        else:
            print(f"✗ 请求失败: {response.status_code}")
    finally:
        for _, f in files:
            f.close()
    
    return None

# 使用示例
merged_file = merge_pdfs(["file1.pdf", "file2.pdf", "file3.pdf"])
```

## 成功响应

```json
{
  "success": true,
  "message": "成功合并 3 个 PDF 文件",
  "output_file": "merged.pdf",
  "download_url": "/download/merged.pdf",
  "error": null
}
```

## 错误响应

### 文件数量不足

```json
{
  "success": false,
  "message": "合并失败",
  "error": "至少需要 2 个 PDF 文件",
  "output_file": null,
  "download_url": null
}
```

### 文件格式错误

```json
{
  "success": false,
  "message": "合并失败",
  "error": "所有文件必须是 PDF 格式",
  "output_file": null,
  "download_url": null
}
```

## 注意事项

1. **文件顺序**: PDF 文件按照上传顺序进行合并
2. **文件数量**: 至少需要 2 个 PDF 文件
3. **文件大小**: 建议单个文件不超过 10MB
4. **总大小限制**: 所有文件总大小建议不超过 50MB
5. **页面保留**: 合并后保留所有原始页面和内容
6. **书签处理**: 原始 PDF 的书签可能会丢失

## 常见问题

**Q: 合并后的 PDF 文件很大？**
A: 合并后的文件大小等于所有原始文件大小之和，可以使用 PDF 压缩工具进行优化。

**Q: 可以合并加密的 PDF 吗？**
A: 不支持，请先解密后再合并。

**Q: 合并顺序可以自定义吗？**
A: 可以，按照上传文件的顺序进行合并，调整上传顺序即可。

**Q: 支持合并多少个文件？**
A: 理论上没有限制，但建议一次合并不超过 10 个文件以获得最佳性能。

