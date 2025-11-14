# 文件下载

下载 API 转换生成的文件，支持各种文档格式。

## 接口信息

- **请求方式**: `GET`
- **接口地址**: `/download/{filename}`
- **Authorization Header**: API Key (JWT)
- **说明**: 下载后文件自动清理

## 路径参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `filename` | string | 是 | 文件名（从转换响应的 `output_file` 字段获取） |

## 使用流程

1. **调用转换接口** - 获得 `download_url`
2. **立即下载文件** - 使用获得的下载链接
3. **文件自动清理** - 服务器定期清理临时文件

## 请求示例

### cURL 示例

```bash
# 1. 先进行转换获得下载链接
curl -X POST "https://api.xyin.online/convert" \
  -F "file=@document.docx" \
  -F "output_format=pdf" | jq -r '.download_url'

# 2. 使用返回的链接下载文件
curl -O "https://api.xyin.online/download/document.pdf"
```

### Python 示例

```python
import requests

def download_converted_file(download_url, local_filename=None):
    """
    下载转换后的文件
    
    Args:
        download_url: 从转换API返回的下载链接
        local_filename: 本地保存的文件名（可选）
    
    Returns:
        str: 本地文件路径，失败时返回 None
    """
    
    full_url = f"https://api.xyin.online{download_url}"
    
    try:
        response = requests.get(full_url, timeout=60)
        
        if response.status_code == 200:
            # 确定文件名
            if not local_filename:
                # 从URL中提取文件名
                local_filename = download_url.split('/')[-1]
            
            # 保存文件
            with open(local_filename, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ 文件已下载: {local_filename}")
            return local_filename
            
        elif response.status_code == 404:
            print("✗ 文件不存在或已被清理")
            return None
        elif response.status_code == 403:
            print("✗ 访问被拒绝")
            return None
        else:
            print(f"✗ 下载失败: HTTP {response.status_code}")
            return None
            
    except requests.exceptions.Timeout:
        print("✗ 下载超时")
        return None
    except Exception as e:
        print(f"✗ 下载出错: {e}")
        return None

# 完整的转换和下载流程
def convert_and_download(input_file, output_format="pdf"):
    """完整的转换和下载流程"""
    
    # 1. 转换文件
    url = "https://api.xyin.online/convert"
    
    with open(input_file, 'rb') as f:
        files = {'file': f}
        data = {'output_format': output_format}
        
        response = requests.post(url, files=files, data=data, timeout=300)
    
    if response.status_code == 200:
        result = response.json()
        
        if result['success']:
            print(f"✓ 转换成功: {result['message']}")
            
            # 2. 下载文件
            download_url = result['download_url']
            output_filename = result['output_file']
            
            downloaded_file = download_converted_file(download_url, output_filename)
            return downloaded_file
        else:
            print(f"✗ 转换失败: {result['error']}")
    else:
        print(f"✗ 请求失败: {response.status_code}")
    
    return None

# 使用示例
if __name__ == "__main__":
    result = convert_and_download("report.docx", "pdf")
    if result:
        print(f"处理完成: {result}")
```

## 成功响应

**响应**: 文件二进制流

**Headers**:
```
Content-Type: application/pdf  # 或其他对应的MIME类型
Content-Disposition: attachment; filename="document.pdf"
Content-Length: 1234567
```

## 错误响应

### 文件不存在 (404)

```json
{
  "detail": "File not found"
}
```

### 访问被拒绝 (403) 

```json
{
  "detail": "Access denied"
}
```

**原因**: 文件名包含路径遍历字符（如 `../`），触发安全防护。

## 高级下载功能

### 断点续传下载

```python
def resume_download(download_url, local_filename):
    """支持断点续传的下载"""
    
    full_url = f"https://api.xyin.online{download_url}"
    
    # 检查本地文件是否存在
    resume_pos = 0
    if os.path.exists(local_filename):
        resume_pos = os.path.getsize(local_filename)
        print(f"发现未完成下载，从位置 {resume_pos} 继续...")
    
    headers = {}
    if resume_pos > 0:
        headers['Range'] = f'bytes={resume_pos}-'
    
    try:
        response = requests.get(full_url, headers=headers, stream=True, timeout=60)
        
        if response.status_code in [200, 206]:  # 206 for partial content
            mode = 'ab' if resume_pos > 0 else 'wb'
            
            with open(local_filename, mode) as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            print(f"✓ 下载完成: {local_filename}")
            return local_filename
        else:
            print(f"✗ 下载失败: HTTP {response.status_code}")
            return None
            
    except Exception as e:
        print(f"✗ 下载出错: {e}")
        return None
```

