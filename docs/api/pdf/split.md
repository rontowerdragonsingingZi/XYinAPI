# PDF 拆分

将 PDF 文档按指定份数进行智能拆分，页数平均分配。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/split`
- **Authorization Header**: API Key (JWT)

## 拆分逻辑

- **10页拆10份** = 每份1页
- **10页拆5份** = 每份2页  
- **10页拆3份** = 4页 + 4页 + 2页（不能整除时向上取整）

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待拆分的 PDF 文件 |
| `split_count` | FormData | 是 | 拆分份数（必须 ≥ 1 且不能超过总页数） |

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/pdf/split" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "split_count=3"
```

### Python 示例

```python
import requests
import os

def split_pdf(file_path, split_count, output_dir="./split_pdfs"):
    """
    拆分 PDF 文件
    
    Args:
        file_path: PDF 文件路径
        split_count: 拆分份数
        output_dir: 输出目录
    
    Returns:
        list: 拆分后的文件路径列表
    """
    url = "https://api.xyin.online/pdf/split"
    
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {'split_count': str(split_count)}
            
            print(f"正在拆分 {file_path} 为 {split_count} 份...")
            response = requests.post(url, files=files, data=data, timeout=300)
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    print(f"✓ 拆分成功: {result['message']}")
                    
                    downloaded_files = []
                    
                    # 下载所有拆分文件
                    for i, download_url in enumerate(result['download_urls']):
                        pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                        
                        if pdf_response.status_code == 200:
                            # 使用响应中的文件名
                            filename = result['split_files'][i]
                            filepath = os.path.join(output_dir, filename)
                            
                            with open(filepath, 'wb') as pdf_file:
                                pdf_file.write(pdf_response.content)
                            
                            downloaded_files.append(filepath)
                            print(f"  → 已保存: {filename}")
                        else:
                            print(f"  ✗ 下载失败: {download_url}")
                    
                    return downloaded_files
                else:
                    print(f"✗ 拆分失败: {result['error']}")
            else:
                print(f"✗ 请求失败: {response.status_code}")
                
    except Exception as e:
        print(f"✗ 处理过程中出错: {e}")
    
    return []

# 使用示例
split_files = split_pdf("large_document.pdf", 3)
if split_files:
    print(f"拆分完成，生成 {len(split_files)} 个文件")
```

## 成功响应

```json
{
  "success": true,
  "message": "PDF已成功拆分为3个文件",
  "split_files": [
    "document_part1.pdf",
    "document_part2.pdf", 
    "document_part3.pdf"
  ],
  "download_urls": [
    "/download/document_part1.pdf",
    "/download/document_part2.pdf",
    "/download/document_part3.pdf"
  ],
  "error": null
}
```

## 错误响应

### 拆分份数无效

```json
{
  "success": false,
  "message": "拆分失败",
  "error": "拆分份数必须≥1",
  "split_files": null,
  "download_urls": null
}
```
