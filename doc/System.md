## 系统设置 Api

### 1.Modify Work Mode(修改工作配置)
#### Endpoint

put -- /api/system/mode


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| type | 工作配置类型 1：高性能模式，2：普通模式  | required | 1/2 |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/system/mode' -d '{"type":"1"}'

Response:
    {
      "code": 200,
      "result": null
    }

```

### 2.Recover System Configuration（恢复系统配置）
#### Endpoint

put -- /api/system/config


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| type | 恢复类型 1：简单恢复，2：完全恢复  | required | 1/2 |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/system/config' -d '{"type":"1"}'

Response:
    {
       "code": 200,
       "result": null
    }
```

### 3.Get Sdk List（获取sdk传输协议列表）
#### Endpoint

get -- /api/system/event

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 5 |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/system/sdk'

Response:
{
    "code": 200,
    "result": {
       "page" : 1,
       "pageSize" : 5,
       "total" : 20,
       "data" : [
          {
            "_id" : 1,
            "eventId": "事件编号",
            "eventName": "事件名",
            "url": "url",
            "eventType": "1",
            "status":"0关闭/1开启"
           }
       ]
    }
}

```

### 4.Add Http（添加协议)
#### Endpoint

post --  /api/system/event


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| eventName | 事件名 | required | |
| url | 传输url | required | |
| type | 事件类型 1：结果上报 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/system/http' -d '{"eventName":"http协议1","url":"wwww.baidu.com"，"type":"1"}'

Response:

{
    "code": 200,
    "result": {
        "_id": 1,
        "eventId": "事件编号",
        "eventName": "事件名",
        "url": "url",
        "eventType": "1",
        "status":"0关闭/1开启"
    }
}

```

### 5.Modify Http（修改协议)
#### Endpoint

put --  /api/system/event/{_id}


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| eventName | 事件名 | required | |
| url | 传输url | required | |
| type | 事件类型 1：结果上报 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/cameras/1' -d '{"camera_name":"滨江交警01"}'

Response:

{
    "code": 200,
    "result": {
        "_id": 1,
        "eventId": "事件编号",
        "eventName": "事件名",
        "url": "url",
        "eventType": "1",
        "status":"0关闭/1开启"
    }
}

```
### 6.Delete Http (删除协议)
#### Endpoint

delete -- /api/system/event/{id}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |

```
curl  -H "Content-type: application/json" -H "token:xxx" -X DELETE 'http://{ip}:{port}/api/system/http/1' -d

Response:

{
    "code": 200
}

```

### 7.Switch Http（传输协议开关)
#### Endpoint

put --  /api/system/event/switch/{id}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| status | 状态 0关闭/1开启  | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/system/switch/1' -d '{"status":'0'}'

Response:

{
    "code": 200,
    "result": {
      "_id": 1,
      "eventId": "事件编号",
      "eventName": "事件名",
      "url": "url",
      "eventType": "1",
      "status":"1"
  }
}


```