### 下载进度显示

```python
def download_with_progress(download_url, local_filename=None):
    """带进度显示的下载"""
    
    from tqdm import tqdm
    
    full_url = f"https://api.xyin.online{download_url}"
    
    if not local_filename:
        local_filename = download_url.split('/')[-1]
    
    try:
        response = requests.get(full_url, stream=True, timeout=60)
        
        if response.status_code == 200:
            # 获取文件大小
            total_size = int(response.headers.get('content-length', 0))
            
            with open(local_filename, 'wb') as f:
                with tqdm(
                    total=total_size,
                    unit='B',
                    unit_scale=True,
                    desc=local_filename
                ) as pbar:
                    
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                            pbar.update(len(chunk))
            
            print(f"\n✓ 下载完成: {local_filename}")
            return local_filename
        else:
            print(f"✗ 下载失败: HTTP {response.status_code}")
            return None
            
    except Exception as e:
        print(f"✗ 下载出错: {e}")
        return None

# 使用示例需要安装 tqdm: pip install tqdm
# result = download_with_progress("/download/large_document.pdf")
```

## JavaScript 下载示例

### 浏览器环境

```javascript
async function downloadFile(downloadUrl, filename) {
    try {
        const response = await fetch(`https://api.xyin.online${downloadUrl}`);
        
        if (!response.ok) {
            throw new Error(`下载失败: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        
        // 清理
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        console.log(`✓ 文件已下载: ${filename}`);
        return true;
        
    } catch (error) {
        console.error(`✗ 下载失败: ${error.message}`);
        return false;
    }
}

// 自动下载转换结果
async function convertAndDownload(file, outputFormat) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('output_format', outputFormat);
    
    try {
        const response = await fetch('https://api.xyin.online/convert', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 自动下载结果
            await downloadFile(result.download_url, result.output_file);
        } else {
            console.error('转换失败:', result.error);
        }
    } catch (error) {
        console.error('请求失败:', error);
    }
}
```

### Node.js 环境

```javascript
const fs = require('fs');
const axios = require('axios');

async function downloadFile(downloadUrl, localFilename) {
    const fullUrl = `https://api.xyin.online${downloadUrl}`;
    
    try {
        const response = await axios({
            method: 'GET',
            url: fullUrl,
            responseType: 'stream',
            timeout: 60000
        });
        
        const writer = fs.createWriteStream(localFilename);
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`✓ 文件已下载: ${localFilename}`);
                resolve(localFilename);
            });
            writer.on('error', reject);
        });
        
    } catch (error) {
        console.error(`✗ 下载失败: ${error.message}`);
        return null;
    }
}
```

## 安全注意事项

### 1. 文件名验证

服务器会自动验证文件名，防止路径遍历攻击：

```python
# 安全的文件名
valid_filename = "document.pdf"
download_file(f"/download/{valid_filename}")

# 危险的文件名（会被拒绝）
# dangerous_filename = "../../../etc/passwd"
```

### 2. 及时下载

- 转换后的文件有生存期限
- 建议在获得下载链接后立即下载
- 服务器会定期清理临时文件

### 3. 下载验证

```python
def verify_download(local_file, expected_size=None):
    """验证下载的文件"""
    
    if not os.path.exists(local_file):
        return False, "文件不存在"
    
    actual_size = os.path.getsize(local_file)
    
    if expected_size and actual_size != expected_size:
        return False, f"文件大小不匹配: {actual_size} != {expected_size}"
    
    # 检查文件是否完整
    try:
        if local_file.endswith('.pdf'):
            import PyPDF2
            with open(local_file, 'rb') as f:
                PyPDF2.PdfReader(f)
    except:
        return False, "文件格式验证失败"
    
    return True, "文件验证通过"

# 使用示例
is_valid, message = verify_download("downloaded.pdf")
print(message)
```

## 常见问题

**Q: 下载链接过期了怎么办？**
A: 需要重新执行转换操作获得新的下载链接。

**Q: 下载速度很慢？**
A: 检查网络连接，或尝试在服务器空闲时下载。

**Q: 可以分享下载链接给其他人吗？**
A: 不建议，下载链接可能随时失效，且有安全风险。

**Q: 下载的文件损坏了？**
A: 检查网络连接稳定性，尝试重新下载或使用断点续传。
