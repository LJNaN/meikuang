<template>
  <div class="btn publicBtn" :style="style" @click="handle">
    {{ text }}
  </div>
</template>


<script setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
import { API } from '@/ktJS/API'
import { STATE } from '@/ktJS/STATE'
import router from '@/router/index'

const props = defineProps(["options"])
const options = props.options

let active = ref(options.active || false)
const bgimg = props.bgimg || [6, 5]
const background = computed(() => {
  return 'url(' + './assets/3d/image/' +
    (active.value ? bgimg[0] : bgimg[1])
    + '.png' + ') center / 100% 100% no-repeat'
})

const style = reactive(options.style)
style.background = background

function handle() {
  options.cb && options.cb()
  active.value = !active.value
}


let text = ref(options.text)
watch(props, (nweProps) => {
  
  text.value = nweProps.options.text
})

onMounted(() => {

});
</script>



<style scoped>
.btn {
  position: fixed;
  right: 1%;
  top: 3%;
  width: 10vw;
  height: 5vh;
}
</style>
