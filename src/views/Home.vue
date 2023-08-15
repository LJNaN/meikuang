<template>
  <div class="home">

    <div class="control" :style="{ left: STATE.startPath === '综合' ? '13%' : '3%' }">
      <div v-for="(item, index) in perserList" :key="item" class="control-item" @click="handlePerson(index)"
        :style="{ cursor: STATE.allowControl.value ? 'pointer' : 'wait' }">
        
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
  </div>
</template>


<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'
import alertAndRoam from '@/components/alertAndRoam.vue'
import { CACHE } from "@/ktJS/CACHE";
import { mockData } from "@/axios/mockdata"
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()

const perserList = [
  { name: '全部', bg: ['26', '27', '82'] },
  { name: '重点监管', bg: ['18', '19', '78'] },
  { name: '加强监管', bg: ['20', '21', '79'] },
  { name: '需关注', bg: ['22', '23', '80'] },
  { name: '安全', bg: ['24', '25', '81'] },
]

// 显示除了安全的
let personShowType = ref(STATE.personShowType)

function handlePerson(index) {
  if (!STATE.allowControl.value) {
    return
  }
  API.showPerson(index)
  personShowType.value = []
  personShowType.value = STATE.personShowType
}

window.handlePerson = handlePerson

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
  top: 3%;
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
