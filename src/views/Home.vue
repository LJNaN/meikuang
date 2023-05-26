<template>
  <div class="home">

    <div class="control">
      <div v-for="(item, index) in perserList" :key="item" class="control-item" @click="handlePerson(index)">
        <div class="control-icon" :style="{
          background:
            personShowType.includes(index)
              ? 'url(./assets/3d/image/' + item.bg[2] + '.png) center / 100% 100% no-repeat'
              : 'url(./assets/3d/image/' + item.bg[1] + '.png) center / 100% 100% no-repeat'
        }"></div>
        {{ item.name }}
      </div>
    </div>

    <alertAndRoam type="home"></alertAndRoam>

    <div class="regionalRisk publicBtn" @click="showRegionalRisk">显示区域风险</div>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'
import alertAndRoam from '@/components/alertAndRoam.vue'
import { getRysj, getAqjcAqmcList, getAqjcAqssList } from '@/axios/api'

// 获取数据
{
  getRysj().then(e => {
    STATE.sceneList.personPopup = []
    const data = e.list.reduce((acc, cur) => {
      acc.push({
        name: cur.t1,
        level: Number(cur.t8),
        position: { x: Math.random() * 1000 - 500, y: 0, z: Math.random() * 1000 - 500 },
        info: {
          title: cur.t6,
          value1: cur.t0,
          value2: STATE.personMap.find(e2 => e2.level == cur.t8).name,
          value3: cur.t2,
          value4: cur.t3,
          value5: cur.t4
        }
      })
      return acc
    }, [])
    STATE.personList = data
    API.initPersonPopup()
  })


  getAqjcAqmcList().then(e => {
    STATE.sceneList.environmentPopup = []
    const existingList = e.list
      .map(e2 => STATE.popupEnvironmentList
        .find(e3 => e3.id === e2.ssTransducerCode)
      ).filter(e2 => e2)


    getAqjcAqssList().then(e2 => {
      existingList.forEach(e3 => {
        const originData = e.list.find(e4 => e4.ssTransducerCode === e3.id)
        e3.title = originData.ssTransducerPoint
        e3.position = { x: Math.random() * 1000 - 500, y: 0, z: Math.random() * 1000 - 500 }
        e3.info.name = originData.ssTransducerName
        e3.info.unit = originData.ssAnalogUnit
        const data = e2.list.find(e4 => e4.ssTransducerCode === e3.id)
        if (data) {
          e3.info.value = data.ssAnalogValue
        }
      })

      STATE.popupEnvironmentList = existingList
      API.initEnvironmentPopup()
    })
  })
}


function showRegionalRisk() {
  API.showPopup([
    STATE.sceneList.personPopup,
    STATE.sceneList.monitorPopup,
    STATE.sceneList.baseStationPopup
  ], false)
  API.showPopup([STATE.sceneList.locationPopup])
  router.push('/regionalrisk')
}

const perserList = [
  { name: '全部', bg: ['26', '27', '82'] },
  { name: '重点监管', bg: ['18', '19', '78'] },
  { name: '加强监管', bg: ['20', '21', '79'] },
  { name: '需关注', bg: ['22', '23', '80'] },
  { name: '安全', bg: ['24', '25', '81'] },
]

let personShowType = ref([0, 1, 2, 3, 4])

function handlePerson(index) {
  API.showPerson(index)
  personShowType.value = []
  personShowType.value = STATE.personShowType
}

window.handlePerson = handlePerson


// 进入环境  其实是进入区域风险  名字写错了 但是甲方已经在用这个名字了  不几把管
window.enterEnvironment = () => {
  showRegionalRisk()
}



onMounted(() => {

});
</script>



<style scoped>
.home {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
}

.control {
  position: absolute;
  left: 3%;
  top: 3%;
  width: 15vw;
  height: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.control-item {
  pointer-events: all;
  cursor: pointer;
  font-family: YouSheBiaoTiHei;
  font-size: 1.8vh;
  display: flex;
  align-items: center;
}

.control-icon {
  width: 2vw;
  height: 2vw;
  display: inline-block;
  margin-right: 0.5vw;
}

.regionalRisk {
  position: fixed;
  bottom: 3%;
  right: 1vw;
  height: 5vh;
  width: 10vw;
  background: url('/assets/3d/image/5.png') center / 100% 100% no-repeat;
}
</style>
