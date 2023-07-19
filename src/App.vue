<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->

<script setup>
import Scene from '@/views/Scene.vue'
import router from '@/router/index'
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import { onBeforeMount, onMounted, getCurrentInstance } from 'vue'
import { getRysj, getAqjcAqmcList, getAqjcAqssList, getRiskPointList, getRyPointNum } from '@/axios/api'
import { mockData } from "@/axios/mockdata"
import SceneChange from '@/components/sceneChange.vue'
import { CACHE } from './ktJS/CACHE'
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()


onBeforeMount(() => {
  if (location.hash === '#/regionalrisk') {
    STATE.startPath = '重点区域'
  } else if (location.hash === '#/comprehensive') {
    STATE.startPath = '综合'
  } else if (location.hash === '#/') {
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
      STATE.sceneList.environmentPopup.forEach(e2 => {
        e2.remove(e2.children[0])
      })
      STATE.sceneList.environmentPopup = []

      STATE.popupEnvironmentList = mockData.sensorExistingList
      if (!STATE.sceneList.environmentPopup.length) {
        API.initEnvironmentPopup()
      }
    } else {
      // getAqjcAqmcList().then(e => {
      //   STATE.sceneList.environmentPopup.forEach(e2 => {
      //     e2.remove(e2.children[0])
      //   })
      //   STATE.sceneList.environmentPopup = []
      //   const existingList = e.list
      //     .map(e2 => STATE.popupEnvironmentList
      //       .find(e3 => e3.id === e2.ssTransducerCode)
      //     ).filter(e2 => e2)


      //   getAqjcAqssList().then(e2 => {
      //     existingList.forEach(e3 => {
      //       const originData = e.list.find(e4 => e4.ssTransducerCode === e3.id)
      //       e3.title = originData.ssTransducerPoint
      //       e3.info.name = originData.ssTransducerName
      //       e3.info.unit = originData.ssAnalogUnit
      //       const data = e2.list.find(e4 => e4.ssTransducerCode === e3.id)
      //       if (data) {
      //         e3.info.value = data.ssAnalogValue
      //       }
      //     })

      //     STATE.popupEnvironmentList = existingList

      //   })
      // })


      (async () => {
        const data1 = await getAqjcAqmcList()
        const data2 = await getAqjcAqssList()
        data1.list.forEach(e => {
          const item = data2.list.find(e2 => e2.csMineCode === e.csMineCode)
          if (item) {
            STATE.sensorData.push(Object.assign(e, item))
          }
        })
      })()
    }


    // 人员 & location
    if ($isOurSite) {
      const personData = { list: mockData.getRysj }
      STATE.sceneList.personPopup.forEach(e => {
        e.remove(e.children[0])
      })
      STATE.sceneList.personPopup = []
      const data = personData.list.reduce((acc, cur) => {
        const locationPosition = STATE.locationPositionPointsArr.find(e => e.name === cur.t6)
        if (locationPosition) {
          // const randomPosition = API.randomPointInQuadrilateral(...locationPosition.value)
          const randomPosition = API.randomPointInLine(...locationPosition.value)
          acc.push({
            name: cur.t1,
            level: Number(cur.t8),
            position: { x: randomPosition[0], y: 0, z: randomPosition[1] },
            user_id: cur.user_id,
            info: {
              title: cur.t6,
              value1: cur.t0,
              value2: STATE.personMap.find(e2 => e2.level == cur.t8).name,
              value3: cur.t2,
              value4: cur.t3,
              value5: cur.t4
            }
          })
        }
        return acc
      }, [])

      STATE.personList = data

      STATE.popupLocationList.forEach(e => {
        e.sub = `工作人员数量: 0 人`
        e.id = 0
        e.regionRate.total = Math.floor(Math.random() * 10 + 90)
        e.regionRate.member = Math.floor(Math.random() * 10 + 90)
        e.regionRate.device = Math.floor(Math.random() * 10 + 90)
        e.regionRate.environment = Math.floor(Math.random() * 10 + 90)
        e.regionRate.manager = Math.floor(Math.random() * 10 + 90)
      })

      if (!STATE.sceneList.personPopup.length) {
        API.initPersonPopup()
      }
      if (!STATE.sceneList.locationPopup.length) {
        API.initLocationPopup()
      }

    } else {
      (async () => {
        const personData = await getRysj().catch(() => {
          return { list: [] }
        })
        STATE.sceneList.personPopup.forEach(e => {
          e.remove(e.children[0])
        })
        STATE.sceneList.personPopup = []
        const data = personData.list.reduce((acc, cur) => {
          const locationPosition = STATE.locationPositionPointsArr.find(e => e.name === cur.t6)
          if (locationPosition) {
            // const randomPosition = API.randomPointInQuadrilateral(...locationPosition.value)
            const randomPosition = API.randomPointInLine(...locationPosition.value)
            acc.push({
              name: cur.t1,
              level: Number(cur.t8),
              position: { x: randomPosition[0], y: 0, z: randomPosition[1] },
              user_id: cur.user_id,
              info: {
                title: cur.t6,
                value1: cur.t0,
                value2: STATE.personMap.find(e2 => e2.level == cur.t8).name,
                value3: cur.t2,
                value4: cur.t3,
                value5: cur.t4
              }
            })
          }
          return acc
        }, [])
        STATE.personList = data

        // 处理location的当前场景人数
        // const locationPersonNum = {}
        // data.forEach(e => {
        //   if (locationPersonNum[e.info.title] != undefined) {
        //     locationPersonNum[e.info.title]++
        //   } else {
        //     locationPersonNum[e.info.title] = 0
        //   }
        // })

        // for (let key in locationPersonNum) {
        //   const location = STATE.popupLocationList.find(e => e.name === key)
        //   if (location) {
        //     location.sub = `工作人员数量: ${locationPersonNum[key]} 人`
        //   }
        // }

        // 获取服务器所有的区域data
        const locationDataOrigin = await getRiskPointList().catch(() => {
          return { list: [] }
        })
        STATE.locationData = locationDataOrigin.list
        STATE.importantLocation.value = locationDataOrigin.list.filter(e => e.keyAreaStatus === '1').map(e => e.pointName)

        // 区域人员数量
        const locationPointOrigin = await getRyPointNum().catch(() => {
          return { list: [] }
        })


        waitForSceneList()
        function waitForSceneList() {
          if (!CACHE?.container?.sceneList?.mkxdw) {
            setTimeout(() => {
              waitForSceneList()
            }, 500)
            return
          }

          // 全部恢复成默认(已采)
          STATE.sceneList.mkxdw.children.forEach(e => {
            const area = e.name.replace(/[^\d]/g, " ").replace(/ /g, '')
            if (STATE.textureOffsetDirection.toLeft.includes(area) || STATE.textureOffsetDirection.toRight.includes(area)) {
              e.material = STATE.statusMaterial.over.clone()
            }
          })

          // 根据接口来配置状态
          locationDataOrigin.list.forEach(e => {
            if (e.pointName.includes('工作面')) {
              const area = e.pointName.replace(/[^\d]/g, " ").replace(/ /g, '')
              const item = STATE.sceneList.mkxdw.children.find(e2 => e2.name.includes(area))

              if (item) {
                if (e.riskPointStatus == '1') {
                  item.visible = false

                } else if (e.riskPointStatus == '2') {
                  if (STATE.textureOffsetDirection.toLeft.includes(area)) {
                    item.material = STATE.statusMaterial.toLeft.clone()
                    STATE.mainSceneTextureAnimateMeshList.toLeft.push(item)

                  } else if (STATE.textureOffsetDirection.toRight.includes(area)) {
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
              location.sub = `工作人员数量: ${pointNumber.numAll} 人`
              location.id = e.belongMine
              location.regionRate.member = pointNumber.regionRisk1
              location.regionRate.device = pointNumber.regionRisk2
              location.regionRate.environment = pointNumber.regionRisk3
              location.regionRate.manager = pointNumber.regionRisk4
              location.regionRate.total = pointNumber.score
            }
          })

        }

        if (!STATE.sceneList.personPopup.length) {
          API.initPersonPopup()
        }
        if (!STATE.sceneList.locationPopup.length) {
          API.initLocationPopup()
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
});

</script>

<template>
  <Scene />
  <router-view></router-view>
  <!-- <SceneChange></SceneChange> -->
  <div v-if="false" style="
          z-index: 2;
          position: fixed;
          left: 50%;
          top: 50%;
          margin:0;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -27%);
        ">

    <div class="location_title" name=${e.name} style="
              background: url('./assets/3d/image/97.png') center / 100% 100% no-repeat;
              width: 24vw;
              height:30vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
          ">
      <div
        style="display: flex; width: 80%; height: 16%;position: absolute; top: 5%;align-items: center; justify-content: space-between;">
        <p class="font-gradient" style="font-size: 2.2vh;flex: 1; text-align: center">设备名</p>
        <p class="font-gradient" style="font-size: 2.2vh;flex: 1; text-align: center">检测地点</p>
        <p class="font-gradient" style="font-size: 2.2vh;flex: 1; text-align: center">监测值</p>
      </div>
      <div
        style="overflow-y: scroll;pointer-events: all;display: flex; flex-direction: column; width: 80%; margin-top: 13%; height: 52%;">
        
        <div style="background-color: #634f8a; border-radius: 5px; margin-bottom: 1vh;display: flex;justify-content: space-between;align-items:center; padding: 0 2%;">
          <p style="word-break: break-all;width: 30%;font-size: 2vh; text-align: left;">111111111</p>
          <p style="word-break: break-all;width: 30%;font-size: 2vh; text-align: left;">22222222</p>
          <p style="word-break: break-all;width: 30%;font-size: 2vh; text-align: left;">3333333</p>
        </div>
      </div>
      <div onclick="CACHE.environmentLocationPopup = this, API.handleLocationBtn(3)"
        style="cursor: pointer;pointer-events: all;background: url('./assets/3d/image/45.png') center / 100% 100% no-repeat; position: absolute; width: 3vh; height: 3vh; right: 5%; top: 6%;">
      </div>
    </div>

    <div style="
            background: url('./assets/3d/image/103.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:13vh;
          ">
    </div>

    <div style="
            background: url('./assets/3d/image/104.png') center / 100% 100% no-repeat;
            width: 7vw;
            height:7vw;
            position: relative;
            top: -6vh;
            animation: myrotate 8s linear infinite;
            scale: 1 0.4;
          ">
    </div>
  </div>
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
