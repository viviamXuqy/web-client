## 设备管理（NVR） Api 【后置】

### 13.get bayonet list【后置6.】
#### Endpoint

get -- /api/nvr


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 10 |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/nvrs'
 
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
                        "nvr_name"  : "NVR名称", 
                        “port”: 8080,
                        "nvr_ip": "127.0.0.1",
                        "use_disk_size": "容量使用",
                        "tatol_disk_size": "总容量"
	                },
	                ...
    	         ]
    }
}

```

### 14.add NVR（添加NVR）【后置7.】
#### Endpoint

post -- /api/nvr

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| nvr_name | NVR名称 | required | |
| port | 端口 | required | |
| ip | nvrIP | required | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/nvrs' -d '{"nvr_name":“NVR名称”,"port":8080,"ip":“172.16.0.243”}' 
 
Response:
 
{
    "code": 200,
    "result": {
            "_id" : 1,
            "nvr_name"  : "NVR名称", 
            “port”: 8080,
            "nvr_ip": "127.0.0.1",
            "use_disk_size": "容量使用",
            "tatol_disk_size": "总容量"
        }
    
}

```

### 15.modify nvrs（修改nvr）【后置8.】
#### Endpoint

put --  /api/nvr/{_id}


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| nvr_name | NVR名称 | required | |
| port | 端口 | required | |
| ip | nvrIP | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/nvrs/1' -d '{"nvr_name":“NVR名称”,"port":8080,"ip":“172.16.0.243”}' 
 
Response:
 
{
    "code": 200,
    "result": {
            "_id" : 1,
            "nvr_name"  : "NVR名称", 
            “port”: 8080,
            "nvr_ip": "127.0.0.1",
            "use_disk_size": "容量使用",
            "tatol_disk_size": "总容量"
        }
}

```

### 16.Delete NVR【后置9.】
#### Endpoint

DELETE -- /api/nvr

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| ids | [1,2,3] | required | |

```
curl  -H "Content-type: application/json" -H "token:xxx" -X DELETE 'http://{ip}:{port}/api/nvrs' -d
 
Response:
 
{
    "code": 200,
    "result": {
        "data": "success"
    }
}

```