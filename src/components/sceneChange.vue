<template>
  <div v-show="showFlag" class="main">
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

let active = ref(list[0].name)
let showFlag = ref(true)

// 首页跳到环境页
if (STATE.isJumpToRegionalrisk) {
  jumpToRegionalrisk()

  function jumpToRegionalrisk() {
    if (router.currentRoute.value.path != '/regionalrisk') {
      if (STATE.sceneList.locationPopup.length) {
        handleLeft(list[1])
      } else {
        setTimeout(() => {
          jumpToRegionalrisk()
        }, 500)
      }
    }
  }
}


watch(
  () => router.currentRoute.value,
  (newValue) => {
    showFlag.value = newValue.path === '/' || newValue.path === '/regionalrisk'
  },
  { immediate: true }
)

function handleLeft(e) {
  if (active.value === e.name) {
    // 
  } else {
    active.value = e.name
    if (e.name === '重点区域') {
      API.showPopup([
        STATE.sceneList.personPopup,
        STATE.sceneList.monitorPopup,
        STATE.sceneList.baseStationPopup
      ], false)
      // 只显示重点区域，然后隐藏popup1，显示popup2
      STATE.sceneList.locationPopup.forEach(e => {
        e.children[0].visible = false
        STATE.importantLocation.forEach(e2 => {
          if (e.name === `location_group_${e2}`) {
            e.children[1].visible = true
          }
        })
      })
      STATE.currentScene[1] = STATE.currentScene[0]
      STATE.currentScene[0] = '/regionalrisk'
      router.push(e.url)

    } else {
      API.back('hideRegionalRisk')
      router.push(e.url)
    }
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
