# PDF 解密

解除 PDF 文档的密码保护，使其可以正常访问和编辑。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/decrypt`
- **底层技术**: PyMuPDF

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待解密的 PDF 文件 |
| `password` | FormData | 是 | PDF 密码（用户密码或所有者密码） |

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/pdf/decrypt" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@encrypted.pdf" \
  -F "password=mypassword123"
```

### Python 示例

```python
import requests
import os

def decrypt_pdf(file_path, password, output_dir="./decrypted"):
    """
    解密 PDF 文件
    
    Args:
        file_path: 加密的 PDF 文件路径
        password: PDF 密码
        output_dir: 输出目录
    
    Returns:
        str: 解密后的文件路径，失败时返回 None
    """
    url = "https://api.xyin.online/pdf/decrypt"
    
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {'password': password}
            
            print(f"正在解密 {file_path}...")
            response = requests.post(url, files=files, data=data, timeout=300)
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    print(f"✓ 解密成功: {result['message']}")
                    
                    # 下载解密后的文件
                    download_url = result['download_url']
                    decrypted_response = requests.get(f"https://api.xyin.online{download_url}")
                    
                    if decrypted_response.status_code == 200:
                        output_filename = result['output_file']
                        output_path = os.path.join(output_dir, output_filename)
                        
                        with open(output_path, 'wb') as decrypted_file:
                            decrypted_file.write(decrypted_response.content)
                        
                        print(f"✓ 解密文件已保存: {output_path}")
                        return output_path
                    else:
                        print("下载解密文件失败")
                else:
                    print(f"✗ 解密失败: {result['error']}")
            else:
                print(f"✗ 请求失败: {response.status_code}")
                
    except Exception as e:
        print(f"✗ 处理过程中出错: {e}")
    
    return None

# 使用示例
if __name__ == "__main__":
    decrypted_file = decrypt_pdf("secure_document.pdf", "secret123")
    if decrypted_file:
        print(f"解密完成: {decrypted_file}")
```

## 成功响应

```json
{
  "success": true,
  "message": "PDF解密成功",
  "output_file": "document_decrypted.pdf",
  "download_url": "/download/document_decrypted.pdf",
  "error": null
}
```

## 错误响应

### 密码错误
```json
{
  "success": false,
  "message": "解密失败",
  "error": "密码错误",
  "output_file": null,
  "download_url": null
}
```

### PDF 未加密
```json
{
  "success": false,
  "message": "解密失败",
  "error": "PDF文件未加密",
  "output_file": null,
  "download_url": null
}
```

## 批量解密示例

```python
def batch_decrypt_pdfs(pdf_files, password, output_dir="./decrypted_batch"):
    """批量解密 PDF 文件"""
    
    results = []
    
    for pdf_file in pdf_files:
        filename = os.path.basename(pdf_file)
        print(f"\n处理文件: {filename}")
        
        try:
            decrypted_file = decrypt_pdf(pdf_file, password, output_dir)
            
            if decrypted_file:
                results.append({
                    'file': filename,
                    'success': True,
                    'decrypted_file': decrypted_file
                })
            else:
                results.append({
                    'file': filename,
                    'success': False,
                    'error': '解密失败'
                })
                
        except Exception as e:
            results.append({
                'file': filename,
                'success': False,
                'error': str(e)
            })
    
    # 统计结果
    success_count = sum(1 for r in results if r['success'])
    print(f"\n批量解密完成:")
    print(f"  成功: {success_count}/{len(pdf_files)}")
    
    return results

# 使用示例
pdf_files = ["secure1.pdf", "secure2.pdf", "secure3.pdf"]
results = batch_decrypt_pdfs(pdf_files, "common_password")
```

## 注意事项

1. **密码类型**: 支持用户密码和所有者密码
2. **文件安全**: 解密后的文件没有任何保护措施
3. **密码保存**: 不建议在代码中硬编码密码
4. **批量操作**: 大量文件建议分批处理

## 常见问题

**Q: 不知道密码类型怎么办？**
A: 可以先尝试用户密码，失败后再尝试所有者密码。

**Q: 解密后的文件还能再加密吗？**
A: 可以，使用加密接口重新设置密码。

**Q: 支持批量使用不同密码吗？**
A: 当前接口不支持，需要逐个处理不同密码的文件。
