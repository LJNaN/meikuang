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
    // 人员 & location

    // 官网假数据
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

        // 区域人员数量
        const locationPointOrigin = await getRyPointNum().catch(() => {
          return { list: [] }
        })

        locationDataOrigin.list.forEach(e => {
          const location = STATE.popupLocationList.find(e2 => e2.name === e.pointName)
          const pointNumber = locationPointOrigin.list.find(e2 => e2.pointId == e.id)
          if (location && pointNumber) {
            location.sub = `工作人员数量: ${pointNumber.numAll} 人`
            location.regionRate.member = pointNumber.regionRisk1
            location.regionRate.device = pointNumber.regionRisk2
            location.regionRate.environment = pointNumber.regionRisk3
            location.regionRate.manager = pointNumber.regionRisk4
            location.regionRate.total = pointNumber.score
          }
        })

        if (!STATE.sceneList.personPopup.length) {
          API.initPersonPopup()
        }
        if (!STATE.sceneList.locationPopup.length) {
          API.initLocationPopup()
        }


      })()
    }


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
      getAqjcAqmcList().then(e => {
        STATE.sceneList.environmentPopup.forEach(e2 => {
          e2.remove(e2.children[0])
        })
        STATE.sceneList.environmentPopup = []
        const existingList = e.list
          .map(e2 => STATE.popupEnvironmentList
            .find(e3 => e3.id === e2.ssTransducerCode)
          ).filter(e2 => e2)


        getAqjcAqssList().then(e2 => {
          existingList.forEach(e3 => {
            const originData = e.list.find(e4 => e4.ssTransducerCode === e3.id)
            e3.title = originData.ssTransducerPoint
            e3.info.name = originData.ssTransducerName
            e3.info.unit = originData.ssAnalogUnit
            const data = e2.list.find(e4 => e4.ssTransducerCode === e3.id)
            if (data) {
              e3.info.value = data.ssAnalogValue
            }
          })

          STATE.popupEnvironmentList = existingList

        })
      })
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
