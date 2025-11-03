# PDF 加密

为 PDF 文件添加密码保护，支持多种加密算法和权限控制。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/encrypt`
- **底层技术**: PyMuPDF

## 加密功能

### 支持的加密算法
- **RC4-128**: 传统RC4加密算法
- **AES-128**: AES 128位加密（推荐）
- **AES-256**: AES 256位加密（最强加密，推荐）

### 密码类型
- **user_password**: 用户密码（打开PDF需要输入）
- **owner_password**: 所有者密码（控制编辑、打印等权限）

### 权限控制
- **allow_printing**: 是否允许打印
- **allow_modify**: 是否允许编辑

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 | 默认值 |
|--------|------|---------|------|--------|
| `file` | FormData | 是 | 待加密的 PDF 文件 | - |
| `user_password` | FormData | 否* | 用户密码（打开密码） | - |
| `owner_password` | FormData | 否* | 所有者密码（权限密码） | - |
| `encryption_method` | FormData | 否 | 加密算法 | AES-256 |
| `allow_printing` | FormData | 否** | 是否允许打印 | true |
| `allow_modify` | FormData | 否** | 是否允许编辑 | true |

**重要限制**:
1. `*` 至少需要提供 `user_password` 或 `owner_password` 中的一个
2. `**` 仅当提供 `owner_password` 时，`allow_printing` 和 `allow_modify` 中至少有一个必须为 `false`

## 请求示例

### cURL 示例

#### 基础用户密码加密
```bash
curl -X POST "https://api.xyin.online/pdf/encrypt" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "user_password=mypassword123"
```

#### 完整权限控制
```bash
curl -X POST "https://api.xyin.online/pdf/encrypt" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "user_password=userpass123" \
  -F "owner_password=ownerpass123" \
  -F "encryption_method=AES-256" \
  -F "allow_printing=false" \
  -F "allow_modify=true"
```

### Python 示例

```python
import requests
import os

def encrypt_pdf(file_path, user_password=None, owner_password=None, 
                encryption_method="AES-256", allow_printing=True, 
                allow_modify=True, output_dir="./encrypted"):
    """
    加密 PDF 文件
    
    Args:
        file_path: PDF 文件路径
        user_password: 用户密码（打开密码）
        owner_password: 所有者密码（权限密码）
        encryption_method: 加密算法 (RC4-128/AES-128/AES-256)
        allow_printing: 是否允许打印
        allow_modify: 是否允许编辑
        output_dir: 输出目录
    
    Returns:
        str: 加密后的文件路径，失败时返回 None
    """
    
    if not user_password and not owner_password:
        print("错误: 至少需要提供一个密码")
        return None
    
    url = "https://api.xyin.online/pdf/encrypt"
    
    # 准备请求数据
    data = {
        'encryption_method': encryption_method
    }
    
    if user_password:
        data['user_password'] = user_password
    
    if owner_password:
        data['owner_password'] = owner_password
        data['allow_printing'] = str(allow_printing).lower()
        data['allow_modify'] = str(allow_modify).lower()
    
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            
            print(f"正在加密 {file_path}...")
            response = requests.post(url, files=files, data=data, timeout=300)
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    print(f"✓ 加密成功: {result['message']}")
                    
                    # 下载加密后的文件
                    download_url = result['download_url']
                    encrypted_response = requests.get(f"https://api.xyin.online{download_url}")
                    
                    if encrypted_response.status_code == 200:
                        output_filename = result['output_file']
                        output_path = os.path.join(output_dir, output_filename)
                        
                        with open(output_path, 'wb') as encrypted_file:
                            encrypted_file.write(encrypted_response.content)
                        
                        print(f"✓ 加密文件已保存: {output_path}")
                        print(f"  加密算法: {result['encryption_method']}")
                        print(f"  允许打印: {result['allow_printing']}")
                        print(f"  允许编辑: {result['allow_modify']}")
                        
                        return output_path
                    else:
                        print("下载加密文件失败")
                else:
                    print(f"✗ 加密失败: {result['error']}")
            else:
                print(f"✗ 请求失败: {response.status_code}")
                
    except Exception as e:
        print(f"✗ 处理过程中出错: {e}")
    
    return None

