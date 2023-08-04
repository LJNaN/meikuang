<template>
  <el-badge :value="badgeNum" class="alert">
    <SingleActive :options="options1" @btnClick="btnClick"></SingleActive>
  </el-badge>

  <SingleActive :options="options2"></SingleActive>

  <el-scrollbar v-show="alertShow" class="alert-detail">
    <div class="alert-detail-item" v-for="item in alertList">
      <div class="detail-top">

        <div class="detail-top-left">
          <img src="/assets/3d/image/65.png" />
          <p>{{ item.position }}</p>
        </div>

        <p class="detail-top-right" :style="{minWidth: type === 'home' ? '' : '30%'}">{{ item.time }}</p>
      </div>

      <div class="detail-center">
        <p>{{ (type === 'home' ? '预警人员:' : '预警类别: ') + item.item1 }}</p>
        <p>{{ (type === 'home' ? '' : '预警项: ') + item.item2 }}</p>
      </div>

      <p class="detail-bottom">{{ item.describe }}</p>
      <div class="alert-detail-close" @click="handleClose(item.id)"></div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import SingleActive from '@/components/singleActive.vue'
import { STATE } from '@/ktJS/STATE'
import { getRyyjList, getQyyjList } from '@/axios/api'
import { mockData } from "@/axios/mockdata"
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()

const { type } = defineProps({ type: String })

let badgeNum = ref(0)
let alertList = ref([])
let alertShow = ref(false);



const options1 = {
  text: '预警信息',
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
};

getData()
async function getData() {
  if (type === 'home' || type === 'regionalRisk') {
    let data = []
    if ($isOurSite) {
      data = (type === 'home'
        ? { list: mockData.getRyyjList }
        : { list: mockData.getQyyjList }
      )
    } else {
      data = await (type === 'home'
        ? getRyyjList().catch(() => { return { list: [] } })
        : getQyyjList().catch(() => { return { list: [] } })
      )
    }
    STATE.alertList = handleAlertList(data)
    alertList.value = [...STATE.alertList]
    badgeNum.value = STATE.alertList.length
  }
}

function handleAlertList(data) {
  return data.list.reduce((acc, cur) => {
    acc.push({
      position: type === 'home' ? (cur.workLocation || '--') : (cur.warnLocation || '--'),
      time: type === 'home' ? (cur.createDate || '--') : (cur.warnTime || '--'),
      item1: type === 'home' ? (cur.warnPerson || '--') : (cur.warnType || '--'),
      item2: type === 'home' ? `${cur.belongPost || ''}|${cur.belongTeam || ''}|${cur.belongGroup || ''}` : (cur.levelIndicators || ''),
      describe: type === 'home' ? (cur.warnDescribe || '') : (cur.warnDescribe || '')
    })
    return acc
  }, [])
}

function btnClick(params) {
  if (params.text = '预警信息') {
    alertShow.value = params.active
    if (params.active) {
      getData()
    }
  }
}

function handleClose(id) {
  const itemIndex = alertList.value.findIndex(e => e.id === id)

  if (itemIndex >= 0) {
    alertList.value.splice(itemIndex, 1)
  }
}
</script>

<style scoped>
.alert {
  position: fixed;
  right: 1%;
  top: 3%;
  transform: translateY(-3%);
  width: 10vw;
  height: 5vh;
}

.alert-detail {
  pointer-events: all;
  position: fixed;
  right: 0;
  top: 0;
  width: 40%;
  height: 60%;
  margin-top: 1.8%;
  margin-right: 11%;
}

.alert-detail-item {
  position: relative;
  background: url('/assets/3d/image/66.png') center / 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 12% 10% 8% 8%;
}

.alert-detail-item p {
  font-size: 12px;
}

.alert-detail-close {
  cursor: pointer;
  position: absolute;
  top: 20%;
  right: 4.2%;
  width: 6%;
  height: 15%;
  background: url('/assets/3d/image/67.png') center / 100% 100% no-repeat;
}

.detail-top {
  display: flex;
  height: 30%;
  align-items: center;
  justify-content: space-between;
}

.detail-top-left {
  display: flex;
  align-items: center;
}

.detail-top-left img {
  width: 1.2vw;
  margin-right: 4px;
}

.detail-center {
  padding-left: 6%;
  display: flex;
  justify-content: space-between;
  margin: 3% 0;
}

.detail-bottom {
  padding-left: 6%;
  color: #ff3636;
  font-weight: bold;
}



:deep(.el-badge__content.is-fixed) {
  right: auto;
  left: calc(var(--el-badge-size) / 0.5 * -1 + 0.5vw);
  background-color: #ad1805;
}
</style>