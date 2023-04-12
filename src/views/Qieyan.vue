<template>
  <div class="home">
    <div class="back" @click="back">返回</div>
    <div
      class="back animationFlag"
      @click="handleAnimationFlag"
      :style="{ background: 'url(' + './assets/3d/image/' + (animationFlag ? '17' : '16') + '.png' + ') center / 100% 100% no-repeat' }"
      >{{ animationFlag ? '关闭' : '开启' }}模拟作业</div>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'

let animationFlag = ref(true)

function back() {
  API.back()
  router.push('/')
}

function handleAnimationFlag() {
  animationFlag.value = !animationFlag.value
  STATE.animationFlag = animationFlag.value
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
  bottom: 10vh;
  right: 5vw;
  height: 5vh;
  width: 10vw;
  background: url('/assets/3d/image/4.png') center / 100% 100% no-repeat;
}

.animationFlag {
  bottom: 20vh;
  padding-left: 0;
  letter-spacing: 0;
}
</style>
