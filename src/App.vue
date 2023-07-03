<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->
<!-- 这个项目是他妈的嵌入到1018 562尺寸里面的，我建议你把窗口搞成1018 562进行修改 -->

<script setup>
import Scene from '@/views/Scene.vue'
import router from '@/router/index'
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import { onBeforeMount } from 'vue'
import SceneChange from '@/components/sceneChange.vue'

onBeforeMount(() => {
  if (location.hash === '#/regionalrisk') {
    STATE.isJumpToRegionalrisk = true
  }
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
  <div v-if="false" style="position: fixed; right: 0%; top: 20%; width: 30%; height: 100%; z-index: 2;">
    <div style="
            margin:0;
            cursor: pointer;
            pointer-events: all;
            color: #ffffff;
            position: relative;
            left: 0;
            top: -9vh;
            transform: translate(-50%, 0%);
          ">

      <div style="
            position: absolute;
            background: url('./assets/3d/image/${map.img[1]}.png') center / 100% 100% no-repeat;
            width: 26vw;
            height:5.4vh;
            left: 0.5vw;
            top: -5.5vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 0.3vh;
            font-family: YouSheBiaoTiHei;
          ">
        <p style="
              pointer-events: none;
              display: inline;
              text-align: center;
              min-width: 15vw;
              font-size: 4vh;">${map.name}</p>
      </div>

      <div style="
            background: url('./assets/3d/image/${map.img[2]}.png') center / 100% 100% no-repeat;
            min-width: 220px;
            width: 28vw;
            height:24vh;
            position: absolute;
            top: -0.5vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
        <p style="position: absolute; top: 20%;font-family: YouSheBiaoTiHei;font-size:3.3vh;">${e.info.title}</p>
        ${importanValue}
        <div
          style="width: 75%; height: 34%; margin-top: 2%; display: flex; flex-direction: column; justify-content: space-around;">
          <div style="display: flex; justify-content: space-between;">
            <p style="font-size: 1vw">${e.name}</p>
            <p style="font-size: 1vw">工号:${e.info.value1}</p>
          </div>
        </div>
        <button
          onclick="window.location.href='http://localhost:8181/hlyk/workline/big-screen-humandraw-page/${e.user_id}'"
          style="position: absolute; right: 15%;bottom: 20%; height: 12%;width: 20%;">详情</button>
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
