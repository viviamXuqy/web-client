## 卡口 Api

### 9.get bayonet list
#### Endpoint

get -- /api/bayonet  （做完）


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 10 |
| search | 关键字 | optional | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/bayonets'
 
Response:
  {
         "code": 200,
         "result": {
           "page" : 1,
           "pageSize" : 10, 
           "total" : 20,
           "data" : [
                        {
                            "_id" : 1,
                            "name"  : "卡口名称", 
                        },
                        ...
                     ]
    }
}

```

### 10.get bayonetCameras list（卡口下摄像头列表）
#### Endpoint

get -- /api/camera/bcpage/{id} （做完）


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 10 |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/bayonetCameras/1'
 
Response:
 {
        "code": 200,
        "result": {
           "page" : 1,
           "pageSize" : 10, 
           "total" : 20,
           "data" : [
                        {
                            "_id":id,
                            "name" : "摄像头名字",
                            "ip" : "127.0.0.1",
                            "rtsp"  : "rtsp://xx"  
                        },
                        ...
                     ]
        
    }
}
```

### 11.add Bayonet（添加卡口）
#### Endpoint

post -- /api/bayonet

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| bayonetId | 卡口ID（中控） | required | |
| name | 卡口名 | required | |
| deviceType | 设备类型：1海康摄像头；2大华摄像头 | required | |
| ip | 卡口IP地址 | required | |
| account | 摄像头账户名 | required | |
| pwd | 摄像头账户密码 | required | |
| port | 设备端口 | required | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/bayonets' -d '{"bayonet_id":1,"bayonet_name":“卡口名”,"device_type":1,"bayonet_ip":“172.16.0.243”,"camera_ account":“摄像头账户名”,"camera_pwd":“摄像头账户密码”,"port":“设备端口”}' 
 
Response:
 
{
    "code": 200,
    "result": {
        "data": {
            "_id" : 1,
            "bayonetId": "中控卡口ID",
            "name": "卡口名字",
            "deviceType": "设备类型",
            "ip": "127.0.0.1",
            "account": “摄像头账户名”,
            "pwd": “摄像头账户密码”,
            "port": 8080
        }
    }
}

```

### 12.modify Bayonets（重命名卡口）【后置5.】
#### Endpoint

put --  /api/bayonet/{_id}


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| bayonetName | 卡口名 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/bayonets/1' -d '{"bayonet_name":"卡口名"}' 
 
Response:
 
{
    "code": 200,
    "result": {
            "_id": 1,
            "bayonetName": "卡口名"
    }
}

```