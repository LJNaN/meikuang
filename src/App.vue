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
  <div v-if="!true"
    style="position: fixed; display: flex; justify-content: center; align-items: center; z-index: 2; left: 70%; top: 50%;">

    <div style="
          margin:0;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -27%);
        ">

      <div class="location_title" name=${e.name} style="
              background: url('./assets/3d/image/98.png') center / 100% 100% no-repeat;
              width: 24vw;
              height:30vh;
              display: flex;
              padding: 0 8%;
              justify-content: center;
              align-items: center;
          ">
        <div style="display: flex;flex-direction: column;height:60%; width: 40%;align-items: center;">
          <p class="font-gradient" style="text-align: center">设备名</p>
          <div style="pointer-events: all;overflow-y: scroll;pointer-events: all;display: flex; flex-direction: column; width: 100%; height: 75%;align-items: center;">
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">1号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">2号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">3号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">4号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">5号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">6号监控</div>
          </div>
        </div>
        
        <div style="width: 55%;margin-left: 5%; background-color: #164674;height: 40%;margin-top: 5%;">
          <video src="/assets/3d/image/46.mp4" autoplay controls muted loop style="pointer-events: all;width: 100%; height: 100%;"></video>
        </div>
        <div onclick="CACHE.environmentLocationPopup = this, API.handleLocationBtn(4)"
          style="cursor: pointer;pointer-events: all;background: url('./assets/3d/image/45.png') center / 100% 100% no-repeat; position: absolute; width: 3vh; height: 3vh; right: 4%; top: 8%;">
        </div>
      </div>

      <div style="
            background: url('./assets/3d/image/103.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:13vh;
          ">
      </div>

      <div style="
            background: url('./assets/3d/image/104.png') center / 100% 100% no-repeat;
            width: 7vw;
            height:7vw;
            position: relative;
            top: -6vh;
            animation: myrotate 8s linear infinite;
            scale: 1 0.4;
          ">
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
