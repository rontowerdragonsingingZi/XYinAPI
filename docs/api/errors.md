# 错误处理

## HTTP 状态码说明

### 成功状态码

| 状态码 | 说明 | 使用场景 |
|--------|------|---------|
| **200** | 请求成功 | 所有成功的 API 调用 |

### 客户端错误

| 状态码 | 说明 | 常见原因 | 解决方案 |
|--------|------|---------|---------|
| **400** | 请求参数错误 | 文件格式不支持、参数缺失、参数值无效 | 检查请求参数和文件格式 |
| **403** | 访问被拒绝 | 目录遍历攻击防护触发 | 使用正确的文件名，不包含路径字符 |
| **404** | 文件不存在 | 下载的文件已被清理或不存在 | 重新生成文件或检查文件名 |
| **413** | 文件过大 | 上传文件超过 10MB 限制 | 压缩文件或分割处理 |

### 服务器错误

| 状态码 | 说明 | 可能原因 | 建议处理 |
|--------|------|---------|---------|
| **500** | 服务器内部错误 | 转换失败、系统异常 | 重试请求或联系技术支持 |
| **503** | 服务不可用 | LibreOffice 服务异常 | 等待服务恢复或使用健康检查接口 |

## 错误响应格式

### 标准错误响应

```json
{
  "success": false,
  "message": "用户友好的错误描述",
  "output_file": null,
  "download_url": null,
  "error": "详细的技术错误信息"
}
```

### HTTP 错误响应

对于 HTTP 层面的错误（如 404、413 等），响应格式为：

```json
{
  "detail": "错误详细信息"
}
```

## 常见错误及解决方案

### 文件相关错误

#### 1. 不支持的文件类型 (400)

**错误信息**: `"只支持 PDF 文件"` 或 `"不支持的文件格式"`

**解决方案**:
- 确认文件扩展名正确
- 检查文件是否损坏
- 使用支持的文件格式列表进行验证

**示例**:
```bash
# 错误：上传 txt 文件到 PDF 转换接口
curl -X POST "https://api.xyin.online/pdf/to-png" \
  -F "file=@document.txt"

# 正确：上传 PDF 文件
curl -X POST "https://api.xyin.online/pdf/to-png" \
  -F "file=@document.pdf"
```

#### 2. 文件过大 (413)

**错误信息**: `"File too large"`

**解决方案**:
- 压缩文件大小
- 分割大文件为多个小文件
- 优化文档内容（移除大图片等）

#### 3. 文件损坏 (400/500)

**错误信息**: 各种转换失败信息

**解决方案**:
- 检查文件是否完整
- 重新生成或修复文件
- 尝试使用其他工具打开文件验证

### 参数相关错误

#### 1. 缺少必需参数 (400)

**错误信息**: `"至少需要提供一个密码"` 或类似

**解决方案**:
```bash
# 错误：缺少必需参数
curl -X POST "https://api.xyin.online/pdf/encrypt" \
  -F "file=@document.pdf"

# 正确：提供必需参数
curl -X POST "https://api.xyin.online/pdf/encrypt" \
  -F "file=@document.pdf" \
  -F "user_password=mypassword"
```

#### 2. 参数值无效 (400)

**错误信息**: `"拆分份数必须≥1"` 或 `"DPI范围无效"`

**解决方案**:
- 检查参数值范围
- 参考 API 文档中的参数说明
- 使用有效的枚举值

### 系统相关错误

#### 1. LibreOffice 服务异常 (503)

**错误信息**: `"Service unhealthy: [错误信息]"`

**解决方案**:
- 使用健康检查接口确认服务状态
- 等待服务自动恢复
- 重试请求

**健康检查示例**:
```bash
curl https://api.xyin.online/health
```

#### 2. 转换超时 (500)

**错误信息**: 转换相关的错误信息

**解决方案**:
- 减小文件大小
- 简化文档复杂度
- 分批处理多个文件

### 下载相关错误

#### 1. 文件不存在 (404)

**原因**:
- 文件已被自动清理
- 文件名错误
- 转换失败但未报错

**解决方案**:
- 重新执行转换操作
- 检查转换响应中的 success 字段
- 立即下载转换结果

#### 2. 访问被拒绝 (403)

**原因**: 文件名包含路径遍历字符

**解决方案**:
- 使用响应中返回的确切文件名
- 不要修改文件名中的路径部分

## 最佳实践

### 1. 错误处理流程

```python
import requests

def convert_document(file_path, output_format):
    try:
        with open(file_path, 'rb') as f:
            response = requests.post(
                'https://api.xyin.online/convert',
                files={'file': f},
                data={'output_format': output_format},
                timeout=300
            )
        
        # 检查 HTTP 状态码
        if response.status_code != 200:
            print(f"HTTP Error: {response.status_code}")
            print(f"Detail: {response.json().get('detail', 'Unknown error')}")
            return None
            
        # 检查业务逻辑状态
        result = response.json()
        if not result['success']:
            print(f"Conversion failed: {result['message']}")
            print(f"Error details: {result['error']}")
            return None
            
        return result['download_url']
        
    except requests.exceptions.Timeout:
        print("Request timeout - file too large or server busy")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
```

### 2. 重试机制

```python
import time
import requests

def api_call_with_retry(url, data=None, files=None, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(url, data=data, files=files, timeout=300)
            
            # 5xx 错误可以重试
            if response.status_code >= 500:
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # 指数退避
                    continue
                    
            return response
            
        except requests.exceptions.Timeout:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
            
    return response
```

### 3. 文件验证

```python
import os
import mimetypes

def validate_file(file_path, allowed_types):
    # 检查文件大小（10MB 限制）
    if os.path.getsize(file_path) > 10 * 1024 * 1024:
        raise ValueError("File too large (max 10MB)")
    
    # 检查 MIME 类型
    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type not in allowed_types:
        raise ValueError(f"Unsupported file type: {mime_type}")
    
    return True

# 使用示例
pdf_types = ['application/pdf']
doc_types = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']

try:
    validate_file('document.pdf', pdf_types)
    # 继续处理
except ValueError as e:
    print(f"File validation failed: {e}")
```

## 故障排除

### 1. 服务连接问题

```bash
# 检查服务是否可达
curl -I https://api.xyin.online/health

# 检查具体错误信息
curl -v https://api.xyin.online/api
```

### 2. 文件上传问题

```bash
# 使用 -v 参数查看详细请求信息
curl -v -X POST "https://api.xyin.online/convert" \
  -F "file=@document.docx" \
  -F "output_format=pdf"
```

### 3. 响应解析问题

确保正确解析 JSON 响应，特别注意 `success` 字段的值。

## 技术支持

如果遇到持续的问题：

1. 记录完整的请求和响应信息
2. 包含文件类型、大小等详细信息
3. 提供错误复现的步骤
4. 检查 [在线 API 文档](https://api.xyin.online/docs) 获取最新信息
