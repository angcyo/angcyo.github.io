/**
 * 友盟统计相关api
 * https://developer.umeng.com/open-api/ns/com.umeng.uapp/apply
 * Email:angcyo@126.com
 * @author angcyo
 * @date 2023/06/06
 */

const host = "https://gateway.open.umeng.com/openapi"
//const startDate = '2022-07-01'
const androidAppKey = '62d6327c88ccdf4b7ed61eba'
const iOSAppKey = '62da45fb88ccdf4b7edbe912'
const nowDate = dayjs().format('YYYY-MM-DD')
const startDate = getQueryVariable("startDate") || dayjs().subtract(1, 'month').format('YYYY-MM-DD')
const min = parseInt(getQueryVariable("min") || "100")
const onlyAndroid = getQueryVariable("p") === "android" || getQueryVariable("p") === "a"
const onlyIOS = getQueryVariable("p") === "ios" || getQueryVariable("p") === "i"
const isOnly = onlyAndroid || onlyIOS

//一些过滤参数放这里
let lpUmengFilter = {
  "_ignoreEventList": "需要过滤的事件列表",
  "ignoreEventList": [
    "FAQ",
    "搜索设备",
    "连接设备",
    "雕刻",
    "预览",
    "打开创作",
    "用户注册",
    "异常"
  ],
  "_ignoreAppDeviceList": "需要过滤的手机设备列表",
  "ignoreAppDeviceList": [
    "samsung SM-T550",
    "Hisense HLTE200T"
  ],
  "_deviceMinCountThreshold": "机型数量小于100不统计",
  "deviceMinCountThreshold": 100,
  "_deviceVersionMinCountThreshold": "固件版本使用数量小于5000不统计",
  "deviceVersionMinCountThreshold": 5000,
  "_appVersionMinCountThreshold": "app版本使用数量小于1000不统计",
  "appVersionMinCountThreshold": 1000,
  "_appDeviceMinCountThreshold": "手机设备使用量小于5000不统计",
  "appDeviceMinCountThreshold": 5000,
  "_appFuncMinCountThreshold": "app功能使用量小于1000不统计",
  "appFuncMinCountThreshold": 10000
}

const cacheLpUmengFilter = localStorage.getItem("lpUmengFilter")
if (cacheLpUmengFilter) {
  lpUmengFilter = JSON.parse(cacheLpUmengFilter)
}

$.ajax({
  url: `https://laserpecker-prod.oss-cn-hongkong.aliyuncs.com/changelog/statistics/lp.umeng.filter.json?${$.now()}`,
  success: function (data) {
    lpUmengFilter = data
    localStorage.setItem("lpUmengFilter", JSON.stringify(data))
  }
})

function appKey(isAndroid) {
  if (onlyAndroid) {
    return androidAppKey
  } else if (onlyIOS) {
    return iOSAppKey
  }
  return isAndroid ? androidAppKey : iOSAppKey
}

/**签名*/
function signature(message) {
  let hash = CryptoJS.HmacSHA1(message, "OpXKOC9VxYx")
  let hex = CryptoJS.enc.Hex.stringify(hash)
  return hex.toUpperCase()
}

function getBody(path) {
  return `_aop_signature=${signature(path)}`
}

function getBody2(path, queryData) {
  const body = []
  const query = Object.keys(queryData).sort().map(key => {
    const value = queryData[key]
    body.push(`${key}=${value}`)
    return key + queryData[key]
  }).join('')
  body.push(`_aop_signature=${signature(path + query)}`)
  return body.join("&")
}

/**
 * 获取当前用户所有App昨日和今日的基础统计数据（活跃用户数，新增用户数，启动次数，总用户数）
 * https://developer.umeng.com/open-api/docs/com.umeng.uapp/umeng.uapp.getAllAppData/1
 *
 * */
function getAllAppData(action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.getAllAppData/6717434"
  const url = `${host}/${path}`
  const body = getBody(path)
  $.ajax({
    url: url,
    type: 'POST',
    data: body,
    success: function (data) {
      action(data)
    }
  })
}

