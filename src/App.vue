<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->

<script setup>
import Scene from '@/views/Scene.vue'
import router from '@/router/index'
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import { onBeforeMount, onMounted, getCurrentInstance, ref } from 'vue'
import { getRysj, getAqjcAqmcList, getAqjcAqssList, getRiskPointList, getAqjcAqkcList, getKydevList, getKyjcKyrtdataList, getSwdevList, getSwjcSwrtdataList, getRyPointNum, getSwdevRelList, getKydevRelList, getAqjcAqfzRelList } from '@/axios/api'
import { mockData } from "@/axios/mockdata"
import SceneChange from '@/components/sceneChange.vue'
import { CACHE } from './ktJS/CACHE'
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()

// 允许操作按钮等，简单的防抖
let allowControl = ref(false)
STATE.allowControl = allowControl

const version = API.getVersion()

// 判断入口 以及版本
onBeforeMount(() => {
  let currentWorkfacePopup = []
  if (version === 'yihao') {
    STATE.locationPositionPointsArr = window.workfaceArea
    currentWorkfacePopup = window.workfacePopup

  } else if (version === 'erhao') {
    STATE.locationPositionPointsArr = window.workfaceArea_erhao
    currentWorkfacePopup = window.workfacePopup_erhao

  } else if (version === 'shuanglong') {
    STATE.locationPositionPointsArr = window.workfaceArea_shuanglong
    currentWorkfacePopup = window.workfacePopup_shuanglong

  } else if (version === 'ruineng') {
    STATE.locationPositionPointsArr = window.workfaceArea_ruineng
    currentWorkfacePopup = window.workfacePopup_ruineng
  }

  currentWorkfacePopup.forEach(e => {
    STATE.popupLocationList.push({
      name: e.name,
      sub: '工作人员数量: 0 人',
      position: e.position,
      regionRate: {
        total: 0,
        member: 0,
        device: 0,
        environment: 0,
        manager: 0
      },
      person: []
    })
  })


  // 确认入口
  if (location.hash.includes('/regionalrisk')) {
    STATE.startPath = '重点区域'
  } else if (location.hash.includes('/comprehensive')) {
    STATE.startPath = '综合'
  } else if (location.hash === '#/' || location.hash.includes('#/?version=')) {
    STATE.startPath = '人员管理'
  } else {
    STATE.startPath = '人员管理'
    router.push('/')
  }
})

window.pause3D = (flag) => {
  API.pause3D(flag)
}


