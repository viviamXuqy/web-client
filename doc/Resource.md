## get resource folder Api
#### Endpoint

get -- /api/resource/page

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 10 |
| search | 关键字 | optional | |
| type | 0.所有资源 1.视频资源 2.图片资源 | optional | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/resource/page' -d '{"search":"asd", "page":"1","pageSize":"10"}' 
 
Response:

{
    "code": 200,
    "result":[{
        "id" : 1,
        "name"  : "xxx"
        "path"  : "xxx"
    } ..... 
    ]
}

```

## get folder tree api
#### Endpoint

get -- /api/resource/tree/{id}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| id | resource file id  | required | 1 |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/resource/tree/{id}'' 
 
Response:

{
    "code": 200,
    "result":{
        "path" : 1,
        "name"  : "xxx",
        "children" : [
             {
                "key": 1, // uuid
                "name"  : "xxx",
                "path"  : "",
                "children" : [....]
            }
            ....
        ]
    }
}

```

## get resource folder child file Api
#### Endpoint

post -- /api/resource/tree/file/{path}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| path | 当前页  | required | 1 |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/resource/tree/file/{path}' 
 
Response:

{
    "code": 200,
    "result":[{
        "id" : 1,
        "name"  : "xxx",
        "path" : "/xx/xx.png"
    } ..... 
    ]
}

```

### upload 上传图片/上传视频，（支持压缩包上传）
#### Endpoint

post -- /api/file/upload

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| formData | 表单数据（file） | required | |
| path | 文件夹路径（file） | required | |
| type | 任务类型 | optional | 1/2/3 |

##### 注意：该path是触发这个post -- /api/resource/tree/file/{path}接口时的path
#####      返回200后再次刷新post -- /api/resource/tree/file/{path}接口

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/file/upload' -d 
 
Response:
 
{
  "code": 200,
  "result": null
}

```