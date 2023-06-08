import { STATE } from '@/ktJS/STATE'

// 人员预警列表 模拟 0 - 10 条
const getRyyjList = []
for (let i = 0; i < Math.random() * 10; i++) {
  getRyyjList.push({
    workLocation: STATE.locationPositionPointsArr[Math.floor(Math.random() * STATE.locationPositionPointsArr.length)].name,
    belongTeam: `${Math.floor(Math.random() * 5) + 1}#煤层`,
    warnDescribe: Math.random() > 0.7 ? '此区域有重点监管作业人员，请及时处理！' : '(无更多信息)'
  })
}

// 区域预警列表 模拟 0 - 10 条
const getQyyjList = []
for (let i = 0; i < Math.random() * 10; i++) {
  getQyyjList.push({
    warnLocation: STATE.locationPositionPointsArr[Math.floor(Math.random() * STATE.locationPositionPointsArr.length)].name,
    warnType: `${Math.floor(Math.random() * 5) + 1}#煤层`,
    warnDescribe: Math.random() > 0.7 ? '此区域有重点监管作业人员，请及时处理！' : '(无更多信息)'
  })
}

// // getRydwRyczList 没做
// const getRydwRyczList = []


// 人员数据列表 模拟 500 条
const getRysj = []
for (let i = 0; i < 500; i++) {
  getRysj.push({
    t0: Math.floor(Math.random() * 8000 + 1000),
    t1: STATE.personList[Math.floor(Math.random() * STATE.personList.length)].name,
    t2: STATE.personList[Math.floor(Math.random() * STATE.personList.length)].info.value3,
    t3: STATE.personList[Math.floor(Math.random() * STATE.personList.length)].info.value4,
    t4: STATE.personList[Math.floor(Math.random() * STATE.personList.length)].info.value5,
    t5: (Math.random() * 10 + 90).toFixed(2),
    t6: STATE.locationPositionPointsArr[Math.floor(Math.random() * STATE.locationPositionPointsArr.length / 7 + 10 )].name,
    t7: (Math.random() * 10 + 90).toFixed(2),
    t8: Math.random() > 0.8 ? Math.random() > 0.85 ? Math.random() > 0.9 ? '1' : '2' : '3' : '4'
  })
}


