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
          :style="{ background: 'url(' + './assets/3d/image/' + (leftDetailItemIndex === index2 ? '42' : '43') + '.png' + ') center / 100% 100% no-repeat' }"
          @click="handleLeftItem(item2, index2)">
          {{ item2.name }}
        </div>
      </div>

      <!-- 区域评分 -->
      <div v-show="leftDetailShow && leftIndex === 1" class="left-btn-detail detail1">
        <div class="detail1-close" @click="close"></div>
        <p class="detail1-title">区域评分: 96</p>
        <div class="detail1-content">
          <div class="detail1-line"></div>
          <div class="detail1-line"></div>
          <div v-for="item in list2" :key="item.name" class="detail1-content-item">
            <p>{{ item.name }}</p>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <el-badge :value="12" class="alert">
      <SingleActive :options="options1"></SingleActive>
    </el-badge>

    <SingleActive :options="options2"></SingleActive>

    <SingleActive :options="options3"></SingleActive>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'
import SingleActive from '@/components/SingleActive.vue'

const options1 = {
  text: '报警信息',
  style: {
    right: '1%',
    top: '3%',
    width: '10vw',
    height: '5vh'
  }
}

const options2 = {
  text: '场景巡游',
  style: {
    right: '1%',
    top: '9%',
    width: '10vw',
    height: '5vh'
  }
}

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
let environmentShow = ref(false)
let leftDetailShow = ref(false)

function handleLeft(index) {
  if (leftIndex.value === index) {
    leftIndex.value = -1
    leftDetailItemIndex.value = -1
    leftDetailShow.value = false
    environmentShow.value = false
    if (index === 3) {
      environment(false)
    }
  } else {
    leftIndex.value = index
    environment(false)
    if (index === 0) {
      leftDetailItemIndex.value = -1
      leftDetailShow.value = true
    } else if (index === 1) {
      leftDetailShow.value = true
    } else if (index === 2) {
    } else if (index === 3) {
      environmentShow.value = true
      environment(true)
    }
  }
}

function environment(type) {
  if (type) {
    API.showPopup([STATE.sceneList.environmentPopup])
    API.showPopup([STATE.sceneList.personPopup], false)
  } else {
    API.showPopup([STATE.sceneList.environmentPopup], false)
  }
}

window.enterEnvironment = () => {
  environment()
}

function handleLeftItem(item, index) {
  console.log('item: ', item);
  leftDetailItemIndex.value = index
  const child = STATE.popupLocationList.find(e => e.name === item.name)
  if (child) {
    const cameraState = {
      position: { x: child.position.x + 200, y: 200, z: child.position.z + 200 },
      target: { x: child.position.x, y: 20, z: child.position.z }
    }
    API.cameraAnimation({ cameraState })
  }
}

function close() {
  leftIndex.value = -1
  leftDetailItemIndex.value = -1
  leftDetailShow.value = false
}

function back() {
  API.back('hideEnvironment')
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

.alert {
  position: fixed;
  right: 1%;
  top: 3%;
  transform: translateY(-3%);
  width: 10vw;
  height: 5vh;
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

.detail1 {
  position: absolute;
  background: url('/assets/3d/image/44.png') center / 100% 100% no-repeat;
  height: 25vh;
  width: 30vw;
  left: 110%;
}

.detail1-close {
  position: absolute;
  right: 4%;
  top: 12%;
  width: 2vw;
  height: 2vw;
  background: url('/assets/3d/image/45.png') center / 100% 100% no-repeat;
}

.detail1-title {
  position: absolute;
  top: 15%;
  font-size: 2vh;
  font-family: YouSheBiaoTiHei;
}

.detail1-content {
  width: 80%;
  height: 25%;
  position: absolute;
  display: flex;
  justify-content: space-between;
  top: 45%;
}

.detail1-content-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.detail1-content-item p {
  font-size: 1.5vh;
}

.detail1-line {
  position: absolute;
  top: 40%;
  width: 120%;
  left: -10%;
  height: 1px;
  background: linear-gradient(-90deg, rgba(11, 16, 19, 0), rgba(97, 158, 225, 0.88), rgba(91, 175, 227, 0.88), rgba(97, 158, 225, 0.88), rgba(11, 16, 19, 0));
  opacity: 0.5;
}

.detail1-line:nth-child(2) {
  top: 115%;
}


.back {
  position: fixed;
  bottom: 3%;
  right: 1vw;
  height: 5vh;
  width: 10vw;
  background: url('/assets/3d/image/4.png') center / 100% 100% no-repeat;
}

:deep(.el-badge__content.is-fixed) {
  right: auto;
  left: calc(var(--el-badge-size) / 0.5 * -1);
  background-color: #ad1805;
}
</style>
