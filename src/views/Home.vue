<template>
  <div class="home">

    <div class="control">
      <div v-for="item in controlList" :key="item" class="control-item">
        <div class="control-icon" :style="{
          background:
            'url(./assets/3d/image/' + item.bg[0] + '.png) center / 40% 40% no-repeat,' + 
            'url(./assets/3d/image/' + item.bg[1] + '.png) center / 100% 100% no-repeat'
        }"></div>
        {{ item.name }}
      </div>
    </div>

    <el-badge :value="12" class="right"
      :style="{ background: 'url(' + './assets/3d/image/' + (alertActive ? '6' : '5') + '.png' + ') center / 100% 100% no-repeat' }"
      @click="handleAlert">
      报警信息
    </el-badge>

    <div class="right xunyou"
      :style="{ background: 'url(' + './assets/3d/image/' + (xunyouActive ? '6' : '5') + '.png' + ') center / 100% 100% no-repeat' }"
      @click="handleXunyou">
      场景巡游
    </div>

    <div class="environment" @click="environment">显示环境信息</div>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'

let xunyouActive = ref(false)
let alertActive = ref(false)

function handleAlert() {
  alertActive.value = !alertActive.value
}

function handleXunyou() {
  xunyouActive.value = !xunyouActive.value
}

function environment() {
  router.push('/quyufengxian')
  API.showPopup([STATE.sceneList.environmentPopup])
}

const controlList = [
  { name: '全部', bg: ['26', '27'] },
  { name: '重点管控', bg: ['18', '19'] },
  { name: '加强', bg: ['20', '21'] },
  { name: '一般', bg: ['22', '23'] },
  { name: '日常', bg: ['24', '25'] },
]

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
  cursor: pointer;
  font-family: YouSheBiaoTiHei;
  font-size: 1.8vw;
  display: flex;
  align-items: center;
}

.control-icon {
  width: 2vw;
  height: 2vw;
  display: inline-block;
  margin-right: 0.5vw;
}

.environment {
  pointer-events: all;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 3%;
  right: 1vw;
  height: 5vh;
  width: 10vw;
  background: url('/assets/3d/image/4.png') center / 100% 100% no-repeat;
}

.right {
  position: fixed;
  right: 1%;
  top: 3%;
  transform: translateY(-3%);
  width: 10vw;
  pointer-events: all;
  cursor: pointer;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.xunyou {
  top: 8.5vh;
}

/deep/ .el-badge__content.is-fixed {
  right: auto;
  left: calc(var(--el-badge-size) / 0.5 * -1);
  background-color: #ad1805;
}
</style>
