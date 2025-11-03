# 健康检查

检查服务健康状态和 LibreOffice 版本信息，确保 API 服务正常运行。

## 接口信息

- **请求方式**: `GET`
- **接口地址**: `/health`
- **说明**: 无需参数的快速健康检查

## 请求示例

### cURL 示例

```bash
curl https://api.xyin.online/health
```

### Python 示例

```python
import requests

def check_api_health():
    """检查 API 服务健康状态"""
    
    url = "https://api.xyin.online/health"
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✓ 服务状态: 健康")
            print(f"  LibreOffice 版本: {result['libreoffice_version']}")
            print(f"  LibreOffice 路径: {result['soffice_path']}")
            return True
        else:
            print(f"✗ 服务异常: HTTP {response.status_code}")
            if response.status_code == 503:
                error_detail = response.json().get('detail', '未知错误')
                print(f"  错误详情: {error_detail}")
            return False
            
    except requests.exceptions.Timeout:
        print("✗ 请求超时: 服务可能不可用")
        return False
    except requests.exceptions.ConnectionError:
        print("✗ 连接失败: 无法连接到服务器")
        return False
    except Exception as e:
        print(f"✗ 检查失败: {e}")
        return False

# 使用示例
if check_api_health():
    print("可以开始使用 API 服务")
else:
    print("请检查服务状态或稍后重试")
```

## 成功响应

```json
{
  "status": "healthy",
  "libreoffice_version": "LibreOffice 7.3.7.2 30(Build:2)",
  "soffice_path": "/usr/bin/soffice"
}
```

## 错误响应

当服务不健康时，返回 503 状态码：

```json
{
  "detail": "Service unhealthy: LibreOffice not found or not responding"
}
```

## 监控集成

### 自动化健康检查

```python
import time
import logging
from datetime import datetime

class HealthMonitor:
    def __init__(self, check_interval=60, max_failures=3):
        self.check_interval = check_interval  # 检查间隔（秒）
        self.max_failures = max_failures      # 最大失败次数
        self.failure_count = 0
        self.last_check = None
        self.is_healthy = None
        
    def start_monitoring(self):
        """启动持续监控"""
        logging.info("开始健康监控...")
        
        while True:
            try:
                is_healthy = self.check_health()
                self.handle_health_status(is_healthy)
                
                time.sleep(self.check_interval)
                
            except KeyboardInterrupt:
                logging.info("监控已停止")
                break
            except Exception as e:
                logging.error(f"监控出错: {e}")
                time.sleep(10)  # 出错时短暂休息
    
    def check_health(self):
        """执行健康检查"""
        url = "https://api.xyin.online/health"
        
        try:
            response = requests.get(url, timeout=10)
            self.last_check = datetime.now()
            
            if response.status_code == 200:
                self.failure_count = 0
                return True
            else:
                self.failure_count += 1
                logging.warning(f"健康检查失败: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.failure_count += 1
            logging.error(f"健康检查异常: {e}")
            return False
    
    def handle_health_status(self, is_healthy):
        """处理健康状态变化"""
        
        # 状态发生变化
        if self.is_healthy != is_healthy:
            if is_healthy:
                logging.info("✓ 服务已恢复健康")
                self.send_alert("服务恢复", "API 服务已恢复正常运行")
            else:
                logging.error("✗ 服务变为不健康")
                
        # 连续失败达到阈值
        if not is_healthy and self.failure_count >= self.max_failures:
            logging.critical(f"服务连续 {self.failure_count} 次检查失败")
            self.send_alert("服务异常", f"API 服务连续 {self.failure_count} 次健康检查失败")
        
        self.is_healthy = is_healthy
    
    def send_alert(self, title, message):
        """发送告警通知"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        alert_message = f"[{timestamp}] {title}: {message}"
        
        # 这里可以集成各种通知方式
        print(f"🚨 ALERT: {alert_message}")
        
        # 可以添加邮件、短信、Webhook 等通知方式
        # self.send_email(title, message)
        # self.send_webhook(alert_message)

# 使用示例
monitor = HealthMonitor(check_interval=30, max_failures=3)
# monitor.start_monitoring()  # 在生产环境中运行
```

### 集群健康检查

```python
def check_multiple_endpoints(endpoints):
    """检查多个 API 端点的健康状态"""
    
    results = {}
    
    for name, url in endpoints.items():
        health_url = f"{url}/health"
        
        try:
            response = requests.get(health_url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                results[name] = {
                    'status': 'healthy',
                    'libreoffice_version': data.get('libreoffice_version'),
                    'response_time': response.elapsed.total_seconds()
                }
            else:
                results[name] = {
                    'status': 'unhealthy',
                    'error': f"HTTP {response.status_code}",
                    'response_time': response.elapsed.total_seconds()
                }
                
        except Exception as e:
            results[name] = {
                'status': 'error',
                'error': str(e),
                'response_time': None
            }
    
    return results

# 使用示例
endpoints = {
    'primary': 'https://api.xyin.online',
    'backup': 'http://backup.example.com:8000',
    'local': 'http://localhost:8000'
}

health_status = check_multiple_endpoints(endpoints)

for name, status in health_status.items():
    print(f"{name}: {status['status']}")
    if status['response_time']:
        print(f"  响应时间: {status['response_time']:.3f}s")
    if status.get('error'):
        print(f"  错误: {status['error']}")
```

