## 结构化任务 Api

### 17.recognition Task（监控开关）【后置10.】
#### Endpoint

put --  /api/taskRec/{_id}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| state | 状态 0关闭/1开启  | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/taskRec/1' -d '{"state":0}' 
 
Response:
 
{
    "code": 200
}

```

### 18.add Task（添加任务，支持批量添加）
#### Endpoint

post -- /api/task

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
[{}{}]
| bayonetId | 卡口ID（中控) | required | |
| bayonetName | 卡口名字 | required | |
| cameraName | 摄像头名称 | required | |
| name | 任务名称 | required | |
| type | 任务类型（1实时，2视频，3图集） | required | |
| cameraId | 设备ID | required | |
| timeType | 时间类型（1永续；2每日；3日期时间段） | required | |
| duration | 时间组 "开始时间,结束时间" | required | |
| deviceType | 设备类型：1海康摄像头；2大华摄像头 | required | |
| carFeatures | 车辆特征选择组[] | required | |
| personFeatures | 人特征选择组 | required | |

duration: [{type: 1, startTime: xxx, endTime: xxx} ...]


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X POST 'http://{ip}:{port}/api/task' -d '{"bayonet_id":“111”,"bayonet_name":“卡口名字”，"camera_name":“摄像头名称s”，"task_name":“任务名称“，"task_type":“任务类型”，"tcamera_ids":“设备ID“，"time_type":“时间类型”,"time_arr":“starttime,endtime”,"device_type":1,"car_structs":["plate","..."],"person_structs":["face","..."]}' 
 
Response:
 
{
  "code": 200
}

```

### 19.Delete Task
#### Endpoint

DELETE -- /api/task

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| ids | [1,2,3] | required | |

```
curl  -H "Content-type: application/json" -H "token:xxx" -X DELETE 'http://{ip}:{port}/api/tasks/1' -d
 
Response:
{
      "code": 200
}

```

### start/close Task（任务开启/关闭） （做完）

#### Endpoint

put --  /api/task/setStatus/{_id}


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| status | 0关闭/1开启 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/cameraArea/1' -d '{"area":[{"x": 12 , "y" : 21}..], "ratio", "1280x720"}' 
 
Response:
 
{
    "code": 200,
    "result": {
                        "id" : 1,
			            "name":“任务名称“，
			            "type":“任务类型”，
			            "bayonetId":1,
                        "bayonetName":“卡口名字”，
                        "cameraId":“设备ID“，
                        "cameraName":“摄像头名称”，
                        "name":“任务名称“，
                        "type":“任务类型”，
                        "duration":“[,]”,
                        "deviceType":1,
			            "status":"0.关闭 1.开启 2.暂停",
			            "resourceName":"数据源"
			            "progress":"10/100" (-1等待开始，-2错误，100完成),
			            "current":"1"（当前完成到哪一个）,
			            "total":"9"（总数量）,
			            "autoInc": 结果数量,
			            "analysisList":[],			         
			            "carFeatures":"["f-id","..."]",
			            "personFeatures":"["f-id","..."]"
                   }
}

```

### start/stop/close Task（批量任务开启/暂停/关闭）

#### Endpoint

put --  /api/task/setStatus


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| status | [{id:xx, state: 0关闭/1开启/2暂停}...] | required | |
| type | 1,2,3 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/setStatus/1' -d '' 
 
Response:
 
{
    "code": 200,
    "result": "success"
}

```

### delete task all 清空任务
#### Endpoint

delete -- /api/task/all/{type}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| type | 1,2,3 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/task/all/1'
 
Response:
 {
     "code": 200,
     "result": "success"
}
```

### 7.set Task（任务设置） （做完）
#### Endpoint

put --  /api/task/set/{_id}

| 名称 | 描述  | 是否必填 |默认值|
| --- | ---  | ---     | --- |
| token | header，用于权限验证 | required | |
| duration | "starttime,endtime" | required | |
| timeType | 时间类型（1永续；2每日；3日期时间段） | required | |
| carFeatures | 车辆特征选择组【特征ID组】 | required | |
| personFeatures | 人特征选择组【特征ID组】 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X PUT 'http://{ip}:{port}/api/cameraArea/1' -d '{"area":[{"x": 12 , "y" : 21}..], "ratio", "1280x720"}' 

Response:
 
{
    "code": 200,
    "result":
}

```

### 20.get Task List
#### Endpoint

get -- /api/task

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 10 |

注意：1为升序；-1为降序

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/tasks'

Response:
 
{
    "code": 200,
    "result":{
       "page" : 1,
       "pageSize" : 10, 
       "total" : 20,
       "data" : [
    		       {
                      "_id" : 1,
                        "bayonetId":1,
			            "bayonetName":“卡口名字”，
			            "cameraName":“摄像头名称”，
			            "name":“任务名称“，
			            "type":“任务类型”，//1实时，2视频，3图集）
			            "cameraId":“设备ID“，
			            "timeType":“时间类型”,//1永续；2每日；3日期时间段）
			            "duration":[{ date: '20180503', startTime: '17:00', endTime: '18:00' }, { date: '2018/05/13', startTime: '07:00', endTime: '08:00' }, { date: '2018/05/23', startTime: '17:17', endTime: '18:18' }],,
                        "deviceType":1,//设备类型：1海康摄像头；2大华摄像头
			            "status":"开启/关闭",//0关闭/1开启
			            "cunum":"90",
			            "totalNum":"100",
			            "carFeatures":"["f-id","..."]",
			            "personFeatures":"["f-id","..."]"
                        "area": [{"x": 1, "y": 12}, {"x": 30, "y": 50}],//新增
			            "ratio": "1080x720",//新增
                   },
                   ...
    	         ]
    }
}
```

### get task total result list 
#### Endpoint

get -- /api/task/result


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 10 |
| search | 关键字 | optional | |
| begin | 起始时间, 精确到毫秒 | optional | |
| end | 结束时间, 精确到毫秒 | optional | |
| type | 任务类型 | optional | 1 |
| struct | 结构化检索 "关键词1，关键词2，关键词3........" | optional | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/task/result'

Response:

{
    "code": 200,
    "result": {
       "page" : 1,
       "pageSize" : 10,
       "total" : 20,
       "data" : [
    		       	{
                        "id" : 1, // 任务ID
					    "name":“任务名称“，
			            "total": 121,
                        "endTime": 1529355966000,
                        "task":"任务类型（1.实时 , 2.视频 , 3.图集）",
                        "resultId":"201807161226132217435", //任务里最后一个结果的图片，这里是结果ID与结果列表一样即可
	                },
	                ...
    	         ]
}

```

### delete taskresult 删除任务总结果
#### Endpoint

delete -- /api/task/result/{ids}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| ids | 结果集id | required | |

注意：1为升序；-1为降序

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/task/result/{ids}'
 
Response:
 {
     "code": 200,
     "result": "success"
}
```

### get task currentNum/totalNum （实时）
#### Endpoint

get -- /api/task/num


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/task/num'

Response:

{
    "code": 200,
    "result": {
       "num" : 1,
       "total" : 20,
       }
}

```

## 65.[获取进行中的任务列表]
#### Endpoint

get -- /api/task/activeTask

| 名称 | 描述 | 是否必填 | 默认值 |
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/task/activeTask'

Response:

{
    "code": 200,
    "result": [
                {
                    "originalTaskId":""
                    "originalTaskName":""
                }
                ...
              ]
}

```