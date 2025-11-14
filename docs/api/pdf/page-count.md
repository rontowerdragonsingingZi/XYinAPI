# PDF 页数统计

获取 PDF 文档的页数信息，快速了解文档规模。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/page-count`
- **Authorization Header**: API Key (JWT)

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待统计的 PDF 文件 |

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/pdf/page-count" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Python 示例

```python
import requests

def get_pdf_page_count(file_path):
    """
    获取 PDF 页数
    
    Args:
        file_path: PDF 文件路径
    
    Returns:
        int: 页数，失败时返回 None
    """
    url = "https://api.xyin.online/pdf/page-count"
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            
            response = requests.post(url, files=files, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    return result['page_count']
                else:
                    print(f"获取页数失败: {result['error']}")
            else:
                print(f"请求失败: {response.status_code}")
                
    except Exception as e:
        print(f"处理过程中出错: {e}")
    
    return None

# 使用示例
page_count = get_pdf_page_count("document.pdf")
if page_count is not None:
    print(f"PDF 共有 {page_count} 页")
```

## 成功响应

```json
{
  "success": true,
  "page_count": 10,
  "filename": "document.pdf",
  "error": null
}
```

## 错误响应

```json
{
  "success": false,
  "page_count": null,
  "filename": null,
  "error": "只支持 PDF 文件"
}
```
