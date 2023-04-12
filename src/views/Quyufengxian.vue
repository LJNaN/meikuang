<template>
  <div class="home">
    <div class="left">
      <div v-for="(item, index) in leftList" :key="item" class="left-btn"
        :style="{ background: 'url(' + './assets/3d/image/' + (leftIndex === index ? '6' : '5') + '.png' + ') center / 100% 100% no-repeat' }"
        @click="handleLeft(index)">
        {{ item }}</div>
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

    <div class="back" @click="back">返回</div>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import router from '@/router/index'

let xunyouActive = ref(false)
let alertActive = ref(false)
let leftList = ['重点区域', '区域评分', '视频监控', '环境信息']
let leftIndex = ref(-1)

function handleLeft(index) {
  if (leftIndex.value === index) {
    leftIndex.value = -1
  } else {
    leftIndex.value = index
  }
}


function handleAlert() {
  alertActive.value = !alertActive.value
}

function handleXunyou() {
  xunyouActive.value = !xunyouActive.value
}

function back() {
  router.push('/')
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

.left {
  position: fixed;
  display: flex;
  flex-direction: column;
  left: 1%;
  top: 3%;
  transform: translateY(-3%);
  width: 10vw;
}

.left-btn {
  pointer-events: all;
  cursor: pointer;
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5vh;
}


.back {
  pointer-events: all;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-left: 0.6rem;
  letter-spacing: 0.6rem;
  position: fixed;
  bottom: 3%;
  right: 1vw;
  height: 5vh;
  width: 10vw;
  background: url('/assets/3d/image/4.png') center / 100% 100% no-repeat;
}

/deep/ .el-badge__content.is-fixed {
  right: auto;
  left: calc(var(--el-badge-size) / 0.5 * -1);
  background-color: #ad1805;
}
</style>
