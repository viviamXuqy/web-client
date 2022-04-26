## 日志 Api

### 1.get log List （检索获取日志列表）

#### Endpoint

get -- /api/system/log


| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| page | 当前页  | optional | 1 |
| pageSize | 当前页数量 | optional | 10 |
| funType | [所有：不传，设备：1，任务：2，系统：3] | optional | |
| doType | [所有：不传，操作：1，报告：2，报错：3]  | optional | |
| begin | 起始时间, 精确到毫秒 | optional | |
| end | 结束时间, 精确到毫秒 | optional | |


#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/system/log'
 
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
			            "time": "1532341816221",
			            "funType": 1, // 设备：1，任务：2，系统：3
			            "doType": 1, // 操作：1，报告：2，报错：3
			            "content": "任务xxxx建立",
			            "recordId": "20180712030938580", // 记录ID，若funType为设备，则为设备ID；若为任务，则为任务ID；此记录ID用于查看跳转后的定向查询
			            "taskType": 1, // 若funType为任务时，此处任务类型为：1实时，2视频，3图集
                    },
                    ...
    	         ]
    }
}

```

### 2.delete log 删除日志，支持批量删除
#### Endpoint

delete -- /api/system/log/{ids}

| 名称 | 描述  | 是否必填 |默认值|
| --- | --- | --- | --- |
| token | header，用于权限验证 | required | |
| ids | 日志集ids | required | |

注意：1为升序；-1为降序

#### EXAMPLE

```
curl  -H "Content-type: application/json" -H "token:xxx" -X GET 'http://{ip}:{port}/api/system/log/{ids}'
 
Response:
 {
     "code": 200,
     "result": "success"
}
```
