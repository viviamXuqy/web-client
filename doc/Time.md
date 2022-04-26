## 时间配置 Api

### 1.Save Ntp Time（保存Ntp校时）
#### Endpoint

post --  /api/system/time/ntp


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| server | 服务器地址 | required | |
| port | 端口 | required | |
| interval | 校时时间间隔,前端发给后台格式是毫秒 | required | |
| type | 校时类型：1 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/system/time/ntp' -d '{"server":"http://172.16.105.15","port":"80"，"interval":3661000，"type":"1"}'

Response:

{
    "code": 200,
    "result": 'success'
}
```

### 2.Save Manual Time（保存手动校时）
#### Endpoint

post -- /api/system/time/manual

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| time | 设置时间，前端发给后台格式是毫秒  | required | |
| type | 校时类型：2 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/system/time/manual' -d '{"time":1532325013645, "type":"2"}'

Response:
 
{
    "code": 200,
    "result": 'success'
}

```

