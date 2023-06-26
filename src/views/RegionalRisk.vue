<template>
  <div class="home">
    <div class="left">
      <div v-for="(item, index) in leftList" :key="item.name" class="left-btn"
        :style="{ background: 'url(' + './assets/3d/image/' + (leftName === item ? '94' : '95') + '.png' + ') center / 100% 100% no-repeat' }"
        @click="handleLeft(item, index)">
        {{ item }}
      </div>
    </div>

    <alertAndRoam type="regionalRisk"></alertAndRoam>
  </div>
</template>


<script setup>
import { onMounted, ref, watch } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import { CACHE } from '@/ktJS/CACHE'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'
import SingleActive from '@/components/SingleActive.vue'
import alertAndRoam from '@/components/alertAndRoam.vue'


const leftList = STATE.importantLocation
let leftName = ref('')
STATE.currentRegionalriskLeftLocation = leftName

function handleLeft(item, index) {
  // 取消透明
  STATE.sceneList.locationPopup.forEach(e => {
    API.opacityPopup(e.children[1], false)
  })
  STATE.sceneList.environmentPopup.forEach(e => {
    API.opacityPopup(e.children[0], false)
  })

  // 取消高亮
  if (leftName.value === item) {
    leftName.value = ''

    const cameraState = {
      position: STATE.initialState.position,
      target: STATE.initialState.target,
    }
    API.cameraAnimation({ cameraState })

  } else { // 高亮
    leftName.value = item

    const child = STATE.popupLocationList.find(e => e.name === item)

    if (child) {
      // 移动镜头
      const cameraState = {
        position: { x: child.position.x + 200, y: 200, z: child.position.z + 200 },
        target: { x: child.position.x, y: 20, z: child.position.z }
      }
      API.cameraAnimation({ cameraState })

      // 其他标签透明化
      const itemIndex = STATE.sceneList.locationPopup.findIndex(e => e.name === ('location_group_' + child.name))
      if (itemIndex >= 0) {
        STATE.sceneList.locationPopup.forEach((e, index) => {
          if (itemIndex === index) {
            API.opacityPopup(e.children[1], false)
          } else {
            API.opacityPopup(e.children[1], true)
          }
        })
      }
    }
  }
}



onMounted(() => {

});
</script>



<style scoped>
.home {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
}

.left {
  position: fixed;
  display: flex;
  flex-direction: column;
  left: 10%;
  top: 10%;
  transform: translateY(-3%);
  width: 10vw;
}

.left-btn {
  position: relative;
  pointer-events: all;
  cursor: pointer;
  width: 170%;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.2vh;
}

.left-btn-detail {
  cursor: pointer;
  pointer-events: all;
  position: absolute;
  width: 15vw;
  left: 90%;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-btn-detail-item {
  width: 100%;
  height: 4vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8vh;
}

.back {
  position: fixed;
  bottom: 3%;
  right: 1vw;
  height: 5vh;
  width: 10vw;
  background: url('/assets/3d/image/4.png') center / 100% 100% no-repeat;
}
</style>