//事件数量列表 key:事件名称 value:事件数量
let eventCountMap = {}

/**
 * 获取Android事件列表
 * */
function getAndroidEventList(action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.event.list/6717434"
  const url = `${host}/${path}`
  //console.log(dayjs().format('YYYY-MM-DD'))
  //console.log(dayjs().subtract(7, 'month').format('YYYY-MM-DD'))
  $.ajax({
    url: url,
    type: 'post',
    data: getBody2(path, {
      startDate: nowDate,
      endDate: nowDate,
      perPage: `100`,
      page: `1`,
      appkey: androidAppKey,
    }),
    success: function (data) {
      //action && action(data)
      if (data) {
        //data.eventInfo.forEach()
        for (const info of data.eventInfo) {
          if (lpUmengFilter.ignoreEventList.includes(info.displayName)) {
            //忽略
          } else {
            getEventCount(info.name, true, count => {
                //过滤
                if (info.displayName && count > lpUmengFilter.appFuncMinCountThreshold) {
                  eventCountMap[info.displayName] = count

                  //排序
                  eventCountMap = Object.fromEntries(
                    Object.entries(eventCountMap).sort(([, a], [, b]) => b - a)
                  )
                  action()
                }
              }
            )
          }
        }
      }
    }
  })
}

/**获取指定事件一段时间内的统计次数*/
function getEventCount(eventName, isAndroid, action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.event.getData/6717434"
  const url = `${host}/${path}`
  let androidCount = 0

  const cacheKey = `${appKey(isAndroid)}_${eventName}_${startDate}_${nowDate}`
  const cacheValue = localStorage.getItem(cacheKey)
  if (cacheValue) {
    androidCount = parseInt(cacheValue)

    if (isAndroid && !isOnly) {
      getEventCount(eventName, false, (iOSCount) => {
        action && action(androidCount + iOSCount)
      })
    } else {
      action && action(androidCount)
    }
    return
  }

  $.ajax({
    url: url,
    type: 'post',
    data: getBody2(path, {
      startDate: startDate,
      endDate: nowDate,
      eventName: eventName,
      appkey: appKey(isAndroid),
    }),
    success: function (data) {
      //回调事件次数
      if (data) {
        const count = data.eventData[0].data.reduce((a, b) => a + b, 0)
        androidCount += count
        localStorage.setItem(cacheKey, count)
      }
      if (isAndroid && !isOnly) {
        getEventCount(eventName, false, (iOSCount) => {
          action && action(androidCount + iOSCount)
        })
      } else {
        action && action(androidCount)
      }
    }
  })
}

/**获取指定事件中指定key的一段时间内的统计次数*/
function getEventParamCount(eventName, eventParamName, isAndroid, action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.event.param.getValueList/6717434"
  const url = `${host}/${path}`
  let androidCount = 0

  const cacheKey = `${appKey(isAndroid)}_${eventName}_${eventParamName}_${startDate}_${nowDate}`
  const cacheValue = localStorage.getItem(cacheKey)
  if (cacheValue) {
    androidCount = parseInt(cacheValue)

    if (isAndroid && !isOnly) {
      getEventParamCount(eventName, eventParamName, false, (iOSCount) => {
        action && action(androidCount + iOSCount)
      })
    } else {
      action && action(androidCount)
    }
    return
  }

  $.ajax({
    url: url,
    type: 'post',
    data: getBody2(path, {
      startDate: startDate,
      endDate: nowDate,
      eventName: eventName,
      eventParamName: eventParamName,
      appkey: appKey(isAndroid),
    }),
    success: function (data) {
      if (data) {
        let count = 0
        for (const info of data.paramInfos) {
          count += (info.count || 0)
        }
        androidCount += count
      }
      if (isAndroid && !isOnly) {
        getEventParamCount(eventName, eventParamName, false, (iOSCount) => {
          action && action(androidCount + iOSCount)
        })
      } else {
        action && action(androidCount)
      }
    }
  })
}

