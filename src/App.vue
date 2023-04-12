<script setup>
import Scene from '@/views/Scene.vue'
import router from '@/router/index'

if (router.currentRoute.value.path != '/') router.push('/')

</script>

<template>
  <Scene />
  <router-view></router-view>
  <div v-if="false" style="position: fixed; display: flex; justify-content: center; align-items: center; z-index: 2; left: 50%; top: 50%;">

    <div style="
        margin:0;
        cursor: pointer;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
      ">

      <div style="
          background: url('./assets/3d/image/15.png') center / 100% 100% no-repeat;
          width: 12vw;
          height:8vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        ">
        <p style="position: absolute; top: 19%;font-family: YouSheBiaoTiHei;">fafas传感器</p>
        <div style="width: 75%; height: 45%; margin-top: 15%; display: flex; flex-direction: column; justify-content: space-around;">
          <p style="font-size: 0.8vw;">fsaf: fasfa</p>
          <p style="font-size: 0.8vw;">fsaf: fasfa</p>
          <p style="font-size: 0.8vw;">fsaf: fasfa</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:global(#app) {
  width: 100vw;
  height: 100vh;
  background-color: #999;
  pointer-events: none;
  color: #FFF;
}
</style>
