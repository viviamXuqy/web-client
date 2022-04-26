### 21.get Feature List
#### Endpoint

get -- /api/feature

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |

注意：1为升序；-1为降序

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/structs'
 
Response:
 {
     "code": 200,
     "result":
       {
          "_id" : 1,
            "carFeatures":[{_id:"",type:"1 车辆 ",markName:"英文标示",name:"中文名称"}.....],
            "personFeatures":[{_id:"",type:"2 人",markName:"英文标示",name:"中文名称"}.....],
            "total": 20 // 最多支持多少个结构化识别
        }
}
```