/**获取指定事件的参数一段时间内的统计次数*/
function getPhoneDeviceCountMap(map, eventName, eventParamName, isAndroid, action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.event.param.getValueList/6717434"
  const url = `${host}/${path}`

  const cacheKey = `${appKey(isAndroid)}_${eventName}_${eventParamName}_${startDate}_${nowDate}`
  const cacheValue = localStorage.getItem(cacheKey)

  if (cacheValue) {
    const cacheMap = JSON.parse(cacheValue)
    for (const key in cacheMap) {
      if (Object.hasOwnProperty.call(cacheMap, key)) {
        map[key] = (map[key] || 0) + cacheMap[key]
      }
    }

    if (isAndroid && !isOnly) {
      getPhoneDeviceCountMap(map, eventName, eventParamName, false, () => {
        action && action()
      })
    }
    action && action()
    return
  }

  $.ajax({
    url: url,
    type: 'post',
    data: getBody2(path, {
      startDate: startDate,
      endDate: nowDate,
      eventName: eventName,
      eventParamName: eventParamName,
      appkey: appKey(isAndroid),
    }),
    success: function (data) {
      if (data) {
        const mapValue = {}
        for (const info of data.paramInfos) {
          let key = info.name
          if (key) {
            key = decodeURI(key).replaceAll("+", " ")
            const count = (map[key] || 0) + info.count
            if ((isAndroid && count > min) || count > min * 10 || (isOnly && count > min)) {
              mapValue[key] = info.count
              map[key] = count
            }
          }
        }
        localStorage.setItem(cacheKey, JSON.stringify(mapValue))
      }
      if (isAndroid && !isOnly) {
        getPhoneDeviceCountMap(map, eventName, eventParamName, false, () => {
          action && action()
        })
      }
      action && action()
    }
  })
}

/**获取手机设备使用统计*/
function getPhoneStatistics(action) {
  let map = {}
  getPhoneDeviceCountMap(map, "search_device", "key_phone_device", true, () => {
    //排序
    const resultMap = Object.fromEntries(
      Object.entries(map).sort(([, a], [, b]) => b - a)
    )
    for (const key in resultMap) {
      if (resultMap[key] < lpUmengFilter.appDeviceMinCountThreshold ||
        (lpUmengFilter.ignoreAppDeviceList && lpUmengFilter.ignoreAppDeviceList.includes(key))) {
        delete resultMap[key]
      }
    }
    action && action(resultMap)
  })
}

/**手机语言统计*/
function getPhoneLanguageCountMap(map, eventName, eventParamName, isAndroid, action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.event.param.getValueList/6717434"
  const url = `${host}/${path}`

  const cacheKey = `${appKey(isAndroid)}_${eventName}_${eventParamName}_${startDate}_${nowDate}`
  const cacheValue = localStorage.getItem(cacheKey)

  if (cacheValue) {
    const cacheMap = JSON.parse(cacheValue)
    for (const key in cacheMap) {
      if (Object.hasOwnProperty.call(cacheMap, key)) {
        map[key] = (map[key] || 0) + cacheMap[key]
      }
    }

    if (isAndroid && !isOnly) {
      getPhoneLanguageCountMap(map, eventName, eventParamName, false, () => {
        action && action()
      })
    }
    action && action()
    return
  }

  $.ajax({
    url: url,
    type: 'post',
    data: getBody2(path, {
      startDate: startDate,
      endDate: nowDate,
      eventName: eventName,
      eventParamName: eventParamName,
      appkey: appKey(isAndroid),
    }),
    success: function (data) {
      if (data) {
        const mapValue = {}
        for (const info of data.paramInfos) {
          let key = info.name
          if (key) {
            key = key.toLowerCase() //小写
            if (key.startsWith('zh-hant')) {
              //繁体
              key = "繁体"
            } else if (key.startsWith('zh')) {
              key = "中文"
            } else if (key.startsWith('en')) {
              key = "英语"
            } else if (key.startsWith('ja')) {
              key = "日语"
            } else if (key.startsWith('ko')) {
              key = "韩语"
            } else if (key.startsWith('fr')) {
              key = "法语"
            } else if (key.startsWith('de')) {
              key = "德语"
            } else if (key.startsWith('es')) {
              key = "西班牙语"
            } else {
              key = "其他"
            }

            const count = (map[key] || 0) + info.count
            if (isAndroid || count > min) {
              mapValue[key] = (mapValue[key] || 0) + info.count
              map[key] = count
            }
          }
        }
        localStorage.setItem(cacheKey, JSON.stringify(mapValue))
      }
      if (isAndroid && !isOnly) {
        getPhoneLanguageCountMap(map, eventName, eventParamName, false, () => {
          action && action()
        })
      }
      action && action()
    }
  })
}

