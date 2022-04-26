## 识别结果列表 Api

### 21.delete result
#### Endpoint

delete -- /api/result/{ids}/{taskId}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| ids | 结果集id | required | 传a代表没有这个条件 |
| taskId | 任务id | required | 传a代表没有这个条件 |

注意：1为升序；-1为降序

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/structs'
 
Response:
 {
     "code": 200,
     "result": ""
}
```

### delete result all 清空结果
#### Endpoint

delete -- /api/result/all

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/result/all'
 
Response:
 {
     "code": 200,
     "result": "success"
}
```

### 22.get results list
#### Endpoint

get -- /api/result


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 10 |
| search | 关键字 | optional | |
| begin | 起始时间, 精确到毫秒 | optional | |
| end | 结束时间, 精确到毫秒 | optional | |
| taskBeginId | 任务开始ID | optional | |
| taskEndId | 任务结束ID | optional | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/results'
 
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
                        "taskId"  : "任务ID",
                        "time":"20180810",
                        "taskType":"任务类型（1.实时 , 2.视频 , 3.图集）",
                        "img":"http://",
                        "targetType":"1 车辆 /  2 人",
	                },
	                ...
    	         ]
}

```

### 23.get result（识别结果详情）
#### Endpoint

get -- /api/result/{_id}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/results/1'

Response:
{
    "code": 200,
    "result":[{
        "_id" : 1,
        "taskId"  : "任务ID",
        "time":"20180810",
        "taskType":"实时监控",
        "img":"http://",
        "targetType":"汽车",
        "taskName":"任务1",
        "addr":"地址",
        "carFeatures":[
                            {
                            "brand" :      //车品牌，车品牌可能被识别成多种
                                [
                                "客车-金旅",
                                "克莱斯勒-大捷龙(进口)",
                                "货车-北奔",
                                "红旗-H7",
                                "宾利-添越"
                                ],
                            "brandrate" : //车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
                                [
                                10.31,
                                4.57,
                                3.92,
                                3.70,
                                3.43
                                ],
                            "cararea" : //车位置
                                [
                                9,
                                4,
                                611,
                                364
                                ],
                            "carrate" : 89.07,  //车被检测到的概率
                            "plate" : "浙A12345", //车牌号码
                            "platearea" :  //车牌位置
                                [
                                190,
                                225,
                                263,
                                58
                                ],
                            "platerate" : 91.18, //车牌被检测到的概率
                            "type" : "car" //车类型，目前支持 car, bus, truck, motorbike
                            }
                        ],
        "personFeatures":"",
        "ratio": '800x700',
    },
    ...
    ]
}

```

### upload Feature 上传图片来进行结构化检索
#### Endpoint

post -- /api/result/upload/feature

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| file | 表单数据（file） | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/file/upload/feature' -d

Response:

{
  "code": 200,
  "result": [
	  				{
	  					_id:"",
	  					type:"1 车辆 /2 人",
	  					markName:"英文标示",
	  					name:"中文名称"
					}
					...
  				]
}

```