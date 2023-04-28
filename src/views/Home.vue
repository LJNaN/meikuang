<template>
  <div class="home">

    <div class="control">
      <div v-for="(item, index) in perserList" :key="item" class="control-item" @click="handlePerson(index)">
        <div class="control-icon" :style="{
            background:
              (personShowType.includes(index) ? 'url(./assets/3d/image/' + item.bg[0] + '.png) center / 40% 40% no-repeat,' : '') +
              'url(./assets/3d/image/' + item.bg[1] + '.png) center / 100% 100% no-repeat'
          }"></div>
        {{ item.name }}
      </div>
    </div>

    <alertAndRoam></alertAndRoam>

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
  { name: '全部', bg: ['26', '27'] },
  { name: '重点监管', bg: ['18', '19'] },
  { name: '加强监管', bg: ['20', '21'] },
  { name: '需关注', bg: ['22', '23'] },
  { name: '安全', bg: ['24', '25'] },
]

let personShowType = ref([0, 1, 2, 3, 4])

function handlePerson(index) {
  API.showPerson(index)
  personShowType.value = []
  personShowType.value = STATE.personShowType
}

window.handlePerson = handlePerson


// 本来是进入环境  其实是进入区域风险  名字写错了 但是甲方已经在用这个名字了  不几把管
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