/**获取手机语言使用统计*/
function getPhoneLanguageStatistics(action) {
  let map = {}
  getPhoneLanguageCountMap(map, "search_device", "key_phone_language", true, () => {
    //排序
    action && action(Object.fromEntries(
      Object.entries(map).sort(([, a], [, b]) => b - a)
    ))
  })
}

function getDeviceCountMap(map, eventName, eventParamName, isAndroid, action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.event.param.getValueList/6717434"
  const url = `${host}/${path}`

  const cacheKey = `${appKey(isAndroid)}_${eventName}_${eventParamName}_${startDate}_${nowDate}`
  const cacheValue = localStorage.getItem(cacheKey)

  if (cacheValue) {
    const cacheMap = JSON.parse(cacheValue)
    for (const key in cacheMap) {
      if (Object.hasOwnProperty.call(cacheMap, key)) {
        map[key] = (map[key] || 0) + cacheMap[key]
      }
    }

    if (isAndroid && !isOnly) {
      getDeviceCountMap(map, eventName, eventParamName, false, () => {
        action && action()
      })
    }
    action && action()
    return
  }

  $.ajax({
    url: url,
    type: 'post',
    data: getBody2(path, {
      startDate: startDate,
      endDate: nowDate,
      eventName: eventName,
      eventParamName: eventParamName,
      appkey: appKey(isAndroid),
    }),
    success: function (data) {
      if (data) {
        const mapValue = {}
        for (const info of data.paramInfos) {
          let key = info.name
          if (key) {
            key = key.replaceAll("LaserPecker-CI", "LX1-")
              .replaceAll("LaserPecker-LX1", "LX1-")
              .replaceAll("LaserPecker", "LP")
              .replaceAll("-IV", "4-")
              .replaceAll("-III", "3-")
              .replaceAll("-II", "2-")
              .replaceAll("-I", "1-")
            key = key.split("-")[0]
            map[key] = (map[key] || 0) + info.count
            mapValue[key] = (mapValue[key] || 0) + info.count
          }
        }
        localStorage.setItem(cacheKey, JSON.stringify(mapValue))
      }
      if (isAndroid && !isOnly) {
        getDeviceCountMap(map, eventName, eventParamName, false, () => {
          action && action()
        })
      }
      action && action()
    }
  })
}

/**获取设备名称统计*/
function getDeviceStatistics(action) {
  let map = {}
  getDeviceCountMap(map, "connect_device", "key_device_name", true, () => {
    //排序
    const resultMap = Object.fromEntries(
      Object.entries(map).sort(([, a], [, b]) => b - a)
    )
    for (const key in resultMap) {
      if (resultMap[key] < lpUmengFilter.deviceMinCountThreshold || !key.toUpperCase().startsWith("L")) {
        delete resultMap[key]
      }
    }
    action && action(resultMap)
  })
}

