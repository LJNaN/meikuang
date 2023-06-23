<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->

<script setup>
import Scene from '@/views/Scene.vue'
import router from '@/router/index'
import { API } from '@/ktJS/API'
import { onBeforeMount } from 'vue'
import SceneChange from '@/components/sceneChange.vue'

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
  <SceneChange></SceneChange>
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
