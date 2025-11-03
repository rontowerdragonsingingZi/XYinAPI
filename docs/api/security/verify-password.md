# 密码验证

验证 PDF 文档的密码是否正确，无需实际解密文件。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/pdf/verify-password`
- **底层技术**: PyMuPDF

## 使用场景

- 验证用户输入的密码是否正确
- 批量处理前预先验证密码
- 密码管理系统的验证功能
- 用户体验优化（避免上传大文件后才发现密码错误）

## 请求参数

| 参数名 | 类型 | 是否必需 | 描述 |
|--------|------|---------|------|
| `file` | FormData | 是 | 待验证的 PDF 文件 |
| `password` | FormData | 是 | 要验证的密码 |

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/pdf/verify-password" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@encrypted.pdf" \
  -F "password=test123"
```

### Python 示例

```python
import requests

def verify_pdf_password(file_path, password):
    """
    验证 PDF 密码
    
    Args:
        file_path: PDF 文件路径
        password: 要验证的密码
    
    Returns:
        dict: 验证结果
    """
    url = "https://api.xyin.online/pdf/verify-password"
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {'password': password}
            
            response = requests.post(url, files=files, data=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return result
            else:
                return {
                    'success': False,
                    'error': f'HTTP {response.status_code}'
                }
                
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

# 使用示例
def test_passwords(file_path, password_list):
    """测试多个密码"""
    
    print(f"正在验证 {file_path} 的密码...")
    
    for i, password in enumerate(password_list, 1):
        print(f"  测试密码 {i}: {'*' * len(password)}")
        
        result = verify_pdf_password(file_path, password)
        
        if result.get('success'):
            if result.get('password_correct'):
                print(f"  ✓ 密码正确！")
                return password
            else:
                print(f"  ✗ 密码错误")
        else:
            print(f"  ✗ 验证失败: {result.get('error')}")
    
    print("所有密码都不正确")
    return None

# 使用示例
if __name__ == "__main__":
    # 单个密码验证
    result = verify_pdf_password("secure.pdf", "mypassword")
    if result['success'] and result['password_correct']:
        print("密码正确")
    
    # 多密码测试
    passwords = ["123456", "password", "admin", "secret123"]
    correct_password = test_passwords("secure.pdf", passwords)
```

## 成功响应

### 密码正确
```json
{
  "success": true,
  "password_correct": true,
  "password_type": "user_password",
  "filename": "document.pdf",
  "error": null
}
```

### 密码错误
```json
{
  "success": true,
  "password_correct": false,
  "password_type": null,
  "filename": "document.pdf",
  "error": null
}
```

## 错误响应

### 文件未加密
```json
{
  "success": false,
  "password_correct": null,
  "error": "PDF文件未加密",
  "filename": null
}
```

### 文件格式错误
```json
{
  "success": false,
  "password_correct": null,
  "error": "只支持PDF文件",
  "filename": null
}
```

## 高级应用

### 智能密码猜测

```python
import itertools
import string

def generate_common_passwords():
    """生成常见密码列表"""
    common_passwords = [
        "123456", "password", "123456789", "12345678", "12345",
        "1234567", "1234567890", "qwerty", "abc123", "password123",
        "admin", "root", "user", "guest", "test"
    ]
    
    return common_passwords

def brute_force_simple(file_path, max_length=4):
    """简单的暴力破解（仅用于演示，实际使用需谨慎）"""
    
    print(f"开始暴力破解 {file_path}（最大长度: {max_length}）")
    print("警告: 此功能仅用于演示，请勿用于非法用途")
    
    # 字符集（数字）
    charset = string.digits
    
    for length in range(1, max_length + 1):
        print(f"尝试长度 {length} 的密码...")
        
        for password_tuple in itertools.product(charset, repeat=length):
            password = ''.join(password_tuple)
            
            result = verify_pdf_password(file_path, password)
            
            if result.get('success') and result.get('password_correct'):
                print(f"找到密码: {password}")
                return password
            
            # 避免过于频繁的请求
            if int(password) % 100 == 0:
                print(f"  已尝试: {password}")
    
    print("未找到密码")
    return None

def smart_password_crack(file_path):
    """智能密码破解策略"""
    
    strategies = [
        ("常见密码", generate_common_passwords()),
        ("年份密码", [str(year) for year in range(1980, 2025)]),
        ("简单数字", [str(i).zfill(4) for i in range(10000)]),  # 0000-9999
    ]
    
    for strategy_name, password_list in strategies:
        print(f"\n尝试策略: {strategy_name}")
        
        for password in password_list:
            result = verify_pdf_password(file_path, password)
            
            if result.get('success') and result.get('password_correct'):
                print(f"✓ 找到密码: {password}")
                return password
        
        print(f"策略 {strategy_name} 失败")
    
    return None
```

