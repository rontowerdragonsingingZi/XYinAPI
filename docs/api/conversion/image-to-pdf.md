# 图片转 PDF

将一张或多张图片合成为 PDF 文档，支持多种常见图片格式。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/image/to-pdf`
- **底层技术**: PyMuPDF

## 支持的图片格式

| 格式 | 扩展名 | 说明 |
|------|--------|------|
| **PNG** | `.png` | 推荐格式，支持透明度 |
| **JPEG** | `.jpg`, `.jpeg` | 常用照片格式 |
| **BMP** | `.bmp` | Windows 位图格式 |
| **GIF** | `.gif` | 支持动画（仅使用第一帧） |
| **TIFF** | `.tiff`, `.tif` | 专业图像格式 |

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `files` | FormData | 是 | 一个或多个图片文件（支持多文件上传） |

### 多文件上传说明

- **单张图片**: 生成包含一页的 PDF
- **多张图片**: 按上传顺序排列，每张图片占据 PDF 的一页
- **图片尺寸**: 自动保持原始尺寸比例
- **页面大小**: 根据图片尺寸自动调整

## 请求示例

### cURL 示例

#### 单张图片
```bash
curl -X POST "https://api.xyin.online/image/to-pdf" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@image1.png"
```

#### 多张图片
```bash
curl -X POST "https://api.xyin.online/image/to-pdf" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@image1.png" \
  -F "files=@image2.jpg" \
  -F "files=@image3.png"
```

### Python 示例

#### 基础使用
```python
import requests
import os

def images_to_pdf(image_paths, output_path=None):
    """
    将图片转换为 PDF
    
    Args:
        image_paths: 图片文件路径列表
        output_path: 输出 PDF 文件路径（可选）
    
    Returns:
        str: 下载的 PDF 文件路径，失败时返回 None
    """
    url = "https://api.xyin.online/image/to-pdf"
    
    # 准备文件数据
    files = []
    try:
        for image_path in image_paths:
            if os.path.exists(image_path):
                files.append(('files', open(image_path, 'rb')))
            else:
                print(f"警告: 文件不存在 {image_path}")
        
        if not files:
            print("错误: 没有有效的图片文件")
            return None
        
        print(f"正在转换 {len(files)} 张图片为 PDF...")
        
        response = requests.post(url, files=files, timeout=300)
        
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✓ 转换成功: {result['message']}")
                
                # 下载生成的 PDF
                download_url = result['download_url']
                pdf_response = requests.get(f"https://api.xyin.online{download_url}")
                
                if pdf_response.status_code == 200:
                    # 确定输出文件名
                    if not output_path:
                        output_path = result['output_file']
                    
                    with open(output_path, 'wb') as pdf_file:
                        pdf_file.write(pdf_response.content)
                    
                    print(f"✓ PDF 已保存为: {output_path}")
                    return output_path
                else:
                    print(f"✗ 下载失败: {pdf_response.status_code}")
            else:
                print(f"✗ 转换失败: {result['error']}")
        else:
            print(f"✗ 请求失败: {response.status_code}")
            print(f"错误详情: {response.text}")
            
    except Exception as e:
        print(f"✗ 处理过程中出错: {e}")
    finally:
        # 关闭文件句柄
        for _, file_obj in files:
            file_obj.close()
    
    return None

# 使用示例
if __name__ == "__main__":
    # 单张图片转换
    single_pdf = images_to_pdf(["photo.jpg"], "single_image.pdf")
    
    # 多张图片转换
    image_list = ["image1.png", "image2.jpg", "image3.png"]
    multi_pdf = images_to_pdf(image_list, "multi_images.pdf")
    
    if multi_pdf:
        print(f"转换完成: {multi_pdf}")
```

#### 批量处理示例
```python
import os
import glob
from pathlib import Path

def batch_images_to_pdf(input_dir, output_dir=None, group_by_folder=True):
    """
    批量将图片转换为 PDF
    
    Args:
        input_dir: 输入图片目录
        output_dir: 输出 PDF 目录
        group_by_folder: 是否按子文件夹分组
    """
    
    if not output_dir:
        output_dir = os.path.join(input_dir, "pdf_output")
    
    os.makedirs(output_dir, exist_ok=True)
    
    # 支持的图片扩展名
    image_extensions = ['*.png', '*.jpg', '*.jpeg', '*.bmp', '*.gif', '*.tiff', '*.tif']
    
    if group_by_folder:
        # 按子文件夹分组处理
        for root, dirs, files in os.walk(input_dir):
            if root == input_dir:  # 跳过根目录
                continue
                
            folder_name = os.path.basename(root)
            image_files = []
            
            # 收集该文件夹下的所有图片
            for ext in image_extensions:
                image_files.extend(glob.glob(os.path.join(root, ext)))
            
            if image_files:
                # 按文件名排序
                image_files.sort()
                
                # 生成 PDF
                output_pdf = os.path.join(output_dir, f"{folder_name}.pdf")
                result = images_to_pdf(image_files, output_pdf)
                
                if result:
                    print(f"✓ 文件夹 '{folder_name}': {len(image_files)} 张图片 → {output_pdf}")
                else:
                    print(f"✗ 文件夹 '{folder_name}': 转换失败")
    else:
        # 将所有图片合并为一个 PDF
        all_images = []
        for ext in image_extensions:
            all_images.extend(glob.glob(os.path.join(input_dir, ext)))
        
        if all_images:
            all_images.sort()
            output_pdf = os.path.join(output_dir, "all_images.pdf")
            result = images_to_pdf(all_images, output_pdf)
            
            if result:
                print(f"✓ 所有图片: {len(all_images)} 张 → {output_pdf}")
            else:
                print("✗ 转换失败")
        else:
            print("未找到图片文件")

