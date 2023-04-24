<!-- 这个项目是他妈的嵌入到正方形尺寸里面的，我建议你把窗口搞成正方形进行修改 -->
<!-- 这个项目是他妈的嵌入到正方形尺寸里面的，我建议你把窗口搞成正方形进行修改 -->
<!-- 这个项目是他妈的嵌入到正方形尺寸里面的，我建议你把窗口搞成正方形进行修改 -->

<script setup>
import Scene from '@/views/Scene.vue'
import router from '@/router/index'
import { API } from '@/ktJS/API'

// 没卵用
// if (router.currentRoute.value.path != '/') router.push('/')

window.pause3D = (flag) => {
  API.pause3D(flag)
}

</script>

<template>
  <Scene />
  <router-view></router-view>
  <div v-if="false"
    style="position: fixed; display: flex; justify-content: center; align-items: center; z-index: 2; left: 50%; top: 50%;">

    <div style="
            margin:0;
            cursor: pointer;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
          ">

      <div style="
              background: url('./assets/3d/image/40.png') center / 100% 100% no-repeat;
              width: 12vw;
              height:8vw;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            ">
        <p style="position: absolute; top: 24%;font-family: YouSheBiaoTiHei;">1009综采工作面</p>
        <div
          style="width: 75%; height: 34%; margin-top: 24%; display: flex; flex-direction: column; justify-content: space-around;">
          <div style="display: flex; justify-content: space-between;">
            <p style="font-size: 0.85vw">qrwqw</p>
            <p style="font-size: 0.85vw">qrwqw</p>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <p style="font-size: 0.85vw">qrwqw</p>
            <p style="font-size: 0.85vw"> | </p>
            <p style="font-size: 0.85vw">qrwqw</p>
            <p style="font-size: 0.85vw"> | </p>
            <p style="font-size: 0.85vw">qrwqw</p>
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
</style>