# 使用示例
if __name__ == "__main__":
    # 基础加密（仅用户密码）
    encrypted1 = encrypt_pdf(
        "document.pdf", 
        user_password="secret123"
    )
    
    # 完整权限控制
    encrypted2 = encrypt_pdf(
        "sensitive.pdf",
        user_password="userpass",
        owner_password="adminpass", 
        encryption_method="AES-256",
        allow_printing=False,  # 禁止打印
        allow_modify=True      # 允许编辑
    )
    
    # 仅权限保护（无用户密码）
    encrypted3 = encrypt_pdf(
        "restricted.pdf",
        owner_password="owneronly",
        allow_printing=True,
        allow_modify=False     # 禁止编辑
    )
```

## 成功响应

```json
{
  "success": true,
  "message": "PDF加密成功",
  "output_file": "document_encrypted.pdf",
  "download_url": "/download/document_encrypted.pdf",
  "encryption_method": "AES-256",
  "allow_printing": false,
  "allow_modify": true,
  "error": null
}
```

## 错误响应

### 缺少密码
```json
{
  "success": false,
  "message": "加密失败",
  "error": "至少需要提供一个密码",
  "output_file": null,
  "download_url": null
}
```

### 权限设置错误
```json
{
  "success": false,
  "message": "加密失败", 
  "error": "当提供owner_password时至少有一个权限必须为不允许",
  "output_file": null,
  "download_url": null
}
```

## 高级应用

### 批量加密

```python
def batch_encrypt_pdfs(pdf_files, password_config, output_dir="./encrypted_batch"):
    """
    批量加密 PDF 文件
    
    Args:
        pdf_files: PDF 文件路径列表
        password_config: 密码配置字典
        output_dir: 输出目录
    """
    
    results = []
    
    for pdf_file in pdf_files:
        filename = os.path.basename(pdf_file)
        print(f"\n处理文件: {filename}")
        
        try:
            encrypted_file = encrypt_pdf(
                pdf_file,
                user_password=password_config.get('user_password'),
                owner_password=password_config.get('owner_password'),
                encryption_method=password_config.get('encryption_method', 'AES-256'),
                allow_printing=password_config.get('allow_printing', True),
                allow_modify=password_config.get('allow_modify', True),
                output_dir=output_dir
            )
            
            if encrypted_file:
                results.append({
                    'file': filename,
                    'success': True,
                    'encrypted_file': encrypted_file
                })
            else:
                results.append({
                    'file': filename,
                    'success': False,
                    'error': '加密失败'
                })
                
        except Exception as e:
            results.append({
                'file': filename,
                'success': False,
                'error': str(e)
            })
    
    # 统计结果
    success_count = sum(1 for r in results if r['success'])
    print(f"\n批量加密完成:")
    print(f"  成功: {success_count}/{len(pdf_files)}")
    
    return results

# 使用示例
pdf_files = ["doc1.pdf", "doc2.pdf", "doc3.pdf"]
config = {
    'user_password': 'common_password',
    'owner_password': 'admin_password',
    'encryption_method': 'AES-256',
    'allow_printing': False,
    'allow_modify': True
}

results = batch_encrypt_pdfs(pdf_files, config)
```

### 动态密码生成

```python
import secrets
import string

