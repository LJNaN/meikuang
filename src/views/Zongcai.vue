<template>
  <div class="home">
    <PersonInfo></PersonInfo>
    <SingleActive :options="options1"></SingleActive>
    <SingleActive :options="options2"></SingleActive>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'
import SingleActive from "@/components/SingleActive.vue";
import PersonInfo from "@/components/personInfo.vue";

let animationFlag = ref(true)

function back() {
  API.back('zongcai')
  router.push('/')
}

function handleAnimationFlag() {
  animationFlag.value = !animationFlag.value
  STATE.animationFlag = animationFlag.value
  options1.text = (animationFlag.value ? '关闭' : '开启') + '模拟作业'
}

const options2 = {
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

const options1 = {
  text: (animationFlag.value ? '关闭' : '开启') + '模拟作业',
  style: {
    right: '1%',
    width: '10vw',
    height: '5vh',
    bottom: '9%',
    top: 'auto'
  },
  active: true,
  cb: handleAnimationFlag
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
</style>
