# PDF 转 PNG 图片

将 PDF 文档的每一页转换为独立的高清 PNG 图片文件。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/to-png`
- **Authorization Header**: API Key (JWT)

## 转换设置

- **分辨率**: 2倍缩放（高清质量）
- **格式**: PNG
- **输出**: 每页生成一个独立的 PNG 文件
- **透明度**: 支持透明背景（如果 PDF 有透明元素）

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待转换的 PDF 文件 |

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/pdf/to-png" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Python 示例

```python
import requests
import os

def pdf_to_png(file_path, output_dir="./png_images"):
    """
    将 PDF 转换为 PNG 图片
    
    Args:
        file_path: PDF 文件路径
        output_dir: 输出目录
    
    Returns:
        list: 下载的 PNG 文件路径列表
    """
    url = "https://api.xyin.online/pdf/to-png"
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            
            print(f"正在转换 {file_path}...")
            response = requests.post(url, files=files, timeout=300)
            
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
    images = pdf_to_png("document.pdf")
    if images:
        print(f"转换完成，共生成 {len(images)} 张图片")
        for img_path in images:
            print(f"  {img_path}")
```



### JavaScript 示例

```javascript
async function pdfToPng(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        console.log(`正在转换 ${file.name}...`);
        
        const response = await fetch('https://api.xyin.online/pdf/to-png', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`转换成功: ${result.message}`);
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

// 创建下载链接
function createDownloadLinks(downloadUrls, containerElement) {
    containerElement.innerHTML = ''; // 清空容器
    
    downloadUrls.forEach((url, index) => {
        const link = document.createElement('a');
        link.href = `https://api.xyin.online${url}`;
        link.download = `page_${index + 1}.png`;
        link.textContent = `下载第 ${index + 1} 页`;
        link.className = 'download-link';
        
        containerElement.appendChild(link);
        
        // 添加换行
        if (index < downloadUrls.length - 1) {
            containerElement.appendChild(document.createElement('br'));
        }
    });
}

// HTML 文件上传处理
function setupPdfToPngConverter() {
    const fileInput = document.getElementById('pdfFile');
    const convertBtn = document.getElementById('convertBtn');
    const downloadContainer = document.getElementById('downloadContainer');
    const progressDiv = document.getElementById('progress');
    
    convertBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        
        if (!file) {
            alert('请选择 PDF 文件');
            return;
        }
        
        if (file.type !== 'application/pdf') {
            alert('请选择有效的 PDF 文件');
            return;
        }
        
        convertBtn.disabled = true;
        convertBtn.textContent = '转换中...';
        progressDiv.style.display = 'block';
        downloadContainer.innerHTML = '';
        
        try {
            const downloadUrls = await pdfToPng(file);
            
            if (downloadUrls && downloadUrls.length > 0) {
                progressDiv.textContent = `转换完成！生成了 ${downloadUrls.length} 张图片`;
                createDownloadLinks(downloadUrls, downloadContainer);
            } else {
                progressDiv.textContent = '转换失败';
            }
        } catch (error) {
            progressDiv.textContent = `错误: ${error.message}`;
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = '转换为 PNG';
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', setupPdfToPngConverter);
```

对应的 HTML:
```html
<!DOCTYPE html>
<html>
<head>
    <title>PDF 转 PNG</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script>
    <style>
        .container { max-width: 600px; margin: 50px auto; padding: 20px; }
        .upload-area { border: 2px dashed #ccc; padding: 20px; text-align: center; margin: 20px 0; }
        .download-link { display: inline-block; margin: 5px; padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        .download-link:hover { background: #0056b3; }
        #progress { margin: 10px 0; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>PDF 转 PNG 工具</h1>
        
        <div class="upload-area">
            <label for="pdfFile">选择 PDF 文件:</label>
            <input type="file" id="pdfFile" accept=".pdf">
        </div>
        
        <div>
            <button id="convertBtn">转换为 PNG</button>
        </div>
        
        <div id="progress" style="display:none;"></div>
        
        <div id="downloadContainer"></div>
    </div>
    
    <script src="pdf-to-png.js"></script>
</body>
</html>
```

## 成功响应

```json
{
  "success": true,
  "message": "PDF已成功转换为3张PNG图片",
  "page_count": 3,
  "png_files": [
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
  "error": "只支持PDF文件",
  "output_file": null,
  "download_url": null
}
```

### PDF 无页面
```json
{
  "success": false,
  "message": "转换失败",
  "error": "PDF文件没有页面",
  "output_file": null,
  "download_url": null
}
```

### 文件损坏
```json
{
  "success": false,
  "message": "转换失败",
  "error": "PDF文件损坏或无法读取",
  "output_file": null,
  "download_url": null
}
```

## 高级功能

### 图片质量优化

```python
from PIL import Image
import io
import requests

def optimize_png_quality(png_data, max_size_mb=2):
    """
    优化 PNG 图片质量和大小
    
    Args:
        png_data: PNG 图片二进制数据
        max_size_mb: 最大文件大小（MB）
    
    Returns:
        bytes: 优化后的图片数据
    """
    
    # 当前大小
    current_size_mb = len(png_data) / (1024 * 1024)
    
    if current_size_mb <= max_size_mb:
        return png_data
    
    # 使用 PIL 进行优化
    with Image.open(io.BytesIO(png_data)) as img:
        # 计算需要的压缩比例
        ratio = max_size_mb / current_size_mb
        new_width = int(img.width * (ratio ** 0.5))
        new_height = int(img.height * (ratio ** 0.5))
        
        # 调整大小
        resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # 保存为优化的 PNG
        output = io.BytesIO()
        resized_img.save(output, format='PNG', optimize=True)
        
        return output.getvalue()

def pdf_to_optimized_png(file_path, output_dir="./optimized_png", max_size_mb=2):
    """转换 PDF 并优化图片质量"""
    
    # 先进行正常转换
    download_urls = pdf_to_png_urls_only(file_path)  # 只获取下载链接
    
    if not download_urls:
        return []
    
    os.makedirs(output_dir, exist_ok=True)
    optimized_files = []
    
    for i, download_url in enumerate(download_urls):
        # 下载原始 PNG
        response = requests.get(f"https://api.xyin.online{download_url}")
        
        if response.status_code == 200:
            # 优化图片
            optimized_data = optimize_png_quality(response.content, max_size_mb)
            
            # 保存优化后的图片
            base_name = os.path.splitext(os.path.basename(file_path))[0]
            filename = f"{base_name}_page{i+1}_optimized.png"
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, 'wb') as f:
                f.write(optimized_data)
            
            original_size = len(response.content) / (1024 * 1024)
            optimized_size = len(optimized_data) / (1024 * 1024)
            
            print(f"页面 {i+1}: {original_size:.2f}MB → {optimized_size:.2f}MB")
            optimized_files.append(filepath)
    
    return optimized_files

def pdf_to_png_urls_only(file_path):
    """仅获取转换后的下载链接"""
    url = "https://api.xyin.online/pdf/to-png"
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, files=files, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                return result['download_urls']
    
    return []
```

### 页面选择转换

```python
def pdf_pages_to_png(file_path, page_numbers=None, output_dir="./selected_pages"):
    """
    转换 PDF 的指定页面为 PNG
    
    Args:
        file_path: PDF 文件路径
        page_numbers: 要转换的页面列表（1-based），None 表示所有页面
        output_dir: 输出目录
    
    Returns:
        list: 转换的图片文件路径
    """
    
    # 先获取所有页面的下载链接
    download_urls = pdf_to_png_urls_only(file_path)
    
    if not download_urls:
        print("PDF 转换失败")
        return []
    
    total_pages = len(download_urls)
    
    # 如果未指定页面，转换所有页面
    if page_numbers is None:
        page_numbers = list(range(1, total_pages + 1))
    
    # 验证页面号码
    valid_pages = [p for p in page_numbers if 1 <= p <= total_pages]
    
    if not valid_pages:
        print(f"没有有效的页面号码。PDF 共有 {total_pages} 页")
        return []
    
    os.makedirs(output_dir, exist_ok=True)
    downloaded_files = []
    
    print(f"转换页面: {valid_pages}")
    
    for page_num in valid_pages:
        download_url = download_urls[page_num - 1]  # 转为 0-based 索引
        
        response = requests.get(f"https://api.xyin.online{download_url}")
        
        if response.status_code == 200:
            base_name = os.path.splitext(os.path.basename(file_path))[0]
            filename = f"{base_name}_page{page_num}.png"
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            downloaded_files.append(filepath)
            print(f"✓ 已保存页面 {page_num}: {filename}")
        else:
            print(f"✗ 下载页面 {page_num} 失败")
    
    return downloaded_files

# 使用示例
# 转换第 1, 3, 5 页
selected_images = pdf_pages_to_png("document.pdf", [1, 3, 5])

# 转换前 5 页
first_five = pdf_pages_to_png("document.pdf", list(range(1, 6)))

# 转换所有页面（与默认行为相同）
all_images = pdf_pages_to_png("document.pdf")
```

## 性能指标

### 转换速度

| PDF 页数 | 转换时间（约） | 输出文件大小（约） |
|---------|-------------|----------------|
| 1-5 页 | 2-5 秒 | 1-5 MB |
| 6-20 页 | 5-15 秒 | 5-20 MB |
| 21-50 页 | 15-40 秒 | 20-50 MB |
| 50+ 页 | > 40 秒 | > 50 MB |

### 图片质量

- **分辨率**: 2倍缩放（约 150-300 DPI 等效）
- **颜色深度**: 24位真彩色 + Alpha 通道
- **压缩**: PNG 无损压缩
- **透明度**: 保持原始透明效果

## 最佳实践

### 1. 文件预检查

```python
import PyPDF2

def validate_pdf_before_conversion(file_path):
    """转换前验证 PDF 文件"""
    
    try:
        with open(file_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            
            # 检查页数
            page_count = len(pdf_reader.pages)
            if page_count == 0:
                return False, "PDF 没有页面"
            
            # 检查是否加密
            if pdf_reader.is_encrypted:
                return False, "PDF 已加密，请先解密"
            
            # 检查文件大小
            file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
            if file_size_mb > 10:
                return False, f"文件过大: {file_size_mb:.2f}MB (最大 10MB)"
            
            return True, f"PDF 有效，共 {page_count} 页"
            
    except Exception as e:
        return False, f"PDF 验证失败: {e}"

# 使用示例
is_valid, message = validate_pdf_before_conversion("document.pdf")
if is_valid:
    print(f"✓ {message}")
    images = pdf_to_png("document.pdf")
else:
    print(f"✗ {message}")
```

### 2. 内存优化

```python
def memory_efficient_pdf_to_png(file_path, output_dir, batch_size=5):
    """内存优化的 PDF 转换（适合大文件）"""
    
    download_urls = pdf_to_png_urls_only(file_path)
    
    if not download_urls:
        return []
    
    os.makedirs(output_dir, exist_ok=True)
    downloaded_files = []
    
    # 分批下载以节省内存
    for i in range(0, len(download_urls), batch_size):
        batch_urls = download_urls[i:i+batch_size]
        
        print(f"下载批次 {i//batch_size + 1}: 页面 {i+1}-{min(i+batch_size, len(download_urls))}")
        
        for j, download_url in enumerate(batch_urls):
            page_num = i + j + 1
            response = requests.get(f"https://api.xyin.online{download_url}")
            
            if response.status_code == 200:
                base_name = os.path.splitext(os.path.basename(file_path))[0]
                filename = f"{base_name}_page{page_num}.png"
                filepath = os.path.join(output_dir, filename)
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                downloaded_files.append(filepath)
                print(f"  ✓ 页面 {page_num}")
            else:
                print(f"  ✗ 页面 {page_num} 下载失败")
        
        # 清理内存
        if i + batch_size < len(download_urls):
            time.sleep(0.5)  # 短暂休息
    
    return downloaded_files
```

## 注意事项

### 1. 文件限制
- **大小限制**: 最大 10MB
- **页数建议**: 单次转换不超过 100 页
- **格式要求**: 标准 PDF 文件，非扫描版效果更好

### 2. 图片特性
- **透明度**: 保持 PDF 原有透明效果
- **矢量图**: 矢量内容转为高质量位图
- **字体**: 字体会栅格化为图像
- **颜色**: RGB 颜色空间

### 3. 性能优化
- **并发控制**: 避免同时转换大量文件
- **内存管理**: 大 PDF 建议分批处理
- **网络优化**: 及时下载避免文件清理

## 常见问题

**Q: 转换后的图片模糊？**
A: PDF 中的低分辨率图片在转换后仍然会模糊，这是源文件质量问题。

**Q: 某些页面转换失败？**
A: 可能是页面包含特殊内容或损坏，尝试使用其他 PDF 工具修复。

**Q: 转换速度很慢？**
A: 复杂的 PDF 页面需要更多渲染时间，可以尝试简化 PDF 内容。

**Q: 输出图片文件很大？**
A: PNG 是无损格式，文件较大正常。如需压缩可后期转为 JPEG。

**Q: 支持加密 PDF 吗？**
A: 不支持，请先使用解密接口或其他工具解密 PDF。

**Q: 可以自定义输出分辨率吗？**
A: 当前版本使用固定的高清设置，暂不支持自定义 DPI。
