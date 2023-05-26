<template>
  <div class="home">
    <div class="left">
      <div v-for="(item, index) in leftList" :key="item.name" class="left-btn"
        :style="{ background: 'url(' + './assets/3d/image/' + (leftIndex === index ? '6' : '5') + '.png' + ') center / 100% 100% no-repeat' }"
        @click="handleLeft(index)">
        {{ item }}
      </div>

      <!-- 重点区域 -->
      <div v-show="leftDetailShow && leftIndex === 0" class="left-btn-detail">
        <div v-for="(item2, index2) in list1" :key="index2" class="left-btn-detail-item"
          :style="{ background: 'url(' + './assets/3d/image/' + (leftDetailItemIndex === index2 ? '94' : '95') + '.png' + ') center / 100% 100% no-repeat' }"
          @click="handleLeftItem(item2, index2)">
          {{ item2.name }}
        </div>
      </div>
    </div>


    <alertAndRoam type="regionalRisk"></alertAndRoam>

    <SingleActive :options="options3"></SingleActive>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import { CACHE } from '@/ktJS/CACHE'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'
import SingleActive from '@/components/SingleActive.vue'
import alertAndRoam from '@/components/alertAndRoam.vue'

const options3 = {
  text: '返回',
  style: {
    right: '1%',
    width: '10vw',
    height: '5vh',
    bottom: '3%',
    top: 'auto'
  },
  bgimg: [17, 16],
  cb: back
}

let leftList = ['重点区域', '区域评分', '视频监控', '环境信息']

const list1 = [
  { name: '501综采工作面', value: '111' },
  { name: '627综采工作面', value: '111' },
  { name: '1010切眼', value: '111' },
  { name: '634进风顺槽', value: '111' },
  { name: '632回风顺槽', value: '111' },
  { name: '820进风顺槽', value: '111' },
  { name: '1000回风顺槽', value: '111' },
  { name: '1012进风顺槽', value: '111' },
  { name: '1012进风顺槽(反掘)', value: '111' }
]

const list2 = [
  { name: '人员', value: '97' },
  { name: '设备', value: '95' },
  { name: '环境', value: '94' },
  { name: '管理', value: '100' }
]

let leftIndex = ref(-1)
let leftDetailItemIndex = ref(-1)
let leftDetailShow = ref(false)

function handleLeft(index) {
  // 取消透明
  STATE.sceneList.locationPopup.forEach(e => {
    API.opacityPopup(e.children[0], false)
  })
  STATE.sceneList.environmentPopup.forEach(e => {
    API.opacityPopup(e.children[0], false)
  })

  // 取消高亮
  if (leftIndex.value === index) {
    if (index === 0) {
      showFlag('location', false)
    } else if (index === 1) {
      showFlag('location', false)
      CACHE.regionalRateMode = false
    } else if (index === 2) {
      showFlag('monitor', false)
    } else if (index === 3) {
      showFlag('environment', false)
    }
    leftIndex.value = -1
    leftDetailItemIndex.value = -1
    leftDetailShow.value = false

  } else { // 高亮
    leftIndex.value = index
    CACHE.regionalRateMode = false

    if (index === 0) {
      leftDetailItemIndex.value = -1
      leftDetailShow.value = true
      showFlag('location', true)

    } else if (index === 1) {
      leftDetailShow.value = true
      showFlag('location', true)
      CACHE.regionalRateMode = true

    } else if (index === 2) {
      showFlag('monitor', true)

    } else if (index === 3) {
      showFlag('environment', true)
    }
  }
}

function showFlag(type, flag) {
  if (type === 'environment') {
    if (flag) {
      API.showPopup([STATE.sceneList.environmentPopup])
      API.showPopup([
        STATE.sceneList.personPopup,
        STATE.sceneList.monitorPopup,
        STATE.sceneList.locationPopup
      ], false)

      // 显示超标的
      STATE.sceneList.environmentPopup.forEach(e => {
        if(e.userData.isExceeding) {
          e.userData.initDetailPopup()
        }
      })
      

    } else {
      API.showPopup([STATE.sceneList.environmentPopup], false)
    }

  } else if (type === 'monitor') {
    if (flag) {
      API.showPopup([STATE.sceneList.monitorPopup])
      API.showPopup([
        STATE.sceneList.personPopup,
        STATE.sceneList.environmentPopup,
        STATE.sceneList.locationPopup
      ], false)
    } else {
      API.showPopup([STATE.sceneList.monitorPopup], false)
    }

  } else if (type === 'location') {
    if (flag) {
      API.showPopup([STATE.sceneList.locationPopup])
      API.showPopup([
        STATE.sceneList.personPopup,
        STATE.sceneList.environmentPopup,
        STATE.sceneList.monitorPopup
      ], false)
    } else {
      API.showPopup([STATE.sceneList.locationPopup], false)
    }
  }
}

function handleLeftItem(item, index) {
  // 如果已经有点击
  if (leftDetailItemIndex.value === index) {
    leftDetailItemIndex.value = -1
    STATE.sceneList.locationPopup.forEach(e => {
      API.opacityPopup(e.children[0], false)
    })
  } else {
    leftDetailItemIndex.value = index
    const child = STATE.popupLocationList.find(e => e.name === item.name)
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
            API.opacityPopup(e.children[0], false)
          } else {
            API.opacityPopup(e.children[0], true)
          }
        })
      }
    }
  }

}

function back() {
  API.back('hideRegionalRisk')
  router.push('/')
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
  left: 1%;
  top: 3%;
  transform: translateY(-3%);
  width: 10vw;
}

.left-btn {
  position: relative;
  pointer-events: all;
  cursor: pointer;
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5vh;
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
