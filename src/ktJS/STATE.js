import { API } from './API.js'
import { CACHE } from './CACHE.js'
import router from '@/router/index'

const PUBLIC_PATH = './assets/3d'
const initialState = {
  position: { x: -34.300395750067494, y: 1126.544139771621, z: 915.2762220579656 },
  target: { x: 26.63074872579247, y: -1.1237349734606397e-17, z: 59.90198556311061 }
}

const clock = new Bol3D.Clock()
clock.running = true

const sceneList = {}

// room 名称与模型对应
const roomModelName = [{
  name: '627综采工作面',
  modelName: 'zcgzm',
  model: null,
  rotateMeshName: ['CMJ-1', 'CMJ-2'],
  rotateMesh: [],
  cameraState: {
    position: { x: 27.902401468724577, y: 17.393787389232756, z: -730.973079 },
    target: { x: 188.2216009083511, y: -10, z: 58.020920 }
  }
}, {
  name: '501综采工作面',
  modelName: 'zcgzm',
  model: null,
  rotateMeshName: ['CMJ-1', 'CMJ-2'],
  rotateMesh: [],
  cameraState: {
    position: { x: 27.902401468724577, y: 17.393787389232756, z: -730.973079 },
    target: { x: 188.2216009083511, y: -10, z: 58.020920 }
  }
}, {
  name: '1010切眼',
  modelName: 'jjgzm',
  model: null,
  rotateMeshName: ['GunTong02_1', 'GunTong02_2', 'GunTong03_1', 'GunTong03_2', 'GunTong01_1', 'GunTong01_2', 'XuanZ_01', 'XuanZ_02'],
  rotateMesh: [],
  cameraState: {
    position: { x: -385.48531236599695, y: 34.316284718300054, z: 94.37294254683876 },
    target: { x: -275.3246634131406, y: -1.700666423893553e-16, z: -83.7333160220 }
  }
}]

// popup 弹窗
const popupList = [{
  name: '1010切眼',
  sub: '工作人员数量: 8人',
  position: { x: 278.81202800325644, y: 23.634249717923907, z: -360.275618 },
}, {
  name: '501综采工作面',
  sub: '工作人员数量: 8人',
  position: { x: 229.30597697657578, y: 23.634249717923907, z: 39.8962133145 },
}, {
  name: '627综采工作面',
  sub: '工作人员数量: 8人',
  position: { x: -18.530259199427906, y: 23.634249717923907, z: -149.209289 },
}, {
  name: '待加载',
  sub: '工作人员数量: 未知',
  position: { x: -368, y: 24, z: 316 },
}, {
  name: '待加载',
  sub: '工作人员数量: 未知',
  position: { x: -350, y: 24, z: -331 },
}, {
  name: '待加载',
  sub: '工作人员数量: 未知',
  position: { x: -311, y: 24, z: -342 },
}]

// 辉光bloom
const bloomList = []


export const STATE = {
  initialState,
  sceneList,
  popupList,
  bloomList,
  roomModelName,
  PUBLIC_PATH,
  router,
  clock
}
