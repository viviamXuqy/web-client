## 设备管理(IPC) Api

### 1.modify Camera（重命名摄像头）【后置1.】
#### Endpoint

put --  /api/camera/{_id}


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| cameraName | 摄像头名 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/cameras/1' -d '{"camera_name":"滨江交警01"}' 
 
Response:
 
{
    "code": 200,
    "result":{
            "_id": 1,
            "cameraName": "滨江摄像头1"
        }
}

```


### 2.recognition Camera（批量监控开关）
#### Endpoint

put --  /api/camera/state

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| states | [{"id": 1 , "state" : 0/1},..]  | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/cameraRec' -d '{"states":[{"_id": “摄像头id” , "state" : 0/1}..]}'

Response:

{
    "code": 200,
    "result": [
    		       {
                        "_id" : 1,
                        "state" : 0
                    },
                    ...
    	        ]

}

```

### 3.recognition Camera（获取到摄像头关联的任务）【后置3.】
#### Endpoint

put --  /api/camera/tasknum/{ids}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| ids | "xxxxxid1,xxxxid2,xxxxid3"  | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/camera/tasknum/{id}' -d '{"states":[{"_id": “摄像头id” , "state" : 0/1}..]}'

Response:

{
    "code": 200 成功,
    "result": 10(如果result 为 null 就没有任务)
}

```

### 4.add Camera（添加摄像头） (做完)
#### Endpoint

post -- /api/camera/page

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| bayonetId | 卡口ID | required | |
| name | 摄像头名 | required | |
| rtsp | RTSP | required | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/cameras' -d '{"bayonet_id":1,"name":“摄像头名称”,"ip":“127.0.0.1”,"rtsp":“rtsp://admin:rm123456@172.16.0.243”}' 
 
Response:

{
    "code": 200,
    "result": {
        "_id" : 1,
        "bayonetId": "中控卡口ID",
        "bayonetName": "卡口名字",
        "name": "滨江摄像头1",
        "deviceType": "设备类型",
        "ip": "127.0.0.1",
        "port": 8080,
        "state": 0,
        "area": [{"x": 1, "y": 12}, {"x": 30, "y": 50}],
        "ratio": "1080x720",
        "rtsp" : "rtsp://XX"
    }
}

```

### 5.Delete Camera （做完）
#### Endpoint

DELETE -- /api/camera/{id}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |

```
curl  -H "Content-type: application/json" -H "token:xxx" -X DELETE 'http://{ip}:{port}/api/cameras/1' -d
 
Response:
 
{
    "code": 200
}

```


### 5.preview Camera
#### Endpoint

GET -- /api/camera/preview/{id}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |

```
curl  -H "Content-type: application/json" -H "token:xxx" -X DELETE 'http://{ip}:{port}/api/cameras/1' -d
 
Response:
 
{
    "result" : base64
    "code": 200
}

```

### 6.get Camera List （做完）

#### Endpoint

get -- /api/camera


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| bayonetName | 卡口名字 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 10 |
| cameraNameOrder | 摄像头名称排序 | optional | 1 |
| deviceTypeOrder | 设备类型排序 | optional | 1 |
| ipOrder | 集成IP排序 | optional | -1 |
| portOrder | 端口排序 | optional | 1 |

注意：1为升序；-1为降序

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/cameras'
 
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
			      
			            "bayonetId": "中控卡口ID",
			            "bayonetName": "卡口名字",
			            "cameraName": "滨江摄像头1",
			            "deviceType": "设备类型",
			            "ip": "127.0.0.1",
			            "port": 8080,
			            "state": 0,
			            "area": [{"x": 1, "y": 12}, {"x": 30, "y": 50}],
			            "ratio": "1080x720",
			            "rtsp" : "rtsp://XX"
                    },
                    ...
    	         ]
    }
}

```

### 7.set CameraArea（摄像头区域设置） （做完）
#### Endpoint

put --  /api/cameraArea/{_id}


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| area | [{"x": 12 , "y" : 21}..] | required | |
| ratio | 分辨率 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/cameraArea/1' -d '{"area":[{"x": 12 , "y" : 21}..], "ratio", "1280x720"}' 
 
Response:
 
{
    "code": 200,
    "result": { //摄像头整个数据
            "_id": 1,
            "area": [{"x": 12 , "y" : 21}..],
            "ratio": "1280x720"
    }
}

```

### 8.flush Camera（批量刷新摄像头）【后置4.】
#### Endpoint

post -- /api/cameraFlush

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| file | 文件（表单） | required | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/cameras' -d '{"file":"Form表单"}' 
 
Response:
 
{
    "code": 200,
    "result": null
}

```

### get camera currentNum/totalNum （摄像头开启/总数）
#### Endpoint

get -- /api/camera/num


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/task/feature/num'

Response:

{
    "code": 200,
    "result": {
       "num" : 1,
       "total" : 20,
       }
}

```