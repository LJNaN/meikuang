<template>
  <div v-if="list.length" class="left-btn publicBtn" :style="{
    background: 'url(' + './assets/3d/image/' + (detailShow ? '6' : '5') + '.png' + ') center / 100% 100% no-repeat',
    cursor: STATE.allowControl.value ? 'pointer' : 'wait'
  }" @click="handleDeviceDetail">
    设备工况
  </div>

  <div v-show="detailShow" class="detail">
    <div class="close" @click="handleClose"></div>

    <div class="title">
      <p class="title-center">设备列表</p>
      <div class="title-right">
        <img src="/assets/3d/image/65.png">
        <p>{{ sceneName }}</p>
      </div>
    </div>

    <el-scrollbar v-show="!detailShow2" class="scroll">
      <div class="wrap">
        <div class="item" v-for="item in list" @click="handleDetailItem(item)">{{ item }}</div>
      </div>
    </el-scrollbar>


    <div v-show="detailShow2" class="detail2">
      <div class="detail2-list" v-for="item in detail2">
        <p class="detail2-list-name">{{ item.name }}</p>
        <el-scrollbar class="detail2-list-wrap">
          <div class="detail2-list-item" v-for="(item2, index2) in item.data">
            <p>{{ item2.name }}</p>
            <p class="detail-list-status" v-if="item2.value === '开启' || item2.value === '关闭'"
              :style="{ backgroundColor: item2.value === '开启' ? '#63fd01' : '#fa1416' }">
              {{ item2.value }}</p>
            <p v-else>{{ item2.value }}</p>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref, computed, reactive, watch, getCurrentInstance } from "vue";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'
import { getEquipmentInfoDetailLayer, getEquipmentInfoLayer, getEquipmentListLayer } from '@/axios/api'
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()

let detailShow = ref(false)
let detailShow2 = ref(false)

function handleDeviceDetail() {
  if (!STATE.allowControl.value) {
    return
  }
  detailShow.value = !detailShow.value
}


const sceneName = STATE.currentScene[0]
const list = ref([])
const detail2 = ref([])
const equipmentList = ref([])




function handleClose() {
  if (detailShow2.value) {
    detailShow2.value = false
  } else {
    detailShow.value = false
  }
}


onMounted(async () => {
  const scene = STATE.popupLocationList.find(e => e.name === sceneName)
  if (!scene) return

  const res = await getEquipmentListLayer({ pointId: scene.id })
  if (!res?.list) return

  equipmentList.value = res.list
  list.value = res.list.sort((a, b) => {
    return a.equipmentOrder - b.equipmentOrder
  }).map(e => e.equipmentName)
  
})

async function handleDetailItem(item) {
  const equipmentItem = equipmentList.value.find(e => e.equipmentName === item)
  if (!equipmentItem) return

  detail2.value = []
  detailShow2.value = true
  const scene = STATE.popupLocationList.find(e => e.name === sceneName)

  const res = await getEquipmentInfoLayer({
    pointId: scene.id,
    equipmentOrder: equipmentItem.equipmentOrder
  })

  if (res?.infoList.length) {
    res.infoList.forEach(async e => {
      detail2.value.push({
        name: e.equipmentInfoName,
        data: []
      })

      const res2 = await getEquipmentInfoDetailLayer({
        pointId: scene.id,
        equipmentOrder: equipmentItem.equipmentOrder,
        equipmentInfoOrder: e.equipmentInfoOrder
      })
      const thisItem = detail2.value.find(e2 => e2.name === e.equipmentInfoName)
      if (!thisItem) return

      res2.infoDetailList.forEach(e2 => {
        thisItem.data.push({
          name: e2.monitorName,
          value: e2.value + e2.unitName
        })
      })
    })

  } else if (res?.infoDetailList.length) {
    detail2.value.push({
      name: equipmentItem.equipmentName,
      data: []
    })

    res.infoDetailList.forEach(e => {

      const thisItem = detail2.value.find(e2 => e2.name === equipmentItem.equipmentName)
      if (!thisItem) return

      thisItem.data.push({
        name: e.monitorName,
        value: e.value + e.unitName
      })
    })
  }

}

</script>



<style scoped>
.left-btn {
  position: fixed;
  flex-direction: column;
  left: 13%;
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
  left: 15%;
  top: 20%;
  height: 60vh;
  width: 70vw;
  background: url('/assets/3d/image/117.png') center / 100% 100% no-repeat;

}

.title {
  position: relative;
  width: 100%;
  margin: 8vh auto 0 auto;
  display: flex;
  align-items: center;
}

.title-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: YouSheBiaoTiHei;
  font-size: 3vh;
}

.title-right {
  position: absolute;
  right: 0;
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

.scroll {
  position: absolute;
  width: 90%;
  height: 100%;
  left: 5%;
  top: 18%;
  height: 75%;
}

.wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.item {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12vw;
  margin: 0 0 1% 0.95%;
  height: 5vh;
  font-size: 1.6vh;
  background: url('/assets/3d/image/120.png') center / 100% 100% no-repeat;
}

.detail2 {
  position: absolute;
  width: 100%;
  top: 18%;
  height: 75%;
  padding: 0 5%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow-y: scroll;
}

.detail2-list {
  position: relative;
  background: url('/assets/3d/image/118.png') center / 100% 100% no-repeat;
  width: 25%;
  display: flex;
  flex-direction: column;
  padding: 2% 2%;
  height: 65%;
  margin-top: 5%;
}

.detail2-list-item {
  position: relative;
  margin-top: 10%;
  display: flex;
  justify-content: space-between;
}

.detail2-list-item::after {
  content: '';
  position: absolute;
  bottom: -30%;
  width: 100%;
  height: 2px;
  background: url('/assets/3d/image/119.png') center / 100% 100% no-repeat;

}

.detail2-list-item p {
  font-size: 1.6vh;
}

.detail2-list-name {
  word-break: keep-all;
  position: absolute;
  top: -12%;
  left: 50%;
  transform: translateX(-50%);
  font-family: YouSheBiaoTiHei;
  font-size: 2vh;
}

.detail2-list-wrap {
  padding-right: 5%;
}

.detail-list-status {
  padding: 1% 5%;
  border-radius: 4px;
  color: #000;
}

.close {
  cursor: pointer;
  position: absolute;
  top: 5.2%;
  right: 1.1%;
  width: 3%;
  height: 5%;
  background: url('/assets/3d/image/45.png') center / 100% 100% no-repeat;
}
</style>
