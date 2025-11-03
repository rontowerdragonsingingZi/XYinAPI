# 清理文件

清理服务器上的临时文件，释放存储空间。

## 接口信息

- **请求方式**: `POST`
- **接口地址**: `/cleanup`
- **说明**: 清理过期的转换文件

## 清理策略

- **自动清理**: 服务器会定期自动清理过期文件
- **手动清理**: 可通过此接口手动触发清理
- **保留时间**: 文件默认保留 1 小时后清理

## 请求示例

### cURL 示例

```bash
curl -X POST "https://api.xyin.online/cleanup"
```

### Python 示例

```python
import requests

def cleanup_files():
    """手动触发文件清理"""
    url = "https://api.xyin.online/cleanup"
    
    try:
        response = requests.post(url, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ 清理完成: {result['message']}")
            if 'files_cleaned' in result:
                print(f"  清理文件数量: {result['files_cleaned']}")
            return True
        else:
            print(f"✗ 清理失败: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ 清理出错: {e}")
        return False

# 使用示例
cleanup_files()
```

## 成功响应

```json
{
  "message": "临时文件清理完成",
  "files_cleaned": 15,
  "space_freed": "125.7 MB"
}
```

## 注意事项

1. **自动执行**: 系统会自动清理，通常无需手动调用
2. **清理时机**: 建议在服务器维护时手动清理
3. **不可恢复**: 清理后的文件无法恢复
4. **权限要求**: 某些部署环境可能需要管理员权限
