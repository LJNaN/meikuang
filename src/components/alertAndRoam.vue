<template>
  <el-badge :value="alertList.length" class="alert">
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

        <p class="detail-top-right">{{ item.position2 }}</p>

      </div>

      <p class="detail-bottom">{{ item.value }}</p>
      <div class="alert-detail-close" @click="handleClose(item.id)"></div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref } from 'vue'
import SingleActive from '@/components/SingleActive.vue'
import { STATE } from '@/ktJS/STATE'

const alertList = ref(STATE.alertList)
let alertShow = ref(false)


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



function btnClick(params) {
  if (params.text = '报警信息') {
    alertShow.value = params.active
  }
}

function handleClose(id) {
  const itemIndex = alertList.value.findIndex(e => e.id === id)
  console.log('itemIndex: ', itemIndex);
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
  width: 30%;
  height: 60%;
  margin-top: 1.8%;
  margin-right: 11%;
}

.alert-detail-item {
  position: relative;
  height: 18vh;
  background: url('/assets/3d/image/66.png') center / 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 12% 8% 8% 8%;
}

.alert-detail-item p {
  font-size: 2vh;
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
  justify-content: space-between;
}

.detail-top-left {
  display: flex;
  align-items: center;
}

.detail-top-left img {
  width: 10%;
  margin-right: 3%;
}

.detail-bottom {
  text-align: center;
}


:deep(.el-badge__content.is-fixed) {
  right: auto;
  left: calc(var(--el-badge-size) / 0.5 * -1 + 0.5vw);
  background-color: #ad1805;
}
</style>