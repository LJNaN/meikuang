<template>
  <div class="home">
    <div v-if="backShow" class="back" @click="back">返回</div>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'

let backShow = ref(false)

function back() {
  API.back()
  backShow.value = false
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
  width: 5vw;
  background: url('/assets/3d/image/4.png') center / 100% 100% no-repeat;
}
</style>