onMounted(() => {
  // 获取数据
  if (STATE.isNeedGetData) {
    // 传感器
    if ($isOurSite) {

      // 获取服务器所有的区域data
      STATE.locationData = mockData.locationData

      // 人员和区域
      {
        STATE.importantLocation.value = STATE.locationData.filter(e => e.keyAreaStatus === '1').map(e => e.pointName)

        // 人员监管
        const personData = mockData.getRysj
        console.log('personData: ', personData);
        STATE.sceneList.personPopup.forEach(e => {
          e.remove(e.children[0])
        })
        STATE.sceneList.personPopup = []

        const personPopupList = []
        const personAllUsefulList = []
        personData.forEach(item => {
          // 工作面
          const hasGongzuomian = STATE.locationPositionPointsArr.find(e => e.name === item.t6)
          if (hasGongzuomian) {
            // const randomPosition = API.randomPointInQuadrilateral(...area.value)
            const randomPosition = API.randomPointInLine(...hasGongzuomian.value)
            personPopupList.push({
              name: item.t1,
              level: Number(item.t8),
              position: { x: randomPosition[0], y: 0, z: randomPosition[1] },
              user_id: item.user_id,
              info: {
                title: item.t6,
                value1: item.t0,
                value2: STATE.personMap.find(e2 => e2.level == item.t8).name,
                value3: item.t2,
                value4: item.t3,
                value5: item.t4
              }
            })
          }

          const hasPosition = STATE.locationData.find(e => e.pointName === item.t6)
          if (hasPosition) {
            personAllUsefulList.push({
              name: item.t1,
              level: Number(item.t8),
              user_id: item.user_id,
              info: {
                title: item.t6,
                value1: item.t0,
                value2: STATE.personMap.find(e2 => e2.level == item.t8).name,
                value3: item.t2,
                value4: item.t3,
                value5: item.t4
              }
            })
          }
        })


        STATE.personPopupList = personPopupList
        STATE.personAllUsefulList = personAllUsefulList


        // 处理location的当前场景人数
        const locationPersonNum = {}
        STATE.personAllUsefulList.forEach(e => {
          if (locationPersonNum[e.info.title] != undefined) {
            locationPersonNum[e.info.title]++
          } else {
            locationPersonNum[e.info.title] = 1
          }
        })


        for (let key in locationPersonNum) {
          if (key.includes('工作面')) {
            const num = key.replace(/[^\d]/g, "")
            const location = STATE.popupLocationList.find(e => e.name.includes(num + '综采工作面') || e.name.includes(num + '工作面'))
            if (location) {
              location.sub = `工作人员数量: ${locationPersonNum[key]} 人`
            }
          } else {
            const location = STATE.popupLocationList.find(e => e.name === key)
            if (location) {
              location.sub = `工作人员数量: ${locationPersonNum[key]} 人`
            }
          }
        }

        waitForSceneList()
        function waitForSceneList() {
          if (!STATE?.sceneList?.mainScene) {
            setTimeout(() => {
              waitForSceneList()
            }, 500)
            return
          }

          STATE.allowControl.value = true

          // 全部恢复成默认(已采)
          if (STATE.version === 'yihao') {
            STATE.sceneList.mainScene.children.forEach(e => {
              const area = e.name.replace(/[^\d]/g, "")
              if (STATE.textureOffsetDirection.yihao.toLeft.includes(area) || STATE.textureOffsetDirection.yihao.toRight.includes(area)) {
                e.material = STATE.statusMaterial.over.clone()
              }
            })

          } else if (STATE.version === 'erhao') {

          } else if (STATE.version === 'shuanglong') {
            STATE.sceneList.mainScene.traverse(e => {
              if (e.isMesh && e.name.includes('zcgzm')) {
                const area = e.name.replace(/[^\d]/g, "")
                if (STATE.textureOffsetDirection.shuanglong.toLeft.includes(area) || STATE.textureOffsetDirection.shuanglong.toRight.includes(area)) {
                  e.material = STATE.statusMaterial.over.clone()
                }
              }
            })



          } else if (STATE.version === 'ruineng') {
            let group = []
            STATE.sceneList.mainScene.traverse(e => {
              if (e.name === 'huise') {
                group = e
              }
            })
            group.children.forEach(e => {
              e.material = STATE.statusMaterial.over.clone()
            })
          }

          // 根据接口来配置状态
          STATE.locationData.forEach(e => {
            if (e.pointName.includes('工作面')) {
              const area = e.pointName.replace(/[^\d]/g, " ").replace(/ /g, '')

              let item = null
              if (STATE.version === 'yihao') {
                item = STATE.sceneList.mainScene.children.find(e2 => e2.name.includes(area))

              } else if (STATE.version === 'erhao') {

              } else if (STATE.version === 'shuanglong') {

              } else if (STATE.version === 'ruineng') {

              }

              if (item) {
                if (e.riskPointStatus == '1') {
                  item.visible = false

                } else if (e.riskPointStatus == '2') {
                  if (STATE.textureOffsetDirection[STATE.version].toLeft.includes(area)) {
                    item.material = STATE.statusMaterial.toLeft.clone()
                    STATE.mainSceneTextureAnimateMeshList.toLeft.push(item)

                  } else if (STATE.textureOffsetDirection[STATE.version].toRight.includes(area)) {
                    item.material = STATE.statusMaterial.toRight.clone()
                    STATE.mainSceneTextureAnimateMeshList.toRight.push(item)
                  }
                  item.visible = true

                } else if (e.riskPointStatus == '3') {
                  item.material = STATE.statusMaterial.over.clone()
                  item.visible = true
                }
              }
            }

            const location = STATE.popupLocationList.find(e2 => e2.name === e.pointName)
            if (location) {
              location.keyAreaStatus = e.keyAreaStatus // 是否为重点区域 0 否 1 是
              location.riskPointStatus = e.riskPointStatus // 状态 1 备采 2 在采 3 已采
              location.id = e.belongMine
              location.regionRate.member = Math.floor(Math.random() * 10 + 90)
              location.regionRate.device = Math.floor(Math.random() * 10 + 90)
              location.regionRate.environment = Math.floor(Math.random() * 10 + 90)
              location.regionRate.manager = Math.floor(Math.random() * 10 + 90)
              location.regionRate.total = Math.floor(Math.random() * 10 + 90)
              location.regionRate.status = Math.floor(Math.random() * 4) + 1 //1234 红橙黄蓝
            }
          })

          if (!STATE.sceneList.personPopup.length) {
            API.initPersonPopup()
          }
          if (!STATE.sceneList.locationPopup.length) {
            API.initLocationPopup()
          }
        }
      }



    } else {

      (async () => {
        const allData = await Promise.allSettled([
          getAqjcAqmcList(),
          getAqjcAqssList(),
          getAqjcAqkcList(),
          // getKydevList(),
          // getKyjcKyrtdataList(),
          // getSwdevList(),
          // getSwjcSwrtdataList(),
          getAqjcAqfzRelList(),
          // getKydevRelList(),
          // getSwdevRelList(),
          getRiskPointList()
        ]).catch(() => { })


        // const data1 = allData[0].status === 'fulfilled' ? allData[0].value : {}    // 开关量
        // const data2 = allData[1].status === 'fulfilled' ? allData[1].value : {}    // 开关量、模拟量 值
        // const data3 = allData[2].status === 'fulfilled' ? allData[2].value : {}    // 模拟量
        // const data4 = allData[3].status === 'fulfilled' ? allData[3].value : {}    // 矿压
        // const data5 = allData[4].status === 'fulfilled' ? allData[4].value : {}    // 矿压 值
        // const data6 = allData[5].status === 'fulfilled' ? allData[5].value : {}    // 水文
        // const data7 = allData[6].status === 'fulfilled' ? allData[6].value : {}    // 水文 值
        // const data8 = allData[7].status === 'fulfilled' ? allData[7].value : {}    // 开关量、模拟量 对应
        // const data9 = allData[8].status === 'fulfilled' ? allData[8].value : {}    // 矿压 对应
        // const data10 = allData[9].status === 'fulfilled' ? allData[9].value : {}   // 水文 对应
        // const data11 = allData[10].status === 'fulfilled' ? allData[10].value : {} // 风险点列表


        const data1 = allData[0].status === 'fulfilled' ? allData[0].value : {}    // 开关量
        const data2 = allData[1].status === 'fulfilled' ? allData[1].value : {}    // 开关量、模拟量 值
        const data3 = allData[2].status === 'fulfilled' ? allData[2].value : {}    // 模拟量
        const data8 = allData[3].status === 'fulfilled' ? allData[3].value : {}    // 开关量、模拟量 对应
        const data11 = allData[4].status === 'fulfilled' ? allData[4].value : {}   // 风险点列表

        // 传感器
        {
          // 获取服务器所有的区域data
          STATE.locationData = data11.list

          handleAqmcAqkc(data1) // 开关量
          handleAqmcAqkc(data3) // 模拟量

          function handleAqmcAqkc(data) {
            data8.list && data8.list.forEach(e => {
              const point = STATE.locationData.find(e2 => e2.id == e.riskPointId)
              const sensor = data.list.find(e2 => e2.ssTransducerCode == e.aqfzCode)
              const value = data2.list.find(e2 => e2.ssTransducerCode == e.aqfzCode)
              if (point && sensor && value) {
                const all = Object.assign(sensor, value)
                const sensorData = {
                  time: all.csDataTime,
                  value: all.ssAnalogValue,
                  location: all.ssTransducerPoint,
                  transducerCode: all.ssTransducerCode,
                  transducerName: all.ssTransducerName,
                  unit: all.ssAnalogUnit || '',
                  allData: all
                }

                if (!point.sensor) {
                  point.sensor = []
                }
                point.sensor.push(sensorData)
              }
            })
          }


          // // 矿压
          // data9.list && data9.list.forEach(e => {
          //   const point = STATE.locationData.find(e2 => e2.id == e.riskPointId)
          //   const sensor = data4.list.find(e2 => e2.kyTunnelName == e.kyjcCode)
          //   if (sensor) {
          //     const value = data5.list.find(e2 => e2.kyTransducerCode == sensor.kyTransducerCode)
          //     if (point && sensor && value) {
          //       const all = Object.assign(sensor, value)
          //       const sensorData = {
          //         time: all.csDataTime,
          //         value: all.kyRealtimeData,
          //         location: all.kyTunnelName,
          //         transducerCode: all.kyTransducerCode,
          //         transducerName: '矿压 - ' + all.kyAreaName,
          //         unit: all.kyAnalogUnit || '',
          //         allData: all
          //       }

          //       if (!point.sensor) {
          //         point.sensor = []
          //       }
          //       point.sensor.push(sensorData)
          //     }
          //   }
          // })


          // // 水文
          // data10.list && data10.list.forEach(e => {
          //   const point = STATE.locationData.find(e2 => e2.id == e.riskPointId)
          //   const sensor = data6.list.find(e2 => e2.swStationCode == e.swjcCode)
          //   const value = data7.list.find(e2 => e2.swStationCode == e.swjcCode)
          //   if (point && sensor && value) {
          //     const all = Object.assign(sensor, value)
          //     const sensorData = {
          //       time: all.csDataTime,
          //       value: all.swWaterTemperatureData,
          //       location: all.swViewPosition,
          //       transducerCode: all.swStationCode,
          //       transducerName: all.swAreaName + ' - ' + all.swPointName,
          //       unit: all.swAnalogUnit || '',
          //       allData: all
          //     }

          //     if (!point.sensor) {
          //       point.sensor = []
          //     }
          //     point.sensor.push(sensorData)
          //   }

          // })
        }


        // 人员和区域
        {
          if (!STATE.locationData) {
            STATE.locationData = []
          }
          STATE.importantLocation.value = STATE.locationData.filter(e => e.keyAreaStatus === '1').map(e => e.pointName)

          // 人员监管
          const personData = await getRysj().catch(() => {
            return { list: [] }
          })
          STATE.sceneList.personPopup.forEach(e => {
            e.remove(e.children[0])
          })
          STATE.sceneList.personPopup = []

          const personPopupList = []
          const personAllUsefulList = []
          personData.list.forEach(item => {
            // 工作面
            const hasGongzuomian = STATE.locationPositionPointsArr.find(e => e.name === item.t6)
            if (hasGongzuomian) {
              // const randomPosition = API.randomPointInQuadrilateral(...area.value)
              const randomPosition = API.randomPointInLine(...hasGongzuomian.value)
              personPopupList.push({
                name: item.t1,
                level: Number(item.t8),
                position: { x: randomPosition[0], y: 0, z: randomPosition[1] },
                user_id: item.user_id,
                info: {
                  title: item.t6,
                  value1: item.t0,
                  value2: STATE.personMap.find(e2 => e2.level == item.t8).name,
                  value3: item.t2,
                  value4: item.t3,
                  value5: item.t4
                }
              })
            }

            const hasPosition = STATE.locationData.find(e => e.pointName === item.t6)
            if (hasPosition) {
              personAllUsefulList.push({
                name: item.t1,
                level: Number(item.t8),
                user_id: item.user_id,
                info: {
                  title: item.t6,
                  value1: item.t0,
                  value2: STATE.personMap.find(e2 => e2.level == item.t8).name,
                  value3: item.t2,
                  value4: item.t3,
                  value5: item.t4
                }
              })
            }
          })


          STATE.personPopupList = personPopupList
          STATE.personAllUsefulList = personAllUsefulList


          // 处理location的当前场景人数
          const locationPersonNum = {}
          STATE.personAllUsefulList.forEach(e => {
            if (locationPersonNum[e.info.title] != undefined) {
              locationPersonNum[e.info.title]++
            } else {
              locationPersonNum[e.info.title] = 1
            }
          })


          for (let key in locationPersonNum) {
            if (key.includes('工作面')) {
              const num = key.replace(/[^\d]/g, "")
              const location = STATE.popupLocationList.find(e => e.name.includes(num + '综采工作面') || e.name.includes(num + '工作面'))
              if (location) {
                location.sub = `工作人员数量: ${locationPersonNum[key]} 人`
              }
            } else {
              const location = STATE.popupLocationList.find(e => e.name === key)
              if (location) {
                location.sub = `工作人员数量: ${locationPersonNum[key]} 人`
              }
            }
          }

          // 区域人员数量
          const locationPointOrigin = await getRyPointNum().catch(() => {
            return { list: [] }
          })


          waitForSceneList()
          function waitForSceneList() {
            if (!STATE?.sceneList?.mainScene) {
              setTimeout(() => {
                waitForSceneList()
              }, 500)
              return
            }
            STATE.allowControl.value = true

            // 全部恢复成默认(已采)
            if (STATE.version === 'yihao') {
              STATE.sceneList.mainScene.children.forEach(e => {
                const area = e.name.replace(/[^\d]/g, "")
                if (STATE.textureOffsetDirection.yihao.toLeft.includes(area) || STATE.textureOffsetDirection.yihao.toRight.includes(area)) {
                  e.material = STATE.statusMaterial.over.clone()
                }
              })

            } else if (STATE.version === 'erhao') {

            } else if (STATE.version === 'shuanglong') {
              STATE.sceneList.mainScene.traverse(e => {
                if (e.isMesh && e.name.includes('zcgzm')) {
                  const area = e.name.replace(/[^\d]/g, "")
                  if (STATE.textureOffsetDirection.shuanglong.toLeft.includes(area) || STATE.textureOffsetDirection.shuanglong.toRight.includes(area)) {
                    e.material = STATE.statusMaterial.over.clone()
                  }
                }
              })



            } else if (STATE.version === 'ruineng') {
              let group = []
              STATE.sceneList.mainScene.traverse(e => {
                if (e.name === 'huise') {
                  group = e
                }
              })
              group.children.forEach(e => {
                e.material = STATE.statusMaterial.over.clone()
              })
            }

            // 根据接口来配置状态
            STATE.locationData.forEach(e => {
              if (e.pointName.includes('工作面')) {
                const area = e.pointName.replace(/[^\d]/g, "")

                let item = null
                if (STATE.version === 'yihao') {
                  item = STATE.sceneList.mainScene.children.find(e2 => e2.name.includes(area))

                } else if (STATE.version === 'erhao') {

                } else if (STATE.version === 'shuanglong') {
                  item = STATE.sceneList.mainScene.children.find(e2 => e2.name.includes(area + 'zcgzm'))

                } else if (STATE.version === 'ruineng') {
                  STATE.sceneList.mainScene.traverse(e => {
                    if (e.name === area) {
                      item = e
                    }
                  })

                }

                if (item) {
                  if (e.riskPointStatus == '1') {
                    item.visible = false

                  } else if (e.riskPointStatus == '2') {
                    if (STATE.textureOffsetDirection[STATE.version].toLeft.includes(area)) {
                      item.material = STATE.statusMaterial.toLeft.clone()
                      STATE.mainSceneTextureAnimateMeshList.toLeft.push(item)

                    } else if (STATE.textureOffsetDirection[STATE.version].toRight.includes(area)) {
                      item.material = STATE.statusMaterial.toRight.clone()
                      STATE.mainSceneTextureAnimateMeshList.toRight.push(item)
                    }
                    item.visible = true

                  } else if (e.riskPointStatus == '3') {
                    item.material = STATE.statusMaterial.over.clone()
                    item.visible = true
                  }
                }
              }

              const location = STATE.popupLocationList.find(e2 => e2.name === e.pointName)
              const pointNumber = locationPointOrigin.list.find(e2 => e2.pointId == e.id)
              if (location && pointNumber) {
                location.keyAreaStatus = e.keyAreaStatus // 是否为重点区域 0 否 1 是
                location.riskPointStatus = e.riskPointStatus // 状态 1 备采 2 在采 3 已采
                // location.sub = `工作人员数量: ${pointNumber.numAll} 人`
                location.id = e.belongMine
                location.regionRate.member = pointNumber.regionRisk1
                location.regionRate.device = pointNumber.regionRisk2
                location.regionRate.environment = pointNumber.regionRisk3
                location.regionRate.manager = pointNumber.regionRisk4
                location.regionRate.total = pointNumber.score
                location.regionRate.status = pointNumber.status //1234 红橙黄蓝
              }
            })

            if (!STATE.sceneList.personPopup.length) {
              API.initPersonPopup()
            }
            if (!STATE.sceneList.locationPopup.length) {
              API.initLocationPopup()
            }
          }
        }



      })()
    }

    if (STATE.startPath === '重点区域') {
      API.showPopup([
        STATE.sceneList.personPopup,
        STATE.sceneList.monitorPopup,
        STATE.sceneList.baseStationPopup
      ], false)
    }
    STATE.isNeedGetData = false

  }


  // 设置路由
  const pathMatch = location.hash.match(/#\/(\w+)/)
  let path = ''
  if(pathMatch) {
    path = pathMatch[1]
  }
  STATE.currentScene[0] = '/' + path
  STATE.currentScene[1] = '/' + path
});



</script>

<template>
  <Scene />
  <router-view></router-view>
  <!-- <SceneChange></SceneChange> -->
</template>

<style scoped>
:global(#app) {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  pointer-events: none;
  color: #FFF;
}

.bg {
  position: fixed;
  z-index: 5;
  height: 100vh;
  width: 100vw;
}
</style>