### 密码强度检测

```python
def check_password_strength(password):
    """检查密码强度"""
    
    score = 0
    feedback = []
    
    # 长度检查
    if len(password) >= 8:
        score += 2
    elif len(password) >= 6:
        score += 1
    else:
        feedback.append("密码长度至少6位")
    
    # 字符类型检查
    if any(c.isupper() for c in password):
        score += 1
    else:
        feedback.append("建议包含大写字母")
    
    if any(c.islower() for c in password):
        score += 1
    else:
        feedback.append("建议包含小写字母")
    
    if any(c.isdigit() for c in password):
        score += 1
    else:
        feedback.append("建议包含数字")
    
    if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        score += 2
    else:
        feedback.append("建议包含特殊字符")
    
    # 评级
    if score >= 7:
        strength = "强"
    elif score >= 5:
        strength = "中等"
    elif score >= 3:
        strength = "弱"
    else:
        strength = "很弱"
    
    return {
        'score': score,
        'strength': strength,
        'feedback': feedback
    }

# 使用示例
password_strength = check_password_strength("MyP@ssw0rd123")
print(f"密码强度: {password_strength['strength']}")
print(f"评分: {password_strength['score']}/8")
if password_strength['feedback']:
    print("建议:", "; ".join(password_strength['feedback']))
```

## 性能优化

### 批量验证优化

```python
from concurrent.futures import ThreadPoolExecutor
import time

def batch_verify_passwords(file_path, password_list, max_workers=5):
    """并行验证多个密码"""
    
    def verify_single(password):
        return {
            'password': password,
            'result': verify_pdf_password(file_path, password)
        }
    
    print(f"并行验证 {len(password_list)} 个密码...")
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(verify_single, password_list))
    
    elapsed = time.time() - start_time
    print(f"验证完成，耗时: {elapsed:.2f}秒")
    
    # 查找正确密码
    for item in results:
        result = item['result']
        if result.get('success') and result.get('password_correct'):
            return item['password']
    
    return None
```

## 最佳实践

1. **密码策略**: 先尝试常见密码，再尝试复杂密码
2. **频率控制**: 避免过于频繁的验证请求
3. **错误处理**: 妥善处理网络错误和文件错误
4. **安全考量**: 不要在日志中记录密码明文
5. **用户体验**: 提供密码强度提示和验证进度

## 注意事项

1. **仅验证不解密**: 此接口只验证密码，不会生成解密文件
2. **密码类型**: 自动识别用户密码或所有者密码
3. **性能考虑**: 验证比解密更快，适合预检查
4. **安全风险**: 避免暴力破解，尊重文档保护意图

## 常见问题

**Q: 验证和解密有什么区别？**
A: 验证只检查密码正确性，解密会生成无密码的新文件。

**Q: 可以同时验证多个密码吗？**
A: 当前接口不支持，但可以客户端并行调用多次。

**Q: 如何知道密码是用户密码还是所有者密码？**
A: 响应中的 `password_type` 字段会标明密码类型。
