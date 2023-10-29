<template>
  <div class="left-btn publicBtn" :style="{
    background: 'url(' + './assets/3d/image/' + (detailShow ? '6' : '5') + '.png' + ') center / 100% 100% no-repeat',
    cursor: STATE.allowControl.value ? 'pointer' : 'wait'
  }" @click="handleLeft">
    区域人员
  </div>

  <div v-show="detailShow" class="detail">
    <div class="close" @click="handleClose"></div>

    <div class="title">
      <p class="title-left">人员信息详情</p>
      <div class="title-right">
        <img src="/assets/3d/image/65.png">
        <p>{{ sceneName }}</p>
      </div>
    </div>

    <el-scrollbar class="wrap">
      <div class="item" v-for="item in list">
        <div class="item1">{{ item.name }}</div>
        <div class="item2" :style="{
          color:
            item.info.value2 === '重点监管' ? '#b01e1e' :
              item.info.value2 === '加强监管' ? '#c17f26' :
                item.info.value2 === '需关注' ? '#c1be26' :
                  item.info.value2 === '安全' ? '#356cb0' : '#FFFFFF'
        }">{{ item.info.value2 }}</div>
        <div class="item3">{{
          (item.info.value3 || '')
          + (item.info.value5 ? (' | ' + item.info.value5) : '')
          + (item.info.value4 ? (' | ' + item.info.value4) : '') }}
        </div>
        <div class="line"></div>
      </div>
    </el-scrollbar>
  </div>
</template>


<script setup>
import { onMounted, ref, computed, reactive, watch, getCurrentInstance } from "vue";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()
// const props = defineProps(["options"])
// const options = props.options

let detailShow = ref(false)

function handleLeft() {
  if (!STATE.allowControl.value) {
    return
  }
  detailShow.value = !detailShow.value
}


const sceneName = STATE.currentScene[0]
let list = []
if ($isOurSite) {
  list = STATE.personAllUsefulList
} else {
  list = STATE.personAllUsefulList.filter(e => e.info.title === sceneName)
}

function handleClose() {
  detailShow.value = false
}

onMounted(() => {

});
</script>



<style scoped>
.left-btn {
  position: fixed;
  flex-direction: column;
  left: 1%;
  top: 3%;
  height: 5vh;
  transform: translateY(-3%);
  width: 10vw;
  justify-content: center;
  align-items: center;
}

.detail {
  pointer-events: all;
  position: fixed;
  left: 11%;
  top: 2%;
  height: 40vh;
  width: 41vw;
  background: url('/assets/3d/image/64.png') center / 100% 100% no-repeat;

}

.title {
  width: 86%;
  height: 14%;
  margin: 10% auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-left {
  font-family: YouSheBiaoTiHei;
  font-size: 4vh;
}

.title-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 5%;
}

.title-right img {
  width: 10%;
  margin-right: 0.5vw;
}

.title-right p {
  font-size: 1.4vh;
}

.wrap {
  width: 86%;
  height: 54%;
  margin: 2% auto 0 auto;
}

.item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 5vh;
  padding: 1vh 0;
}

.item1 {
  flex: 4;
}

.item2 {
  flex: 3;
}

.item3 {
  flex: 11;
}

.close {
  cursor: pointer;
  position: absolute;
  top: 12.2%;
  right: 4%;
  width: 5%;
  height: 10%;
  background: url('/assets/3d/image/45.png') center / 100% 100% no-repeat;
}

.line {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(-90deg, rgba(11, 16, 19, 0), rgba(97, 158, 225, 0.88), rgba(91, 175, 227, 0.88), rgba(97, 158, 225, 0.88), rgba(11, 16, 19, 0));
  opacity: 0.5;
}
</style>
