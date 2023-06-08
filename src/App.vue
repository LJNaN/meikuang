<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->

<script setup>
import Scene from '@/views/Scene.vue'
import router from '@/router/index'
import { API } from '@/ktJS/API'
import { onBeforeMount } from 'vue'


onBeforeMount(() => {
  if (location.hash != '#/') {
    router.push('/')
  }
})

window.pause3D = (flag) => {
  API.pause3D(flag)
}

</script>

<template>
  <!-- <img class="bg" src="/assets/3d/image/96.png"> -->
  <Scene />
  <router-view></router-view>
  <div v-if="false"
    style="position: fixed; display: flex; justify-content: center; align-items: center; z-index: 2; left: 50%; top: 50%;">

    <div style="
      pointer-events: all; 
      cursor: pointer;
      margin:0;
      color: #ffffff;
    ">

      <div style="
        position: absolute;
        background: url('./assets/3d/image/44.png') center / 100% 100% no-repeat;
        width: 20vw;
        height: 46vh;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        padding: 3vh 2vw;
      ">
        <p style="font-size: 5vh; font-family: YouSheBiaoTiHei; text-align: center; margin-top: 13%;">设备信息</p>
        <div style="display: flex; flex-direction: column; justify-content: space-around; margin-top: 4%; height: 67%;">
          <div style="display: flex;">
            <p style="font-size: 3vh; color: #7facd4; margin-right: 1vw;">adsdas:</p>
            <p style="font-size: 3vh;">dadsadas</p>
          </div>
          <div style="display: flex;">
            <p style="font-size: 3vh; color: #7facd4; margin-right: 1vw;">adsdas:</p>
            <p style="font-size: 3vh;">dadsadas</p>
          </div>
          <div style="display: flex;">
            <p style="font-size: 3vh; color: #7facd4; margin-right: 1vw;">adsdas:</p>
            <p style="font-size: 3vh;">dadsadas</p>
          </div>
          <div style="display: flex;">
            <p style="font-size: 3vh; color: #7facd4; margin-right: 1vw;">adsdas:</p>
            <p style="font-size: 3vh;">dadsadas</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
:global(#app) {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  pointer-events: none;
  color: #FFF;
}

.bg {
  position: fixed;
  z-index: 5;
  height: 100vh;
  width: 100vw;
}
</style>
