<template>
  <div class="home">
    <div class="left">
      <div v-for="(item, index) in leftList" :key="item" class="left-btn"
        :style="{ background: 'url(' + './assets/3d/image/' + (leftIndex === index ? '6' : '5') + '.png' + ') center / 100% 100% no-repeat' }"
        @click="handleLeft(index)">
        {{ item }}</div>
    </div>

    <el-badge :value="12" class="alert">
      <SingleActive :options="options1"></SingleActive>
    </el-badge>

    <SingleActive :options="options2"></SingleActive>

    <SingleActive :options="options3"></SingleActive>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import router from '@/router/index'
import SingleActive from '@/components/SingleActive.vue'

const options1 = {
  text: '报警信息',
  style: {
    right: '1%',
    top: '3%',
    width: '10vw',
    height: '5vh'   
  }
}

const options2 = {
  text: '场景巡游',
  style: {
    right: '1%',
    top: '9%',
    width: '10vw',
    height: '5vh'   
  }
}

const options3 = {
  text: '返回',
  style: {
    right: '1%',
    width: '10vw',
    height: '5vh',
    bottom: '3%',
    top: 'auto'
  },
  bgimg: [17, 16],
  cb: back
}

let leftList = ['重点区域', '区域评分', '视频监控', '环境信息']
let leftIndex = ref(-1)

function handleLeft(index) {
  if (leftIndex.value === index) {
    leftIndex.value = -1
  } else {
    leftIndex.value = index
  }
}

function back() {
  API.back('hideEnvironment')
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

.alert {
  position: fixed;
  right: 1%;
  top: 3%;
  transform: translateY(-3%);
  width: 10vw;
  height: 5vh;
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