def generate_secure_password(length=12):
    """生成安全密码"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password

def encrypt_with_auto_password(file_path, security_level="high"):
    """
    自动生成密码并加密
    
    Args:
        file_path: PDF 文件路径
        security_level: 安全级别 (low/medium/high)
    
    Returns:
        dict: 包含加密文件和密码信息
    """
    
    # 根据安全级别选择配置
    configs = {
        'low': {
            'user_password': generate_secure_password(8),
            'encryption_method': 'RC4-128',
            'allow_printing': True,
            'allow_modify': True
        },
        'medium': {
            'user_password': generate_secure_password(10),
            'owner_password': generate_secure_password(12),
            'encryption_method': 'AES-128',
            'allow_printing': True,
            'allow_modify': False
        },
        'high': {
            'user_password': generate_secure_password(16),
            'owner_password': generate_secure_password(20),
            'encryption_method': 'AES-256',
            'allow_printing': False,
            'allow_modify': False
        }
    }
    
    config = configs.get(security_level, configs['medium'])
    
    encrypted_file = encrypt_pdf(file_path, **config)
    
    if encrypted_file:
        return {
            'success': True,
            'encrypted_file': encrypted_file,
            'passwords': {
                'user_password': config.get('user_password'),
                'owner_password': config.get('owner_password')
            },
            'security_level': security_level
        }
    
    return {'success': False}

# 使用示例
result = encrypt_with_auto_password("important.pdf", "high")
if result['success']:
    print(f"加密成功: {result['encrypted_file']}")
    print(f"用户密码: {result['passwords']['user_password']}")
    print(f"所有者密码: {result['passwords']['owner_password']}")
```

### 条件加密

```python
def smart_encrypt_pdf(file_path, content_keywords=None, file_size_threshold_mb=5):
    """
    根据内容和文件大小智能选择加密策略
    
    Args:
        file_path: PDF 文件路径
        content_keywords: 敏感词列表
        file_size_threshold_mb: 大文件阈值（MB）
    
    Returns:
        dict: 加密结果和策略信息
    """
    
    # 检查文件大小
    file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
    
    # 提取文本内容检查敏感词
    has_sensitive_content = False
    if content_keywords:
        # 这里可以调用文字提取 API 检查内容
        # text = extract_pdf_text(file_path, "both")
        # has_sensitive_content = any(keyword in text.lower() for keyword in content_keywords)
        pass
    
    # 根据条件选择加密策略
    if has_sensitive_content:
        # 敏感内容 - 高级加密
        config = {
            'user_password': generate_secure_password(16),
            'owner_password': generate_secure_password(20),
            'encryption_method': 'AES-256',
            'allow_printing': False,
            'allow_modify': False
        }
        strategy = "sensitive_content"
        
    elif file_size_mb > file_size_threshold_mb:
        # 大文件 - 中等加密
        config = {
            'user_password': generate_secure_password(12),
            'encryption_method': 'AES-128',
            'allow_printing': True,
            'allow_modify': False
        }
        strategy = "large_file"
        
    else:
        # 普通文件 - 基础加密
        config = {
            'user_password': generate_secure_password(10),
            'encryption_method': 'AES-128',
            'allow_printing': True,
            'allow_modify': True
        }
        strategy = "standard"
    
    encrypted_file = encrypt_pdf(file_path, **config)
    
    return {
        'success': encrypted_file is not None,
        'encrypted_file': encrypted_file,
        'strategy': strategy,
        'file_size_mb': round(file_size_mb, 2),
        'passwords': {
            'user_password': config.get('user_password'),
            'owner_password': config.get('owner_password')
        }
    }

# 使用示例
sensitive_words = ["机密", "confidential", "secret", "内部"]
result = smart_encrypt_pdf("document.pdf", sensitive_words, 5)

print(f"加密策略: {result['strategy']}")
print(f"文件大小: {result['file_size_mb']} MB")
if result['success']:
    print(f"加密成功: {result['encrypted_file']}")
```

## 安全建议

### 1. 密码管理
- 使用强密码（至少12位，包含大小写字母、数字、特殊字符）
- 用户密码和所有者密码应该不同
- 定期更换密码

### 2. 加密算法选择
- **生产环境推荐**: AES-256
- **兼容性考虑**: AES-128  
- **避免使用**: RC4-128（除非有特殊兼容性需求）

### 3. 权限设置
- 根据实际需求设置打印和编辑权限
- 敏感文档建议禁用所有权限
- 仅所有者密码时必须限制至少一项权限

## 注意事项

1. **加密强度**: AES-256 提供最高安全性
2. **兼容性**: 较老的 PDF 阅读器可能不支持 AES 加密
3. **密码遗失**: 加密后如果遗失密码，文件将无法恢复
4. **性能影响**: 加密会略微增加文件大小和处理时间

## 常见问题

**Q: 加密后的 PDF 在某些设备上无法打开？**
A: 尝试使用 AES-128 或 RC4-128 加密算法，提高兼容性。

**Q: 可以修改已加密 PDF 的密码吗？**
A: 需要先解密再重新加密设置新密码。

**Q: 权限设置不生效？**
A: 确保提供了所有者密码，并且至少有一个权限设为 false。

**Q: 加密会影响 PDF 质量吗？**
A: 不会，加密只是添加访问控制，不会改变内容质量。