function getDeviceVersionCountMap(map, eventName, eventParamName, isAndroid, action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.event.param.getValueList/6717434"
  const url = `${host}/${path}`

  const cacheKey = `${appKey(isAndroid)}_${eventName}_${eventParamName}_${startDate}_${nowDate}`
  const cacheValue = localStorage.getItem(cacheKey)

  if (cacheValue) {
    const cacheMap = JSON.parse(cacheValue)
    for (const key in cacheMap) {
      if (Object.hasOwnProperty.call(cacheMap, key)) {
        map[key] = (map[key] || 0) + cacheMap[key]
      }
    }

    if (isAndroid && !isOnly) {
      getDeviceVersionCountMap(map, eventName, eventParamName, false, () => {
        action && action()
      })
    }
    action && action()
    return
  }

  $.ajax({
    url: url,
    type: 'post',
    data: getBody2(path, {
      startDate: startDate,
      endDate: nowDate,
      eventName: eventName,
      eventParamName: eventParamName,
      appkey: appKey(isAndroid),
    }),
    success: function (data) {
      if (data) {
        const mapValue = {}
        for (const info of data.paramInfos) {
          let key = info.name
          if (key) {
            key = key.replaceAll(".", "")
          }
          if (key && parseInt(key) > 0) {
            key = " " + key
            map[key] = (map[key] || 0) + info.count
            mapValue[key] = info.count
          }
        }
        localStorage.setItem(cacheKey, JSON.stringify(mapValue))
      }
      if (isAndroid && !isOnly) {
        getDeviceVersionCountMap(map, eventName, eventParamName, false, () => {
          action && action()
        })
      }
      action && action()
    }
  })
}

/**获取设备固件版本统计*/
function getDeviceVersionStatistics(action) {
  let map = {}
  getDeviceVersionCountMap(map, "connect_device", "key_device_version", true, () => {
    //排序
    const resultMap = Object.fromEntries(
      Object.entries(map).sort(([, a], [, b]) => b - a)
    )
    for (const key in resultMap) {
      if (resultMap[key] < lpUmengFilter.deviceVersionMinCountThreshold) {
        delete resultMap[key]
      }
    }
    action && action(resultMap)
  })
}

function getConnectDurationCountMap(map, eventName, eventParamName, isAndroid, action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.event.param.getValueList/6717434"
  const url = `${host}/${path}`

  const cacheKey = `${appKey(isAndroid)}_${eventName}_${eventParamName}_${startDate}_${nowDate}`
  const cacheValue = localStorage.getItem(cacheKey)

  if (cacheValue) {
    const cacheMap = JSON.parse(cacheValue)
    for (const key in cacheMap) {
      if (Object.hasOwnProperty.call(cacheMap, key)) {
        map[key] = (map[key] || 0) + cacheMap[key]
      }
    }

    if (isAndroid && !isOnly) {
      getConnectDurationCountMap(map, eventName, eventParamName, false, () => {
        action && action()
      })
    }
    action && action()
    return
  }

  $.ajax({
    url: url,
    type: 'post',
    data: getBody2(path, {
      startDate: startDate,
      endDate: nowDate,
      eventName: eventName,
      eventParamName: eventParamName,
      appkey: appKey(isAndroid),
    }),
    success: function (data) {
      if (data) {
        const mapValue = {}
        for (const info of data.paramInfos) {
          let key = info.name
          if (key && parseInt(key) > 100 && info.count > 10) {
            let keyInt = parseInt(key)
            if (keyInt < 200) {
              key = `~200`
            } else if (keyInt < 400) {
              key = `200~400`
            } else if (keyInt < 600) {
              key = `400~600`
            } else if (keyInt < 800) {
              key = `600~800`
            } else if (keyInt < 1000) {
              key = `800~1000`
            } else if (keyInt < 1200) {
              key = `1000~1200`
            } else if (keyInt < 1400) {
              key = `1200~1400`
            } else if (keyInt < 1600) {
              key = `1400~1600`
            } else if (keyInt < 1800) {
              key = `1600~1800`
            } else if (keyInt < 2000) {
              key = `1800~2000`
            } else {
              key = `2000~`
            }
            map[key] = (map[key] || 0) + info.count
            mapValue[key] = (mapValue[key] || 0) + info.count
          }
        }
        localStorage.setItem(cacheKey, JSON.stringify(mapValue))
      }
      if (isAndroid && !isOnly) {
        getConnectDurationCountMap(map, eventName, eventParamName, false, () => {
          action && action()
        })
      }
      action && action()
    }
  })
}

