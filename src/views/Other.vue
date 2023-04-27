<template>
  <div class="home">
    <PersonInfo></PersonInfo>
    <SingleActive :options="options1"></SingleActive>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import { API } from '@/ktJS/API'
import router from '@/router/index'
import SingleActive from "@/components/SingleActive.vue";
import PersonInfo from "@/components/personInfo.vue";




function back() {
  API.back()
  router.push('/')
}

const options1 = {
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