// 传感器列表
const sensorExistingList = [ {
  "name": "CH4",
  "position": {"x": -324,"y": 0,"z": 331},
  "id": "000770",
  "info": {"name": "甲烷","value": "0.09","unit": "%CH4"},
  "title": "820进风皮带机头激光甲烷"
}, {
  "name": "CO",
  "position": {"x": -336,"y": 0,"z": 314},
  "id": "000771",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "820进风皮带机头一氧化碳"
}, {
  "name": "CH4",
  "position": {"x": 370,"y": 0,"z": -266},
  "id": "000774",
  "info": {"name": "甲烷","value": "0.06","unit": "%CH4"},
  "title": "1000回风施工钻场激光甲烷"
}, {
  "name": "CO",
  "position": {"x": 25,"y": 0,"z": -146},
  "id": "005215",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "627上隅角一氧化碳"
}, {
  "name": "CO",
  "position": {"x": -355,"y": 0,"z": 352},
  "id": "000912",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "816辅运巷二部皮带机头一氧化碳"
}, {
  "name": "FC",
  "position": {"x": -342,"y": 0,"z": -313},
  "id": "004740",
  "info": {"name": "粉尘浓度","value": "0.00","unit": "mg/m3"},
  "title": "632回风工作面粉尘"
}, {
  "name": "CH4",
  "position": {"x": -300,"y": 0,"z": 329},
  "id": "000913",
  "info": {"name": "甲烷","value": "0.11","unit": "%CH4"},
  "title": "816辅运巷二部皮带机头配电点激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -325,"y": 0,"z": -315},
  "id": "004806",
  "info": {"name": "甲烷","value": "0.19","unit": "%CH4"},
  "title": "632回风施工钻场激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 245,"y": 0,"z": 313},
  "id": "001487",
  "info": {"name": "甲烷","value": "0.02","unit": "%CH4"},
  "title": "3#煤仓上方激光甲烷"
}, {
  "name": "FC",
  "position": {"x": 169,"y": 0,"z": 45},
  "id": "005381",
  "info": {"name": "粉尘浓度","value": "0.00","unit": "mg/m3"},
  "title": "501工作面粉尘"
}, {
  "name": "CO",
  "position": {"x": 466,"y": 0,"z": -378},
  "id": "000108",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "1012进风正掘回风流一氧化碳"
}, {
  "name": "T",
  "position": {"x": 467,"y": 0,"z": -377},
  "id": "000111",
  "info": {"name": "温度","value": "20.70","unit": "℃"},
  "title": "1012进风正掘回风流温度"
}, {
  "name": "CH4",
  "position": {"x": 468,"y": 0,"z": -377},
  "id": "000002",
  "info": {"name": "甲烷","value": "0.14","unit": "%CH4"},
  "title": "1012进风正掘回风流甲烷T2&1012进风回风流T2"
}, {
  "name": "CO",
  "position": {"x": -326,"y": 0,"z": -312},
  "id": "004307",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "632回风顺槽回风流一氧化碳"
}, {
  "name": "CH4",
  "position": {"x": 220,"y": 0,"z": 337},
  "id": "001424",
  "info": {"name": "甲烷","value": "0.02","unit": "%CH4"},
  "title": "新1#中央变电所激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 296,"y": 0,"z": 144},
  "id": "008507",
  "info": {"name": "甲烷","value": "0.01","unit": "%CH4"},
  "title": "北一变电所1#硐室激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 243,"y": 0,"z": 303},
  "id": "000902",
  "info": {"name": "甲烷","value": "0.04","unit": "%CH4"},
  "title": "北一回风测风点激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -326,"y": 0,"z": -315},
  "id": "004247",
  "info": {"name": "甲烷","value": "0.29","unit": "%CH4"},
  "title": "632回风顺槽回风流甲烷&632回风掘进工作面&掘进工作面回风巷T2"
}, {
  "name": "T",
  "position": {"x": -326,"y": 0,"z": -318},
  "id": "004306",
  "info": {"name": "温度","value": "20.90","unit": "℃"},
  "title": "632回风顺槽回风流温度"
}, {
  "name": "CH4",
  "position": {"x": 424,"y": 0,"z": -240},
  "id": "003909",
  "info": {"name": "甲烷","value": "0.02","unit": "%CH4"},
  "title": "3#中央变激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -141,"y": 0,"z": -169},
  "id": "002306",
  "info": {"name": "甲烷","value": "0.24","unit": "%CH4"},
  "title": "627回风流激光甲烷&627采煤工作面&采煤工作面回风巷T2"
}, {
  "name": "CH4",
  "position": {"x": -208,"y": 0,"z": -310},
  "id": "005413",
  "info": {"name": "甲烷","value": "0.28","unit": "%CH4"},
  "title": "632回风顺槽中部激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -333,"y": 0,"z": -316},
  "id": "005419",
  "info": {"name": "甲烷","value": "0.15","unit": "%CH4"},
  "title": "632回风超前施工钻场激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -342,"y": 0,"z": -319},
  "id": "004739",
  "info": {"name": "甲烷","value": "0.04","unit": "%CH4"},
  "title": "632回风掘进工作面甲烷T1&632掘进工作面&632掘进工作面T1"
}, {
  "name": "CH4",
  "position": {"x": -175,"y": 0,"z": -180},
  "id": "002466",
  "info": {"name": "甲烷","value": "0.24","unit": "%CH4"},
  "title": "627机头配电点激光甲烷"
}, {
  "name": "CO",
  "position": {"x": -124,"y": 0,"z": -189},
  "id": "002308",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "627回风回风流一氧化碳"
}, {
  "name": "T",
  "position": {"x": 207,"y": 0,"z": 416},
  "id": "001058",
  "info": {"name": "温度","value": "26.60","unit": "℃"},
  "title": "3#变电所温度"
}, {
  "name": "CH4",
  "position": {"x": 172,"y": 0,"z": 34},
  "id": "008474",
  "info": {"name": "甲烷","value": "0.08","unit": "%CH4"},
  "title": "501工作面甲烷&501采煤工作面&采煤工作面T1"
}, {
  "name": "CH4",
  "position": {"x": -388,"y": 0,"z": -259},
  "id": "004868",
  "info": {"name": "甲烷","value": "0.09","unit": "%CH4"},
  "title": "626回风工作面甲烷&626回风掘进工作面&掘进工作面T1"
}, {
  "name": "CH4",
  "position": {"x": 295,"y": 0,"z": 74},
  "id": "000054",
  "info": {"name": "甲烷","value": "0.12","unit": "%CH4"},
  "title": "501运顺30m移变激光甲烷&501采煤工作面&其他"
}, {
  "name": "CH4",
  "position": {"x": 297,"y": 0,"z": 139},
  "id": "008512",
  "info": {"name": "甲烷","value": "0.05","unit": "%CH4"},
  "title": "北一变电所2#硐室激光甲烷"
}, {
  "name": "T",
  "position": {"x": 144,"y": 0,"z": 414},
  "id": "003477",
  "info": {"name": "温度","value": "17.80","unit": "℃"},
  "title": "2#风井进风巷口温度温度"
}, {
  "name": "CH4",
  "position": {"x": -304,"y": 0,"z": -212},
  "id": "005075",
  "info": {"name": "甲烷","value": "0.10","unit": "%CH4"},
  "title": "626回风中部激光甲烷"
}, {
  "name": "T",
  "position": {"x": -204,"y": 0,"z": -158},
  "id": "004858",
  "info": {"name": "温度","value": "21.10","unit": "℃"},
  "title": "626回风回风流温度"
}, {
  "name": "CH4",
  "position": {"x": -227,"y": 0,"z": -170},
  "id": "004888",
  "info": {"name": "甲烷","value": "0.12","unit": "%CH4"},
  "title": "626回风移动配电点激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 298,"y": 0,"z": 83},
  "id": "000026",
  "info": {"name": "甲烷","value": "0.11","unit": "%CH4"},
  "title": "501回风巷口绞车处激光甲烷&501采煤工作面&其他"
}, {
  "name": "CO",
  "position": {"x": 289,"y": 0,"z": 61},
  "id": "009082",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "501运顺掘进回风流一氧化碳"
}, {
  "name": "CH4",
  "position": {"x": -314,"y": 0,"z": -315},
  "id": "004804",
  "info": {"name": "甲烷","value": "0.24","unit": "%CH4"},
  "title": "632回风顺槽与灾害探查巷3#措施巷混合风流处甲烷T3"
}, {
  "name": "CO",
  "position": {"x": 213,"y": 0,"z": 397},
  "id": "001031",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "二部皮带中部驱动一氧化碳"
}, {
  "name": "CH4",
  "position": {"x": -310,"y": 0,"z": 329},
  "id": "005359",
  "info": {"name": "甲烷","value": "0.10","unit": "%CH4"},
  "title": "816辅运顺槽掘进皮带机头配电点激光甲烷"
}, {
  "name": "FC",
  "position": {"x": -327,"y": 0,"z": -320},
  "id": "000368",
  "info": {"name": "粉尘浓度","value": "0.00","unit": "mg/m3"},
  "title": "灾害探查巷（北二）工作面粉尘"
}, {
  "name": "T",
  "position": {"x": -316,"y": 0,"z": -325},
  "id": "000321",
  "info": {"name": "温度","value": "19.90","unit": "℃"},
  "title": "灾害探查巷（北二）回风流温度"
}, {
  "name": "CO",
  "position": {"x": -316,"y": 0,"z": -318},
  "id": "000322",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "灾害探查巷（北二）回风流一氧化碳"
}, {
  "name": "CH4",
  "position": {"x": 12,"y": 0,"z": -140},
  "id": "002304",
  "info": {"name": "甲烷","value": "0.16","unit": "%CH4"},
  "title": "627工作面甲烷&627采煤工作面&采煤工作面T1"
}, {
  "name": "CH4",
  "position": {"x": -321,"y": 0,"z": -320},
  "id": "000490",
  "info": {"name": "甲烷","value": "0.13","unit": "%CH4"},
  "title": "灾害探查巷（北二）施工钻场激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -316,"y": 0,"z": -322},
  "id": "000320",
  "info": {"name": "甲烷","value": "0.08","unit": "%CH4"},
  "title": "北二灾害探查巷回风流甲烷&北二灾害探查巷&北二灾害探查巷回风巷T2"
}, {
  "name": "FC",
  "position": {"x": 17,"y": 0,"z": -148},
  "id": "005216",
  "info": {"name": "粉尘浓度","value": "0.00","unit": "mg/m3"},
  "title": "627工作面粉尘"
}, {
  "name": "CH4",
  "position": {"x": -327,"y": 0,"z": -324},
  "id": "000362",
  "info": {"name": "甲烷","value": "0.10","unit": "%CH4"},
  "title": "北二灾害探查巷工作面甲烷&北二灾害探查巷&掘进工作面T1"
}, {
  "name": "CO",
  "position": {"x": 394,"y": 0,"z": -265},
  "id": "000499",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "1000回风顺槽掘进回风流一氧化碳"
}, {
  "name": "CO",
  "position": {"x": 425,"y": 0,"z": -257},
  "id": "000509",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "1000回风顺槽掘进皮带机头一氧化碳"
}, {
  "name": "FC",
  "position": {"x": 356,"y": 0,"z": -264},
  "id": "000496",
  "info": {"name": "粉尘浓度","value": "0.30","unit": "mg/m3"},
  "title": "1000回风顺槽掘进工作面粉尘"
}, {
  "name": "T",
  "position": {"x": 394,"y": 0,"z": -269},
  "id": "000500",
  "info": {"name": "温度","value": "22.80","unit": "℃"},
  "title": "1000回风顺槽掘进回风流温度"
}, {
  "name": "CH4",
  "position": {"x": -213,"y": 0,"z": -163},
  "id": "004857",
  "info": {"name": "甲烷","value": "0.14","unit": "%CH4"},
  "title": "626回风回风流甲烷&626回风掘进工作面&掘进工作面回风巷T2"
}, {
  "name": "CH4",
  "position": {"x": 394,"y": 0,"z": -259},
  "id": "000498",
  "info": {"name": "甲烷","value": "0.13","unit": "%CH4"},
  "title": "1000回风掘进回风流甲烷&1000回风掘进工作面&掘进工作面回风巷T2"
}, {
  "name": "CH4",
  "position": {"x": 295,"y": 0,"z": 59},
  "id": "008476",
  "info": {"name": "甲烷","value": "0.09","unit": "%CH4"},
  "title": "501回风流甲烷&501采煤工作面&采煤工作面回风巷T2"
}, {
  "name": "CH4",
  "position": {"x": 356,"y": 0,"z": -271},
  "id": "000495",
  "info": {"name": "甲烷","value": "0.04","unit": "%CH4"},
  "title": "1000回风顺槽工作面甲烷&1000回风掘进工作面&掘进工作面T1"
}, {
  "name": "T",
  "position": {"x": 285,"y": 0,"z": 71},
  "id": "009091",
  "info": {"name": "温度","value": "22.40","unit": "℃"},
  "title": "501运顺回风流温度"
}, {
  "name": "T",
  "position": {"x": 423,"y": 0,"z": -239},
  "id": "003913",
  "info": {"name": "温度","value": "25.20","unit": "℃"},
  "title": "3#中央变温度"
}, {
  "name": "CO",
  "position": {"x": -132,"y": 0,"z": -308},
  "id": "004309",
  "info": {"name": "一氧化碳","value": "2.00","unit": "ppm"},
  "title": "632回风顺槽皮带机头一氧化碳"
}, {
  "name": "T",
  "position": {"x": -326,"y": 0,"z": 335},
  "id": "005368",
  "info": {"name": "温度","value": "22.60","unit": "℃"},
  "title": "816辅运顺槽掘进回风流温度"
}, {
  "name": "CH4",
  "position": {"x": 24,"y": 0,"z": -142},
  "id": "004133",
  "info": {"name": "甲烷","value": "0.16","unit": "%CH4"},
  "title": "627上隅角甲烷&627采煤工作面&采煤工作面回风隅角T0"
}, {
  "name": "CO",
  "position": {"x": -210,"y": 0,"z": -165},
  "id": "004859",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "626回风回风流一氧化碳"
}, {
  "name": "T",
  "position": {"x": -133,"y": 0,"z": -181},
  "id": "003637",
  "info": {"name": "温度","value": "27.40","unit": "℃"},
  "title": "627回风回风流温度"
}, {
  "name": "FC",
  "position": {"x": -278,"y": 0,"z": 328},
  "id": "005352",
  "info": {"name": "粉尘浓度","value": "0.00","unit": "mg/m3"},
  "title": "816辅运顺槽掘进工作面粉尘"
}, {
  "name": "CO",
  "position": {"x": -318,"y": 0,"z": 314},
  "id": "000618",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "820进风回风流一氧化碳&820进风工作面&其他"
}, {
  "name": "CO",
  "position": {"x": 159,"y": 0,"z": 36},
  "id": "005382",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "501上隅角一氧化碳"
}, {
  "name": "FC",
  "position": {"x": -288,"y": 0,"z": 316},
  "id": "000614",
  "info": {"name": "粉尘浓度","value": "0.70","unit": "mg/m3"},
  "title": "820进风工作面粉尘&820进风工作面&其他"
}, {
  "name": "CH4",
  "position": {"x": -285,"y": 0,"z": 310},
  "id": "000613",
  "info": {"name": "甲烷","value": "0.04","unit": "%CH4"},
  "title": "820进风工作面激光甲烷T1&820进风工作面&掘进工作面T1"
}, {
  "name": "CH4",
  "position": {"x": 161,"y": 0,"z": 27},
  "id": "003319",
  "info": {"name": "甲烷","value": "0.07","unit": "%CH4"},
  "title": "501上隅角甲烷&501采煤工作面&采煤工作面回风隅角T0"
}, {
  "name": "CH4",
  "position": {"x": -319,"y": 0,"z": 335},
  "id": "000616",
  "info": {"name": "甲烷","value": "0.07","unit": "%CH4"},
  "title": "820进风回风流激光甲烷T2&820进风回风流&掘进回风流T2"
}, {
  "name": "CO",
  "position": {"x": 312,"y": 0,"z": 85},
  "id": "005379",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "501回风皮带机头一氧化碳"
}, {
  "name": "CH4",
  "position": {"x": -147,"y": 0,"z": -174},
  "id": "003542",
  "info": {"name": "甲烷","value": "0.23","unit": "%CH4"},
  "title": "629进风与627回风混合风流处甲烷T3"
}, {
  "name": "CH4",
  "position": {"x": 375,"y": 0,"z": -260},
  "id": "000760",
  "info": {"name": "甲烷","value": "0.09","unit": "%CH4"},
  "title": "1000回风巷掘进1#水仓激光甲烷&其他&其他"
}, {
  "name": "CH4",
  "position": {"x": -146,"y": 0,"z": -308},
  "id": "004305",
  "info": {"name": "甲烷","value": "0.19","unit": "%CH4"},
  "title": "632回风顺槽1#配电点激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -5,"y": 0,"z": -127},
  "id": "003042",
  "info": {"name": "甲烷","value": "-999999.00","unit": "%CH4"},
  "title": "627回风中部激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 383,"y": 0,"z": -312},
  "id": "004459",
  "info": {"name": "甲烷","value": "0.01","unit": "%CH4"},
  "title": "1010辅运顺槽回风流激光甲烷T2"
}, {
  "name": "CH4",
  "position": {"x": 140,"y": 0,"z": -294},
  "id": "004619",
  "info": {"name": "甲烷","value": "0.00","unit": "%CH4"},
  "title": "1010辅运顺槽工作面T1"
}, {
  "name": "CH4",
  "position": {"x": 418,"y": 0,"z": -312},
  "id": "004464",
  "info": {"name": "甲烷","value": "0.00","unit": "%CH4"},
  "title": "1010辅运顺槽30m1#移变激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 199,"y": 0,"z": -314},
  "id": "004639",
  "info": {"name": "甲烷","value": "0.00","unit": "%CH4"},
  "title": "1010辅运顺槽1800米临时水仓激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 245,"y": 0,"z": -314},
  "id": "004695",
  "info": {"name": "甲烷","value": "0.00","unit": "%CH4"},
  "title": "1010辅运顺槽4#避险硐室激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 394,"y": 0,"z": -312},
  "id": "004465",
  "info": {"name": "甲烷","value": "0.00","unit": "%CH4"},
  "title": "1010辅运顺槽200m水仓激光甲烷"
}, {
  "name": "CO",
  "position": {"x": 400,"y": 0,"z": -312},
  "id": "004460",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "1010辅运顺槽回风流一氧化碳"
}, {
  "name": "CH4",
  "position": {"x": 319,"y": 0,"z": -314},
  "id": "004467",
  "info": {"name": "甲烷","value": "0.00","unit": "%CH4"},
  "title": "1010辅运顺槽巷道中部激光甲烷"
}, {
  "name": "T",
  "position": {"x": 412,"y": 0,"z": -311},
  "id": "004461",
  "info": {"name": "温度","value": "19.40","unit": "℃"},
  "title": "1010辅运顺槽回风流温度"
}, {
  "name": "CH4",
  "position": {"x": 309,"y": 0,"z": -314},
  "id": "004469",
  "info": {"name": "甲烷","value": "0.00","unit": "%CH4"},
  "title": "1010辅运顺槽1300m2#移变激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 268,"y": 0,"z": -314},
  "id": "004470",
  "info": {"name": "甲烷","value": "0.00","unit": "%CH4"},
  "title": "1010辅运顺槽1700m4#水仓激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 270,"y": 0,"z": 73},
  "id": "000176",
  "info": {"name": "甲烷","value": "0.07","unit": "%CH4"},
  "title": "501运顺400m1#水仓激光甲烷&501采煤工作面&其他"
}, {
  "name": "CH4",
  "position": {"x": -67,"y": 0,"z": -151},
  "id": "002479",
  "info": {"name": "甲烷","value": "0.17","unit": "%CH4"},
  "title": "627回风1#水仓甲烷"
}, {
  "name": "CH4",
  "position": {"x": -101,"y": 0,"z": -161},
  "id": "002464",
  "info": {"name": "甲烷","value": "0.17","unit": "%CH4"},
  "title": "627回风巷1#移动配电点激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -36,"y": 0,"z": -143},
  "id": "000487",
  "info": {"name": "甲烷","value": "0.18","unit": "%CH4"},
  "title": "627回风1#避险硐室激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -193,"y": 0,"z": -310},
  "id": "004805",
  "info": {"name": "甲烷","value": "0.28","unit": "%CH4"},
  "title": "632回风顺槽450m处配电点激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -186,"y": 0,"z": -310},
  "id": "004828",
  "info": {"name": "甲烷","value": "0.31","unit": "%CH4"},
  "title": "632回风顺槽2#措施巷混合风流处激光甲烷T3"
}, {
  "name": "CH4",
  "position": {"x": -222,"y": 0,"z": -310},
  "id": "005377",
  "info": {"name": "甲烷","value": "0.27","unit": "%CH4"},
  "title": "632回风顺槽2#水仓激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -157,"y": 0,"z": -308},
  "id": "000252",
  "info": {"name": "甲烷","value": "0.24","unit": "%CH4"},
  "title": "632回风顺槽1#水仓激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -237,"y": 0,"z": -177},
  "id": "005019",
  "info": {"name": "甲烷","value": "0.14","unit": "%CH4"},
  "title": "626回风临时水仓激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -347,"y": 0,"z": -235},
  "id": "005261",
  "info": {"name": "甲烷","value": "0.12","unit": "%CH4"},
  "title": "626回风2#水仓激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -265,"y": 0,"z": -193},
  "id": "005020",
  "info": {"name": "甲烷","value": "0.13","unit": "%CH4"},
  "title": "626回风1#水仓激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -278,"y": 0,"z": 318},
  "id": "005351",
  "info": {"name": "甲烷","value": "0.02","unit": "%CH4"},
  "title": "816辅运顺槽工作面甲烷TI&816辅运顺槽掘进&816辅运顺槽掘进工作面T1"
}, {
  "name": "CH4",
  "position": {"x": -21,"y": 0,"z": -135},
  "id": "003275",
  "info": {"name": "甲烷","value": "0.22","unit": "%CH4"},
  "title": "627回风1500米3号水仓激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -53,"y": 0,"z": -145},
  "id": "003274",
  "info": {"name": "甲烷","value": "0.28","unit": "%CH4"},
  "title": "627回风1300m配电点激光甲烷"
}, {
  "name": "CO",
  "position": {"x": 140,"y": 0,"z": -359},
  "id": "000542",
  "info": {"name": "一氧化碳","value": "0.00","unit": "ppm"},
  "title": "1010回风掘进切眼皮带机头一氧化碳"
}, {
  "name": "CH4",
  "position": {"x": 153,"y": 0,"z": -359},
  "id": "004339",
  "info": {"name": "甲烷","value": "0.15","unit": "%CH4"},
  "title": "1010回风掘进切眼皮带机头配电点激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 222,"y": 0,"z": 58},
  "id": "000569",
  "info": {"name": "甲烷","value": "0.10","unit": "%CH4"},
  "title": "501运顺巷道中部激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 368,"y": 0,"z": -314},
  "id": "004640",
  "info": {"name": "甲烷","value": "0.07","unit": "%CH4"},
  "title": "1010辅运顺槽1#施工钻场激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 298,"y": 0,"z": -314},
  "id": "000001",
  "info": {"name": "甲烷","value": "0.13","unit": "%CH4"},
  "title": "1010辅运顺槽2#施工钻场激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 262,"y": 0,"z": -314},
  "id": "000003",
  "info": {"name": "甲烷","value": "0.10","unit": "%CH4"},
  "title": "1010辅运顺槽3#施工钻场激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": 215,"y": 0,"z": -314},
  "id": "000005",
  "info": {"name": "甲烷","value": "0.13","unit": "%CH4"},
  "title": "1010辅运顺槽4#施工钻场激光甲烷"
}, {
  "name": "CH4",
  "position": {"x": -197,"y": 0,"z": -119},
  "id": "004866",
  "info": {"name": "甲烷","value": "0.12","unit": "%CH4"},
  "title": "626回风机头配电点激光甲烷"
}
]

export const mockData = {
  getRyyjList,
  getQyyjList,
  getRysj,
  sensorExistingList
}