## 系统信息接口

### API 基本信息

**请求**: `GET /api`

```bash
curl https://api.xyin.online/api
```

**响应**:
```json
{
  "message": "LibreOffice Document Conversion API",
  "version": "1.0.0",
  "docs": "/docs",
  "health": "/health"
}
```

### 完整系统状态

```python
def get_system_status():
    """获取完整的系统状态信息"""
    
    base_url = "https://api.xyin.online"
    
    status = {
        'timestamp': datetime.now().isoformat(),
        'api_info': None,
        'health': None,
        'endpoints': {
            'docs': f"{base_url}/docs",
            'redoc': f"{base_url}/redoc"
        }
    }
    
    try:
        # API 基本信息
        api_response = requests.get(f"{base_url}/api", timeout=5)
        if api_response.status_code == 200:
            status['api_info'] = api_response.json()
    except:
        pass
    
    try:
        # 健康检查
        health_response = requests.get(f"{base_url}/health", timeout=5)
        if health_response.status_code == 200:
            status['health'] = health_response.json()
        else:
            status['health'] = {
                'status': 'unhealthy',
                'error': f"HTTP {health_response.status_code}"
            }
    except Exception as e:
        status['health'] = {
            'status': 'error',
            'error': str(e)
        }
    
    return status

# 使用示例
system_status = get_system_status()
print(json.dumps(system_status, indent=2, ensure_ascii=False))
```

## 故障排除

### 常见问题诊断

```python
def diagnose_api_issues():
    """诊断 API 可能的问题"""
    
    base_url = "https://api.xyin.online"
    
    print("🔍 开始诊断 API 服务...")
    
    # 1. 网络连接测试
    print("\n1. 测试网络连接...")
    try:
        import socket
        host = "api.xyin.online"
        port = 443
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        
        if result == 0:
            print(f"✓ 端口 {port} 可达")
        else:
            print(f"✗ 端口 {port} 不可达")
            return
    except Exception as e:
        print(f"✗ 网络测试失败: {e}")
        return
    
    # 2. HTTP 响应测试
    print("\n2. 测试 HTTP 响应...")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"  根路径响应: HTTP {response.status_code}")
    except Exception as e:
        print(f"✗ HTTP 请求失败: {e}")
        return
    
    # 3. API 端点测试
    print("\n3. 测试 API 端点...")
    endpoints = [
        ("/api", "API 信息"),
        ("/health", "健康检查"),
        ("/docs", "文档页面")
    ]
    
    for endpoint, description in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                print(f"✓ {description}: 正常")
            else:
                print(f"⚠ {description}: HTTP {response.status_code}")
        except Exception as e:
            print(f"✗ {description}: {e}")
    
    # 4. LibreOffice 状态检查
    print("\n4. 检查 LibreOffice 状态...")
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            health_data = response.json()
            print(f"✓ LibreOffice 版本: {health_data['libreoffice_version']}")
            print(f"✓ LibreOffice 路径: {health_data['soffice_path']}")
        elif response.status_code == 503:
            error_data = response.json()
            print(f"✗ LibreOffice 异常: {error_data['detail']}")
        else:
            print(f"⚠ 健康检查异常: HTTP {response.status_code}")
    except Exception as e:
        print(f"✗ 健康检查失败: {e}")
    
    print("\n🏁 诊断完成")

# 运行诊断
diagnose_api_issues()
```

## 最佳实践

### 1. 定期健康检查
```python
# 在应用启动时检查
def ensure_api_available():
    max_retries = 5
    retry_delay = 2
    
    for i in range(max_retries):
        if check_api_health():
            return True
        
        if i < max_retries - 1:
            print(f"等待 API 服务就绪... ({i+1}/{max_retries})")
            time.sleep(retry_delay)
    
    raise Exception("API 服务不可用")

# 应用启动时调用
ensure_api_available()
```

### 2. 请求前预检查
```python
def safe_api_call(func, *args, **kwargs):
    """安全的 API 调用包装"""
    
    # 先检查服务健康状态
    if not check_api_health():
        raise Exception("API 服务不可用")
    
    # 执行实际的 API 调用
    return func(*args, **kwargs)

# 使用示例
try:
    result = safe_api_call(convert_document, "test.docx", "pdf")
except Exception as e:
    print(f"API 调用失败: {e}")
```

### 3. 负载均衡健康检查
```python
def select_healthy_endpoint(endpoints):
    """选择健康的 API 端点"""
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{endpoint}/health", timeout=3)
            if response.status_code == 200:
                return endpoint
        except:
            continue
    
    return None

endpoints = [
    "https://api.xyin.online",
    "http://backup.server:8000"
]

healthy_endpoint = select_healthy_endpoint(endpoints)
if healthy_endpoint:
    print(f"使用端点: {healthy_endpoint}")
else:
    print("没有可用的健康端点")
```
