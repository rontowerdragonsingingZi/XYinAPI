# Word 转高清图片

将 Microsoft Word 文档转换为高质量 PNG 图片格式，每页生成一个独立的图片文件。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/word/to-image`
- **Authorization Header**: API Key (JWT)



## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 | 默认值 | 范围 |
|--------|------|---------|------|--------|------|
| `file` | FormData | 是 | Word 文件（.docx, .doc） | - | - |
| `dpi` | FormData | 否 | 图片分辨率 DPI | 300 | 100-600 |

### DPI 设置说明

| DPI 范围 | 质量等级 | 文件大小 | 转换速度 | 推荐用途 |
|---------|---------|---------|---------|---------|
| 100-150 | 普通质量 | 小 | 快速 | 预览、网页显示 |
| **200-300** | **高清质量** | **中等** | **适中** | **打印、文档归档（推荐）** |
| 400-600 | 超高清质量 | 大 | 较慢 | 专业印刷、精细设计 |

## 请求示例

### cURL 示例

#### 基础转换（默认 300 DPI）
```bash
curl -X POST "https://api.xyin.online/word/to-image" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.docx"
```

#### 自定义 DPI
```bash
curl -X POST "https://api.xyin.online/word/to-image" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.docx" \
  -F "dpi=150"
```

### Python 示例

```python
import requests
import os

def word_to_images(file_path, dpi=300, output_dir="./images"):
    """
    将 Word 文档转换为高清图片
    
    Args:
        file_path: Word 文件路径
        dpi: 图片分辨率，默认300
        output_dir: 输出目录
    
    Returns:
        list: 下载的图片文件路径列表
    """
    url = "https://api.xyin.online/word/to-image"
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {'dpi': str(dpi)}
            
            print(f"正在转换 {file_path} (DPI: {dpi})...")
            response = requests.post(url, files=files, data=data, timeout=300)
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    print(f"✓ 转换成功，生成 {result['page_count']} 张图片")
                    
                    downloaded_files = []
                    
                    # 下载所有生成的图片
                    for i, download_url in enumerate(result['download_urls']):
                        img_response = requests.get(f"https://api.xyin.online{download_url}")
                        
                        if img_response.status_code == 200:
                            # 使用原始文件名加页码
                            base_name = os.path.splitext(os.path.basename(file_path))[0]
                            img_filename = f"{base_name}_page{i+1}.png"
                            img_path = os.path.join(output_dir, img_filename)
                            
                            with open(img_path, 'wb') as img_file:
                                img_file.write(img_response.content)
                            
                            downloaded_files.append(img_path)
                            print(f"  → 已保存: {img_filename}")
                        else:
                            print(f"  ✗ 下载失败: {download_url}")
                    
                    return downloaded_files
                else:
                    print(f"✗ 转换失败: {result['error']}")
            else:
                print(f"✗ 请求失败: {response.status_code}")
                print(f"错误详情: {response.text}")
                
    except Exception as e:
        print(f"✗ 处理过程中出错: {e}")
    
    return []

# 使用示例
if __name__ == "__main__":
    # 基础转换
    images = word_to_images("report.docx")
    
    # 高DPI转换
    hd_images = word_to_images("presentation.docx", dpi=400, output_dir="./hd_images")
    
    if images:
        print(f"转换完成，共生成 {len(images)} 张图片")
```

### JavaScript 示例

```javascript
async function wordToImages(file, dpi = 300) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dpi', dpi.toString());
    
    try {
        const response = await fetch('https://api.xyin.online/word/to-image', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`转换成功，生成 ${result.page_count} 张图片`);
            return result.download_urls;
        } else {
            console.error('转换失败:', result.error);
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
}

// 使用示例（在浏览器环境中）
document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.docx')) {
        const downloadUrls = await wordToImages(file, 300);
        if (downloadUrls) {
            downloadUrls.forEach((url, index) => {
                const link = document.createElement('a');
                link.href = `https://api.xyin.online${url}`;
                link.download = `page_${index + 1}.png`;
                link.textContent = `下载第 ${index + 1} 页`;
                document.body.appendChild(link);
            });
        }
    }
});
```

## 成功响应

```json
{
  "success": true,
  "message": "Word文档已成功转换为3张高清图片 (DPI: 300)",
  "page_count": 3,
  "image_files": [
    "document_page1.png",
    "document_page2.png",
    "document_page3.png"
  ],
  "download_urls": [
    "/download/document_page1.png",
    "/download/document_page2.png",
    "/download/document_page3.png"
  ],
  "error": null
}
```

## 错误响应

### 文件格式错误
```json
{
  "success": false,
  "message": "转换失败",
  "error": "只支持Word文件",
  "output_file": null,
  "download_url": null
}
```

### DPI 参数错误
```json
{
  "success": false,
  "message": "转换失败", 
  "error": "DPI范围无效，请使用100-600之间的值",
  "output_file": null,
  "download_url": null
}
```

### 文档无内容
```json
{
  "success": false,
  "message": "转换失败",
  "error": "Word文档没有页面",
  "output_file": null,
  "download_url": null
}
```

## 性能优化建议

### DPI 选择策略

```python
def choose_optimal_dpi(use_case):
    """根据使用场景选择最优 DPI"""
    dpi_mapping = {
        "web_preview": 100,      # 网页预览
        "screen_display": 150,    # 屏幕显示
        "standard_print": 300,    # 标准印刷
        "high_quality": 400,      # 高质量印刷
        "professional": 600       # 专业级印刷
    }
    return dpi_mapping.get(use_case, 300)

# 使用示例
dpi = choose_optimal_dpi("standard_print")
images = word_to_images("document.docx", dpi=dpi)
```



## 注意事项

### 1. 图片质量与文件大小

- **DPI 300**: 适合大多数应用场景，文件大小适中
- **DPI 600**: 文件大小约为 300 DPI 的 4 倍
- **页面复杂度**: 包含大量图片的页面转换后文件更大

### 2. 转换时间

- **简单文档**: 每页约 1-2 秒
- **复杂文档**: 每页约 3-5 秒
- **高DPI设置**: 时间增加 50-100%

### 3. 内存使用

大文档和高 DPI 设置会消耗更多内存，建议：
- 单次转换文档不超过 50 页
- 并发转换数量不超过 3 个
- 定期清理临时文件

### 4. 字体兼容性

确保 Word 文档中的字体在服务器上可用，否则可能出现：
- 字体替换
- 排版变化
- 字符显示异常

## 常见问题

**Q: 转换后的图片模糊？**
A: 尝试提高 DPI 设置到 400 或 600。

**Q: 转换速度很慢？**
A: 降低 DPI 或简化文档内容，避免过多的图片和复杂格式。

**Q: 某些字体显示不正确？**
A: 这通常是字体缺失问题，建议使用系统标准字体。

**Q: 转换后颜色有差异？**
A: PDF 转 PNG 过程中可能有轻微的颜色空间转换差异，这是正常现象。

**Q: 支持 .doc 格式吗？**
A: 支持，但建议使用 .docx 格式以获得更好的兼容性。