/**获取设备连接时长统计*/
function getConnectDurationStatistics(action) {
  let map = {}
  getConnectDurationCountMap(map, "connect_device", "key_duration", true, () => {
    //排序
    const resultMap = Object.fromEntries(
      Object.entries(map).sort(([, a], [, b]) => b - a)
    )
    for (const key in resultMap) {
      if (resultMap[key] < (min / 10)) {
        delete resultMap[key]
      }
    }
    action && action(resultMap)
  })
}

/**App异常统计*/
function getAppErrorStatistics(action) {
  let map = {}
  getEventParamCount("app_error", "key_code", true, (count) => {
    map["验证码"] = count

    getEventParamCount("app_error", "key_no_device", true, (count) => {
      map["未搜索到设备"] = count

      getEventParamCount("app_error", "key_command", true, (count) => {
        map["通信异常"] = count

        getEventParamCount("app_error", "key_transfer", true, (count) => {
          map["数据传输"] = count

          //排序
          const resultMap = Object.fromEntries(
            Object.entries(map).sort(([, a], [, b]) => b - a)
          )
          action && action(resultMap)
        })
      })
    })
  })
}


function getEngraveDurationCountMap(map, eventName, eventParamName, isAndroid, action) {
  const path = "param2/1/com.umeng.uapp/umeng.uapp.event.param.getValueList/6717434"
  const url = `${host}/${path}`

  const cacheKey = `${appKey(isAndroid)}_${eventName}_${eventParamName}_${startDate}_${nowDate}`
  const cacheValue = localStorage.getItem(cacheKey)

  if (cacheValue) {
    const cacheMap = JSON.parse(cacheValue)
    for (const key in cacheMap) {
      if (Object.hasOwnProperty.call(cacheMap, key)) {
        map[key] = (map[key] || 0) + cacheMap[key]
      }
    }

    if (isAndroid && !isOnly) {
      getEngraveDurationCountMap(map, eventName, eventParamName, false, () => {
        action && action()
      })
    }
    action && action()
    return
  }

  $.ajax({
    url: url,
    type: 'post',
    data: getBody2(path, {
      startDate: startDate,
      endDate: nowDate,
      eventName: eventName,
      eventParamName: eventParamName,
      appkey: appKey(isAndroid),
    }),
    success: function (data) {
      if (data) {
        const mapValue = {}
        for (const info of data.paramInfos) {
          let key = info.name
          if (key) {
            let keyInt = parseInt(key)
            if (keyInt < 1000) {
              key = `~1s`
            } else if (keyInt < 3000) {
              key = `1s~3s`
            } else if (keyInt < 10000) {
              key = `3s~10s`
            } else if (keyInt < 30000) {
              key = `10s~30s`
            } else if (keyInt < 60 * 1000) {
              key = `30s~1m`
            } else if (keyInt < 5 * 60 * 1000) {
              key = `1m~5m`
            } else if (keyInt < 10 * 60 * 1000) {
              key = `5m~10m`
            } else if (keyInt < 30 * 60 * 1000) {
              key = `10m~30m`
            } else if (keyInt < 60 * 60 * 1000) {
              key = `30m~1h`
            } else {
              key = `1h~`
            }
            map[key] = (map[key] || 0) + info.count
            mapValue[key] = (mapValue[key] || 0) + info.count
          }
        }
        localStorage.setItem(cacheKey, JSON.stringify(mapValue))
      }
      if (isAndroid && !isOnly) {
        getEngraveDurationCountMap(map, eventName, eventParamName, false, () => {
          action && action()
        })
      }
      action && action()
    }
  })
}

/**设备雕刻耗时统计*/
function getEngraveDurationStatistics(action) {
  let map = {}
  getEngraveDurationCountMap(map, "engrave", "key_duration", true, () => {
    //排序
    const resultMap = Object.fromEntries(
      Object.entries(map).sort(([, a], [, b]) => b - a)
    )
    for (const key in resultMap) {
      if (resultMap[key] < (min / 10)) {
        delete resultMap[key]
      }
    }
    action && action(resultMap)
  })
}