# 使用示例
if __name__ == "__main__":
    # 按文件夹分组转换
    batch_images_to_pdf("./photos", "./pdf_output", group_by_folder=True)
    
    # 所有图片合并为一个 PDF
    batch_images_to_pdf("./all_photos", "./pdf_output", group_by_folder=False)
```

### JavaScript 示例

```javascript
async function imagesToPdf(imageFiles) {
    const formData = new FormData();
    
    // 添加所有图片文件
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('files', imageFiles[i]);
    }
    
    try {
        console.log(`正在转换 ${imageFiles.length} 张图片...`);
        
        const response = await fetch('https://api.xyin.online/image/to-pdf', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`转换成功: ${result.message}`);
            return result.download_url;
        } else {
            console.error('转换失败:', result.error);
            return null;
        }
    } catch (error) {
        console.error('请求失败:', error);
        return null;
    }
}

// HTML 文件选择示例
function setupImageToPdfConverter() {
    const fileInput = document.getElementById('imageFiles');
    const convertBtn = document.getElementById('convertBtn');
    const downloadLink = document.getElementById('downloadLink');
    
    convertBtn.addEventListener('click', async () => {
        const files = Array.from(fileInput.files);
        
        if (files.length === 0) {
            alert('请选择图片文件');
            return;
        }
        
        // 验证文件类型
        const validTypes = ['image/png', 'image/jpeg', 'image/bmp', 'image/gif', 'image/tiff'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            alert('包含不支持的文件格式');
            return;
        }
        
        convertBtn.disabled = true;
        convertBtn.textContent = '转换中...';
        
        try {
            const downloadUrl = await imagesToPdf(files);
            
            if (downloadUrl) {
                downloadLink.href = `https://api.xyin.online${downloadUrl}`;
                downloadLink.style.display = 'inline';
                downloadLink.textContent = '下载 PDF';
            }
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = '转换为 PDF';
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', setupImageToPdfConverter);
```

对应的 HTML:
```html
<!DOCTYPE html>
<html>
<head>
    <title>图片转 PDF</title>
</head>
<body>
    <h1>图片转 PDF 工具</h1>
    
    <div>
        <label for="imageFiles">选择图片文件:</label>
        <input type="file" id="imageFiles" multiple accept="image/*">
    </div>
    
    <div>
        <button id="convertBtn">转换为 PDF</button>
    </div>
    
    <div>
        <a id="downloadLink" style="display:none;">下载 PDF</a>
    </div>
    
    <script src="image-to-pdf.js"></script>
</body>
</html>
```

## 成功响应

```json
{
  "success": true,
  "message": "成功将3张图片转换为PDF",
  "output_file": "images_to_pdf_a1b2c3d4.pdf",
  "download_url": "/download/images_to_pdf_a1b2c3d4.pdf",
  "image_count": 3,
  "error": null
}
```

## 错误响应

### 无文件上传
```json
{
  "success": false,
  "message": "转换失败",
  "error": "至少需要1个图片文件",
  "output_file": null,
  "download_url": null
}
```

### 不支持的文件格式
```json
{
  "success": false,
  "message": "转换失败",
  "error": "不支持的文件格式: document.txt",
  "output_file": null,
  "download_url": null
}
```

### 文件过大
```json
{
  "detail": "File too large"
}
```

## 高级功能

### 图片预处理

在转换前对图片进行预处理可以获得更好的效果：

```python
from PIL import Image
import os

def preprocess_image(image_path, max_width=2000, quality=85):
    """
    预处理图片：压缩大小，优化质量
    
    Args:
        image_path: 原始图片路径
        max_width: 最大宽度
        quality: JPEG 质量 (1-100)
    
    Returns:
        str: 处理后的图片路径
    """
    
    with Image.open(image_path) as img:
        # 获取原始尺寸
        original_width, original_height = img.size
        
        # 如果宽度超过限制，等比例缩放
        if original_width > max_width:
            ratio = max_width / original_width
            new_width = max_width
            new_height = int(original_height * ratio)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # 转换为 RGB (去除透明通道)
        if img.mode in ('RGBA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        
        # 保存处理后的图片
        processed_path = f"processed_{os.path.basename(image_path)}"
        img.save(processed_path, 'JPEG', quality=quality, optimize=True)
        
        return processed_path

def convert_with_preprocessing(image_paths, output_pdf="optimized.pdf"):
    """转换前预处理图片"""
    
    processed_images = []
    
    try:
        # 预处理所有图片
        for image_path in image_paths:
            processed_path = preprocess_image(image_path)
            processed_images.append(processed_path)
            print(f"已预处理: {image_path} → {processed_path}")
        
        # 转换为 PDF
        result = images_to_pdf(processed_images, output_pdf)
        
        return result
        
    finally:
        # 清理临时文件
        for processed_path in processed_images:
            if os.path.exists(processed_path):
                os.remove(processed_path)
        print("已清理临时文件")

# 使用示例
result = convert_with_preprocessing([
    "large_photo1.jpg",
    "large_photo2.png"
], "optimized_output.pdf")
```

## 最佳实践

### 1. 图片顺序控制

```python
import re

def natural_sort_images(image_paths):
    """自然排序图片文件（正确处理数字）"""
    
    def natural_key(text):
        return [int(c) if c.isdigit() else c.lower() for c in re.split('([0-9]+)', text)]
    
    return sorted(image_paths, key=natural_key)

# 使用示例
image_files = ["img1.jpg", "img10.jpg", "img2.jpg", "img20.jpg"]
sorted_files = natural_sort_images(image_files)
# 结果: ["img1.jpg", "img2.jpg", "img10.jpg", "img20.jpg"]
```

### 2. 文件大小优化

```python
def optimize_for_pdf(image_paths, target_size_mb=5):
    """优化图片以控制 PDF 大小"""
    
    total_size = sum(os.path.getsize(path) for path in image_paths)
    current_mb = total_size / (1024 * 1024)
    
    if current_mb <= target_size_mb:
        return image_paths  # 无需优化
    
    # 计算压缩比例
    compression_ratio = target_size_mb / current_mb
    quality = max(int(85 * compression_ratio), 30)  # 最低质量 30
    
    print(f"当前大小: {current_mb:.2f}MB, 目标: {target_size_mb}MB")
    print(f"应用压缩质量: {quality}")
    
    optimized_paths = []
    for image_path in image_paths:
        optimized_path = preprocess_image(image_path, quality=quality)
        optimized_paths.append(optimized_path)
    
    return optimized_paths
```

### 3. 错误恢复

```python
def robust_images_to_pdf(image_paths, output_path, max_retries=3):
    """带重试机制的图片转 PDF"""
    
    for attempt in range(max_retries):
        try:
            # 验证所有图片文件
            valid_images = []
            for image_path in image_paths:
                if os.path.exists(image_path):
                    try:
                        # 尝试打开图片验证格式
                        with Image.open(image_path) as img:
                            img.verify()
                        valid_images.append(image_path)
                    except Exception as e:
                        print(f"跳过无效图片 {image_path}: {e}")
                else:
                    print(f"跳过不存在的文件: {image_path}")
            
            if not valid_images:
                raise ValueError("没有有效的图片文件")
            
            # 尝试转换
            result = images_to_pdf(valid_images, output_path)
            
            if result:
                return result
            else:
                raise Exception("转换失败")
                
        except Exception as e:
            print(f"第 {attempt + 1} 次尝试失败: {e}")
            if attempt < max_retries - 1:
                print("正在重试...")
                time.sleep(2)
            else:
                print("所有重试均失败")
                return None
```

## 注意事项

### 1. 文件大小限制
- **单个文件**: 最大 10MB
- **总上传大小**: 建议不超过 50MB
- **图片数量**: 建议一次不超过 20 张

### 2. 图片质量
- **原始尺寸**: 保持图片原始比例
- **分辨率**: 高分辨率图片生成的 PDF 文件较大
- **颜色空间**: 自动转换为 RGB

### 3. 性能考虑
- **处理时间**: 与图片数量和大小成正比
- **内存使用**: 大图片会消耗更多内存
- **并发限制**: 避免同时转换过多图片

### 4. 兼容性
- **透明度**: PNG 透明背景会转为白色
- **动画**: GIF 动画只使用第一帧
- **元数据**: EXIF 信息会保留

## 常见问题

**Q: 转换后 PDF 文件很大？**
A: 尝试在转换前压缩图片，或使用较低的 JPEG 质量。

**Q: 图片顺序不对？**
A: 确保文件名使用正确的命名规则，如 `image01.jpg`, `image02.jpg`。

**Q: 某些图片转换失败？**
A: 检查图片文件是否损坏，尝试重新保存图片文件。

**Q: 支持 RAW 格式吗？**
A: 不支持，请先转换为 JPEG 或 PNG 格式。

**Q: 可以设置页面大小吗？**
A: 当前版本会根据图片尺寸自动调整页面大小，暂不支持自定义。
