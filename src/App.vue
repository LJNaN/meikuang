<script setup>
import Scene from '@/views/Scene.vue'
import router from '@/router/index'

if(router.currentRoute.value.path != '/') router.push('/')

</script>

<template>
  <Scene/>
  <router-view></router-view>
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
