## login Api
### 24.login
#### Endpoint

post -- /api/login

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| username | 用户名| required | |
| password | 密码 | required | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/user/login' -d '{"username":"asd","password":""}' 
 
Response:
 
{
    "code": 200,
    "result": {
        "token" : "xxx",
    }
}

```

## UserInfo Api
#### Endpoint

post -- /api/user/info

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/user/login' -d '{"username":"asd","password":""}' 
 
Response:

{
    "code": 200,
    "result":{
        "_id" : 1,
        "username"  : "xxx"
    }
}

```