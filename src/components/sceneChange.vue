<template>
  <div v-show="STATE.startPath === '综合' && showFlag" class="main">
    <div v-for="item in list" class="left-btn publicBtn"
      :style="{ background: 'url(' + './assets/3d/image/' + (active === item.name ? '6' : '5') + '.png' + ') center / 100% 100% no-repeat' }"
      @click="handleLeft(item)">
      {{ item.name }}
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref, watch, getCurrentInstance } from "vue";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()

const list = [{
  name: '人员管理',
  url: '/'
}, {
  name: '重点区域',
  url: '/regionalrisk'
}]

let active = null
if (STATE.currentComprehensivePage) {
  active = STATE.currentComprehensivePage
} else {
  active = ref(list[0].name)
  STATE.currentComprehensivePage = active
}
let showFlag = ref(true)




watch(
  () => router.currentRoute.value,
  (newValue) => {
    showFlag.value = newValue.path === '/comprehensive'
  },
  { immediate: true }
)

console.log('router: ', router);
function handleLeft(e) {
  if (active.value === e.name) {
    // 
  } else {
    active.value = e.name
    STATE.currentComprehensivePage = active
    if (e.name === '重点区域') {
      API.showPopup([
        STATE.sceneList.personPopup,
        STATE.sceneList.monitorPopup,
        STATE.sceneList.baseStationPopup
      ], false)
      // 只显示重点区域，然后隐藏popup1，显示popup2
      STATE.sceneList.locationPopup.forEach(e => {
        e.children[0].visible = false
        STATE.importantLocation.value.forEach(e2 => {
          if (e.name === `location_group_${e2}`) {
            e.children[1].visible = true
          }
        })
      })
    } else {
      API.back('hideRegionalRisk')
    }
    STATE.currentScene[1] = STATE.currentScene[0]
    STATE.currentScene[0] = router.currentRoute.value.path
  }
}
onMounted(() => {

});
</script>



<style scoped>
.main {
  position: absolute;
  width: 10vw;
  height: 30%;
  left: 1%;
  top: 3%;
  z-index: 2;
}

.left-btn {
  height: 5vh;
  margin-bottom: 1vh;
  transform: translateY(-3%);
  width: 100%;
  justify-content: center;
  align-items: center;
}
</style>
