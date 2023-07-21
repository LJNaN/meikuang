<template>
  <div class="comprehensive">
    <SceneChange></SceneChange>
    <Home v-if="pageName === '人员管理'"></Home>
    <RegionalRisk v-if="pageName === '重点区域'"></RegionalRisk>
  </div>
</template>


<script setup>
import { onMounted, ref, getCurrentInstance, watch } from "vue";
import { STATE } from '@/ktJS/STATE'

import Home from '@/views/Home.vue'
import RegionalRisk from '@/views/RegionalRisk.vue'
import SceneChange from '@/components/sceneChange.vue'
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()

let pageName = ref('')

onMounted(() => {
  watch(
    () => STATE.currentComprehensivePage.value,
    (newVal) => {
      pageName.value = newVal
    }, {
      immediate: true,deep:true
    }
  )
})

</script>



<style scoped>
.comprehensive {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
}
</style>
