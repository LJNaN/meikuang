import { API } from './API.js'
import { CACHE } from './CACHE.js'
import router from '@/router/index'

const PUBLIC_PATH = './assets/3d'
const initialState = {
  position: { x: -34.300395750067494, y: 1126.544139771621, z: 915.2762220579656 },
  target: { x: 26.63074872579247, y: -1.1237349734606397e-17, z: 59.90198556311061 },
  maxPolarAngle: Math.PI * 0.45,
  minPolarAngle: Math.PI * 0.05,
  // maxPolarAngle: Math.PI,
  // minPolarAngle: 0,
  ambientLight: {
    color: '#ffffff',
    intensity: 1
  },
  directionLights: [{
    color: 0xedeacc,
    intensity: 1.7,
    position: [20, 30, -140],
    mapSize: [2048, 2048],
    near: 10,
    far: 15000,
    bias: -0.001,
    distance: 8000
  }],
  spotLights: [{
    color: 0xffdcb2,
    intensity: 4,
    position: [-637, 120, 339],
    decay: 0.5,
    angle: Math.PI / 2,
    penumbra: 0.4
  }, {
    color: 0xffdcb2,
    intensity: 4,
    position: [650, 120, 295],
    decay: 0.5,
    angle: Math.PI / 2,
    penumbra: 0.4
  }, {
    color: 0xffdcb2,
    intensity: 4,
    position: [362, 120, -369],
    decay: 0.5,
    angle: Math.PI / 2,
    penumbra: 0.4
  }]
}

const clickObjects = []
const outlineObjects = []

const clock = new Bol3D.Clock()
clock.running = true

const sceneList = {
  personPopup: [],
  baseStationPopup: [],
  environmentPopup: [],
  locationPopup: [],
  monitorPopup: []
}

// 室内名称与模型对应 可能要带旋转动画
// name 包含的名字
// modelName 模型文件名
// model 在 progress 里把模型对象赋给这个 model
// rotateMeshName 要旋转的动画的 mesh 名
// rotateMesh 要旋转的动画的 mesh 对象
// mainMeshName 点击主体的 mesh 名字或者 group 名字
// cameraState 相机预设位置
// light 光源预设
const roomModelName = [
  { // 综采
    name: '综采',
    modelName: 'zcgzm',
    model: null,
    rotateMeshName: ['CMJ-1', 'CMJ-2'],
    rotateMesh: [],
    mainMeshName: ['CMJ-1', 'CMJ-2', 'CMJy', 'CMJz', 'CMJ'],
    mainMachinePopup: null,
    cameraState: {
      position: { x: 21.432011683782665, y: 30.51447994396291, z: -472.446148798 },
      target: { x: 27.443543167349613, y: 28, z: -405 }
    },
    light: {
      ambientLight: 3,
      directionLight: {
        position: { x: 20, y: 30, z: -140 },
        intensity: 1.7
      }
    }
  }, { // 切眼
    name: '切眼',
    modelName: 'jjgzm',
    model: null,
    rotateMeshName: ['GunTong02_1', 'GunTong02_2', 'GunTong03_1', 'GunTong03_2', 'GunTong01_1', 'GunTong01_2', 'XuanZ_01', 'XuanZ_02'],
    rotateMesh: [],
    mainMeshName: ['ZZJ_003', 'LunTai01', 'LunTai002', 'YiDong_02', 'ZZJ_Zhou', 'YiDong_Qian', 'ZZJ_Z01_01', 'ZZJ_Z01_02', 'Sphere001', 'CZ_CX_01', 'CZ_CX_002', 'CZ_MX_01', 'CZ_MX_002', 'MZ_01', 'MZ_02', 'ZZJ_004', 'ZZJ_Zhou_(1)', 'JM_FuJian', 'QiGe_01', 'QiGe_05', 'QiGe_06', 'QiGe_07', 'Wu_019', 'Wu_018', 'JM01', 'JM_07', 'JM_05', 'JM_03', 'JM_01', 'JM_08', 'JM_10', 'JM_09'],
    mainMachinePopup: null,
    cameraState: {
      position: { x: -385.48531236599695, y: 34.316284718300054, z: 94.37294254683876 },
      target: { x: -325, y: 17, z: 0 }
    }
  }, { // 槽
    name: '槽',
    modelName: 'jjgzm',
    model: null,
    rotateMeshName: ['GunTong02_1', 'GunTong02_2', 'GunTong03_1', 'GunTong03_2', 'GunTong01_1', 'GunTong01_2', 'XuanZ_01', 'XuanZ_02'],
    rotateMesh: [],
    mainMeshName: ['ZZJ_003', 'LunTai01', 'LunTai002', 'YiDong_02', 'ZZJ_Zhou', 'YiDong_Qian', 'ZZJ_Z01_01', 'ZZJ_Z01_02', 'Sphere001', 'CZ_CX_01', 'CZ_CX_002', 'CZ_MX_01', 'CZ_MX_002', 'MZ_01', 'MZ_02', 'ZZJ_004', 'ZZJ_Zhou_(1)', 'JM_FuJian', 'QiGe_01', 'QiGe_05', 'QiGe_06', 'QiGe_07', 'Wu_019', 'Wu_018', 'JM01', 'JM_07', 'JM_05', 'JM_03', 'JM_01', 'JM_08', 'JM_10', 'JM_09'],
    mainMachinePopup: null,
    cameraState: {
      position: { x: -385.48531236599695, y: 34.316284718300054, z: 94.37294254683876 },
      target: { x: -325, y: 17, z: 0 }
    }
  }, { // 变电所
    name: '变电所',
    modelName: 'bds',
    model: null,
    cameraState: {
      position: { x: -0.8806329269418267, y: 17.814846309338826, z: 60.1223121565 },
      target: { x: 12.88431492840435, y: 2, z: -61.890060736 }
    },
    light: {
      ambientLight: 8.8,
      directionLight: {
        position: { x: 28, y: 78, z: -170 },
        intensity: 0.9
      }
    }
  }, { // 硐室
    name: '硐室',
    modelName: 'ts',
    model: null,
    cameraState: {
      position: { x: 0.3270075771528318, y: 12.93024355871586, z: 173.79397125035 },
      target: { x: 2.848474487381654, y: -3.0351039132230924e-19, z: -38.010824 }
    },
    light: {
      ambientLight: 7.9,
      directionLight: {
        position: { x: -199, y: 153, z: 490 },
        intensity: 2.6
      }
    }
  }, { // 车场
    name: '车场',
    modelName: 'jxcc',
    model: null,
    cameraState: {
      position: { x: 0.4762330095310796, y: 8.648768408898812, z: 340.99870448 },
      target: { x: 5.212103260699379, y: -1.5125165121968735e-14, z: 177.0878004 }
    },
    light: {
      ambientLight: 5.8,
      directionLight: {
        position: { x: -199, y: 153, z: 490 },
        intensity: 4.2
      }
    }
  }, { // 压风机房
    name: '压风机房',
    modelName: 'yfjf',
    model: null,
    cameraState: {
      position: { x: -341.0837627566431, y: 89.18191044850768, z: 108.2066675410 },
      target: { x: 0, y: 0, z: 0 }
    },
    light: {
      ambientLight: 0.6,
      directionLight: {
        position: { x: 23, y: 67, z: 10 },
        intensity: 2
      }
    }
  }, { // 通风机
    name: '通风机',
    modelName: 'tfjf',
    model: null,
    cameraState: {
      position: { x: -10.815394061192443, y: 12.438939566707647, z: 93.88151088323951 },
      target: { x: 41.63987032848906, y: 1.1148309349480146e-17, z: -15.332754537450171 }
    },
    light: {
      ambientLight: 3.2,
      directionLight: {
        position: { x: -104, y: 99, z: -180 },
        intensity: 1.1
      }
    }
  }, { // 瓦斯
    name: '瓦斯',
    modelName: 'wsb',
    model: null,
    cameraState: {
      position: { x: -354.6893875647948, y: 128.3503826821151, z: -102.67015683149427 },
      target: { x: 48.317474120084555, y: 7.481945062577894e-16, z: -0.34080370572128793 }
    },
    light: {
      ambientLight: 1.3,
      directionLight: {
        position: { x: 20, y: 82, z: 0 },
        intensity: 1.9
      }
    }
  }, { // 运输
    name: '运输',
    modelName: 'ysdx',
    model: null,
    cameraState: {
      position: { x: -6.192025997646759, y: 13.294844676753192, z: 304.76269419444634 },
      target: { x: 28.492693469905007, y: 0, z: 87.8841204 }
    },
    light: {
      ambientLight: 5.4,
      directionLight: {
        position: { x: -96, y: 120, z: 220 },
        intensity: 1.3
      }
    }
  }, { // 水泵房
    name: '水泵房',
    modelName: 'sbf',
    model: null,
    cameraState: {
      position: { x: -21.36940180739913, y: 19.72616860295364, z: 129.61852800567192 },
      target: { x: 69.6259692419141, y: 9.660158310423856e-16, z: -123.97609866477575 }
    },
    light: {
      ambientLight: 10,
      directionLight: {
        position: { x: 41, y: 93, z: -80 },
        intensity: 1.7
      }
    }
  }]

// location popup 弹窗
const popupLocationList = [
  {
    name: '1010切眼',
    sub: '工作人员数量: 0 人',
    position: { x: 278.81202800325644, y: 0, z: -360.275618 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '501综采工作面',
    sub: '工作人员数量: 0 人',
    position: { x: 220, y: 0, z: 42 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '627综采工作面',
    sub: '工作人员数量: 0 人',
    position: { x: -18.530259199427906, y: 0, z: -149.209289 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '820进风顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: -368, y: 0, z: 316 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '634进风顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: -350, y: 0, z: -331 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '632回风顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: -311, y: 0, z: -342 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '1012进风顺槽(反掘)',
    sub: '工作人员数量: 0 人',
    position: { x: -65, y: 0, z: -391 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '1012进风顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: 328, y: 0, z: -396 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '1000回风顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: 371, y: 0, z: -222 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '1#中央变电所',
    sub: '工作人员数量: 0 人',
    position: { x: 224, y: 0, z: 309 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '2#中央变电所',
    sub: '工作人员数量: 0 人',
    position: { x: -216, y: 0, z: 178 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '北二2#变电所',
    sub: '工作人员数量: 0 人',
    position: { x: -165, y: 0, z: -231 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '3#中央变电所',
    sub: '工作人员数量: 0 人',
    position: { x: 424, y: 0, z: -244 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '西采区变电所',
    sub: '工作人员数量: 0 人',
    position: { x: -36, y: 0, z: 229 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '八盘区变电所',
    sub: '工作人员数量: 0 人',
    position: { x: -394, y: 0, z: 351 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '永久避险硐室',
    sub: '工作人员数量: 0 人',
    position: { x: 310, y: 0, z: 78 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '北一避难硐室',
    sub: '工作人员数量: 0 人',
    position: { x: 317, y: 0, z: 120 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '排矸硐室',
    sub: '工作人员数量: 0 人',
    position: { x: 415, y: 0, z: -215 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '1000机头硐室',
    sub: '工作人员数量: 0 人',
    position: { x: 410, y: 0, z: -218 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '北二避难硐室',
    sub: '工作人员数量: 0 人',
    position: { x: -209, y: 0, z: -54 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '816回风机头硐室',
    sub: '工作人员数量: 0 人',
    position: { x: -389, y: 0, z: -312 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '二号车场',
    sub: '工作人员数量: 0 人',
    position: { x: 177, y: 0, z: 491 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '三号车场',
    sub: '工作人员数量: 0 人',
    position: { x: 255, y: 0, z: 298 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '七号车场',
    sub: '工作人员数量: 0 人',
    position: { x: -224, y: 0, z: 161 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '局部通风机',
    sub: '工作人员数量: 0 人',
    position: { x: -386, y: 0, z: 303 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '局部通风机',
    sub: '工作人员数量: 0 人',
    position: { x: -358, y: 0, z: 316 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '局部通风机',
    sub: '工作人员数量: 0 人',
    position: { x: -376, y: 0, z: 279 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '局部通风机',
    sub: '工作人员数量: 0 人',
    position: { x: -305, y: 0, z: 203 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '主要通风机',
    sub: '工作人员数量: 0 人',
    position: { x: -338, y: 0, z: 146 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '主要通风机',
    sub: '工作人员数量: 0 人',
    position: { x: -334, y: 0, z: 138 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '北一2#抽采瓦斯泵',
    sub: '工作人员数量: 0 人',
    position: { x: 339, y: 0, z: -1 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '四号瓦斯斜井',
    sub: '工作人员数量: 0 人',
    position: { x: 444, y: 0, z: -219 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '北二2#抽采瓦斯泵',
    sub: '工作人员数量: 0 人',
    position: { x: -193, y: 0, z: -157 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '1009辅助运输顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: 417, y: 0, z: -309 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '1006辅助运输顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: 386, y: 0, z: -168 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '305运输巷',
    sub: '工作人员数量: 0 人',
    position: { x: 353, y: 0, z: 175 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '304运输巷',
    sub: '工作人员数量: 0 人',
    position: { x: 346, y: 0, z: 200 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '303运输顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: 334, y: 0, z: 224 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '302运输顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: 327, y: 0, z: 247 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '301运输顺槽',
    sub: '工作人员数量: 0 人',
    position: { x: 314, y: 0, z: 274 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '300运输',
    sub: '工作人员数量: 0 人',
    position: { x: 353, y: 0, z: 301 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '208运输',
    sub: '工作人员数量: 0 人',
    position: { x: 221, y: 0, z: 363 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '402运输',
    sub: '工作人员数量: 0 人',
    position: { x: 266, y: 0, z: 371 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '207运输',
    sub: '工作人员数量: 0 人',
    position: { x: 212, y: 0, z: 384 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '404运输',
    sub: '工作人员数量: 0 人',
    position: { x: 256, y: 0, z: 392 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '206运输',
    sub: '工作人员数量: 0 人',
    position: { x: 205, y: 0, z: 408 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '406运输',
    sub: '工作人员数量: 0 人',
    position: { x: 249, y: 0, z: 423 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '205运输',
    sub: '工作人员数量: 0 人',
    position: { x: 150, y: 0, z: 437 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '204运输',
    sub: '工作人员数量: 0 人',
    position: { x: 186, y: 0, z: 474 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '八盘区水泵房',
    sub: '工作人员数量: 0 人',
    position: { x: -392, y: 0, z: 311 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '2号中央水泵房',
    sub: '工作人员数量: 0 人',
    position: { x: -197, y: 0, z: 230 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '1号中央水泵房',
    sub: '工作人员数量: 0 人',
    position: { x: 62, y: 0, z: 259 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '2号水泵房',
    sub: '工作人员数量: 0 人',
    position: { x: 177, y: 0, z: 505 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '西一临时水泵房',
    sub: '工作人员数量: 0 人',
    position: { x: -98, y: 0, z: 201 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '北二水泵房',
    sub: '工作人员数量: 0 人',
    position: { x: -257, y: 0, z: 97 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }, {
    name: '601水泵房',
    sub: '工作人员数量: 0 人',
    position: { x: -259, y: 0, z: 103 },
    regionRate: {
      total: 0,
      member: 0,
      device: 0,
      environment: 0,
      manager: 0
    },
    person: []
  }
]

// Environment popup 的对应
const popupEnvironmentMap = [{
  shortName: 'CH4',
  name: 'GJG100J型甲烷传感器',
  threshold: 1,
  imgUrl: '51'
}, {
  shortName: 'CO2',
  name: 'KGQ9二氧化碳传感器',
  threshold: 1.5,
  imgUrl: '47'
}, {
  shortName: 'CO',
  name: 'KGA5一氧化碳传感器',
  threshold: 24,
  imgUrl: '49'
}, {
  shortName: 'T',
  name: 'KG3007A温度传感器',
  threshold: 30,
  imgUrl: '48'
}, {
  shortName: 'YW',
  name: 'KGQ5烟雾传感器',
  threshold: 30,
  imgUrl: '50'
}, {
  shortName: 'FC',
  name: 'GCG1000粉尘传感器',
  threshold: 1000,
  imgUrl: '52'
}, {
  shortName: 'FY',
  name: 'KJY3A负压传感器',
  threshold: [0, 24],
  imgUrl: '53'
}]

// Environment popup 弹窗
const popupEnvironmentList = [{
  name: 'CH4',
  position: { x: 245, y: 0, z: 313 },
  id: '001487',
  info: {
    name: 'CH4浓度',
    value: '1.8',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 243, y: 0, z: 303 },
  id: '000902',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 220, y: 0, z: 337 },
  id: '001424',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 296, y: 0, z: 144 },
  id: '008507',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 297, y: 0, z: 139 },
  id: '008512',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 298, y: 0, z: 83 },
  id: '000026',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 270, y: 0, z: 73 },
  id: '000176',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 222, y: 0, z: 58 },
  id: '000569',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 172, y: 0, z: 34 },
  id: '008474',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 161, y: 0, z: 27 },
  id: '003319',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: 159, y: 0, z: 36 },
  id: '005382',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 424, y: 0, z: -240 },
  id: '003909',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 424, y: 0, z: -240 },
  id: '003909',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 424, y: 0, z: -240 },
  id: '003909',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 383, y: 0, z: -312 },
  id: '004459',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: 400, y: 0, z: -312 },
  id: '004460',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: 412, y: 0, z: -311 },
  id: '004461',
  info: {
    name: '温度',
    value: '22',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 418, y: 0, z: -312 },
  id: '004464',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 394, y: 0, z: -312 },
  id: '004465',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 368, y: 0, z: -314 },
  id: '004640',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 362, y: 0, z: -314 },
  id: '004497',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}
  , {
  name: 'CH4',
  position: { x: 262, y: 0, z: -314 },
  id: '000003',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 245, y: 0, z: -314 },
  id: '004695',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 215, y: 0, z: -314 },
  id: '000005',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 199, y: 0, z: -314 },
  id: '004639',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 140, y: 0, z: -294 },
  id: '004619',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 153, y: 0, z: -359 },
  id: '004339',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CO',
  position: { x: 140, y: 0, z: -359 },
  id: '000542',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 268, y: 0, z: -314 },
  id: '004470',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 298, y: 0, z: -314 },
  id: '000001',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 309, y: 0, z: -314 },
  id: '004469',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 319, y: 0, z: -314 },
  id: '004467',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 24, y: 0, z: -142 },
  id: '004133',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'FC',
  position: { x: 169, y: 0, z: 45 },
  id: '005381',
  info: {
    name: '粉尘浓度',
    value: '10',
    unit: '%'
  }
}, {
  name: 'CO',
  position: { x: 425, y: 0, z: -257 },
  id: '000509',
  info: {
    name: 'CO浓度',
    value: '0.2',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 394, y: 0, z: -259 },
  id: '000498',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CO',
  position: { x: 394, y: 0, z: -265 },
  id: '000499',
  info: {
    name: 'CO浓度',
    value: '22',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: 394, y: 0, z: -269 },
  id: '000500',
  info: {
    name: '温度',
    value: '12',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 375, y: 0, z: -260 },
  id: '000760',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 370, y: 0, z: -266 },
  id: '000774',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'FC',
  position: { x: 356, y: 0, z: -264 },
  id: '000496',
  info: {
    name: '粉尘浓度',
    value: '10',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 356, y: 0, z: -271 },
  id: '000495',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: 25, y: 0, z: -146 },
  id: '005215',
  info: {
    name: 'CO浓度',
    value: '26',
    unit: '%'
  }
}, {
  name: 'FC',
  position: { x: 17, y: 0, z: -148 },
  id: '005216',
  info: {
    name: '粉尘浓度',
    value: '10',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 12, y: 0, z: -140 },
  id: '002304',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: -28, y: 0, z: -160 },
  id: '002407',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 207, y: 0, z: 414 },
  id: '001509',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'T',
  position: { x: 207, y: 0, z: 416 },
  id: '001058',
  info: {
    name: '温度',
    value: '28',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: 144, y: 0, z: 414 },
  id: '003477',
  info: {
    name: '温度',
    value: '28',
    unit: '%'
  }
}, {
  name: 'CO',
  position: { x: 213, y: 0, z: 397 },
  id: '001031',
  info: {
    name: 'CO浓度',
    value: '0.2',
    unit: '%'
  }
}, {
  name: 'CO',
  position: { x: 312, y: 0, z: 85 },
  id: '005379',
  info: {
    name: 'CO浓度',
    value: '0.2',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 295, y: 0, z: 74 },
  id: '000054',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CH4',
  position: { x: 295, y: 0, z: 59 },
  id: '008476',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
}, {
  name: 'CO',
  position: { x: 289, y: 0, z: 61 },
  id: '009082',
  info: {
    name: 'CO浓度',
    value: '0.2',
    unit: '%'
  }
}, {
  name: 'T',
  position: { x: 285, y: 0, z: 71 },
  id: '009091',
  info: {
    name: '温度',
    value: '33',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: 423, y: 0, z: -239 },
  id: '003913',
  info: {
    name: '温度',
    value: '28',
    unit: '%'
  }
},

{
  name: 'T',
  position: { x: 467, y: 0, z: -377 },
  id: '000111',
  info: {
    name: '温度',
    value: '15',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: 466, y: 0, z: -378 },
  id: '000108',
  info: {
    name: 'CO浓度',
    value: '0.2',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: 468, y: 0, z: -377 },
  id: '000002',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'FC',
  position: { x: -278, y: 0, z: 328 },
  id: '005352',
  info: {
    name: '粉尘浓度',
    value: '10',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -278, y: 0, z: 318 },
  id: '005351',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -300, y: 0, z: 329 },
  id: '000913',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -310, y: 0, z: 329 },
  id: '005359',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -329, y: 0, z: 338 },
  id: '005359',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: -326, y: 0, z: 335 },
  id: '005368',
  info: {
    name: '温度',
    value: '23',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: -355, y: 0, z: 352 },
  id: '000912',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -349, y: 0, z: 330 },
  id: '000913',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'FC',
  position: { x: -288, y: 0, z: 316 },
  id: '000614',
  info: {
    name: '粉尘浓度',
    value: '10',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -285, y: 0, z: 310 },
  id: '000613',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -319, y: 0, z: 335 },
  id: '000616',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: -318, y: 0, z: 320 },
  id: '000671',
  info: {
    name: '温度',
    value: '22',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: -318, y: 0, z: 314 },
  id: '000618',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -324, y: 0, z: 331 },
  id: '000770',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: -336, y: 0, z: 314 },
  id: '000771',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -388, y: 0, z: -259 },
  id: '004868',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -347, y: 0, z: -235 },
  id: '005261',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -304, y: 0, z: -212 },
  id: '005075',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -197, y: 0, z: -119 },
  id: '004866',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -213, y: 0, z: -163 },
  id: '004857',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: -210, y: 0, z: -165 },
  id: '004859',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: -204, y: 0, z: -158 },
  id: '004858',
  info: {
    name: '温度',
    value: '13',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -227, y: 0, z: -170 },
  id: '004888',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -237, y: 0, z: -177 },
  id: '005019',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -265, y: 0, z: -193 },
  id: '005020',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -175, y: 0, z: -180 },
  id: '002466',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: -168, y: 0, z: -197 },
  id: '002441',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -147, y: 0, z: -174 },
  id: '003542',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -141, y: 0, z: -169 },
  id: '002306',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: -133, y: 0, z: -181 },
  id: '003637',
  info: {
    name: '温度',
    value: '12',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: -124, y: 0, z: -189 },
  id: '002308',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -101, y: 0, z: -161 },
  id: '002464',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -67, y: 0, z: -151 },
  id: '002479',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -53, y: 0, z: -145 },
  id: '003274',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -36, y: 0, z: -143 },
  id: '000487',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -21, y: 0, z: -135 },
  id: '003275',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -5, y: 0, z: -127 },
  id: '003042',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: -132, y: 0, z: -308 },
  id: '004309',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -146, y: 0, z: -308 },
  id: '004305',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -157, y: 0, z: -308 },
  id: '000252',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -186, y: 0, z: -310 },
  id: '004828',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -193, y: 0, z: -310 },
  id: '004805',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -208, y: 0, z: -310 },
  id: '005413',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -222, y: 0, z: -310 },
  id: '005377',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -314, y: 0, z: -315 },
  id: '004804',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -325, y: 0, z: -315 },
  id: '004806',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: -326, y: 0, z: -312 },
  id: '004307',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -326, y: 0, z: -315 },
  id: '004247',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: -326, y: 0, z: -318 },
  id: '004306',
  info: {
    name: '温度',
    value: '22',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -333, y: 0, z: -316 },
  id: '005419',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'FC',
  position: { x: -342, y: 0, z: -313 },
  id: '004740',
  info: {
    name: '粉尘浓度',
    value: '10',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -342, y: 0, z: -319 },
  id: '004739',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'FC',
  position: { x: -327, y: 0, z: -320 },
  id: '000368',
  info: {
    name: '粉尘浓度',
    value: '10',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -327, y: 0, z: -324 },
  id: '000362',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -321, y: 0, z: -320 },
  id: '000490',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CO',
  position: { x: -316, y: 0, z: -318 },
  id: '000322',
  info: {
    name: 'CO浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'CH4',
  position: { x: -316, y: 0, z: -322 },
  id: '000320',
  info: {
    name: 'CH4浓度',
    value: '0.9',
    unit: '%'
  }
},
{
  name: 'T',
  position: { x: -316, y: 0, z: -325 },
  id: '000321',
  info: {
    name: '温度',
    value: '13',
    unit: '%'
  }
},
]

// 当前展示的popup 主要是第二层popup
const currentPopup = []

// 内部两个场景的机器的弹窗
const mainMachinePopup = null

// 监控摄像头
const monitorList = [{
  name: '1',
  position: { x: 10, y: 0, z: -131 }
}, {
  name: '2',
  position: { x: 234, y: 0, z: 44 }
}, {
  name: '3',
  position: { x: 304, y: 0, z: -356 }
}, {
  name: '4',
  position: { x: -350, y: 0, z: -324 }
}]

// 人员定位基站
const baseStationList = [{
  name: '1',
  position: { x: 540, y: 10, z: 107 }
}, {
  name: '2',
  position: { x: -108, y: 10, z: -88 }
}, {
  name: '3',
  position: { x: 39, y: 10, z: 391 }
}]

// 人员监管
// 1 重点 2 加强 3 需关注 4 安全
const personList = [
  { name: '张士明', level: 4, position: { x: 172, y: 0, z: 27 }, info: { title: '501综采工作面', value1: '5004', value2: '安全', value3: '皮带检修工', value4: '检修班', value5: '综采一队' } },
  { name: '韩辉', level: 4, position: { x: 177, y: 0, z: 28 }, info: { title: '501综采工作面', value1: 'X3026', value2: '安全', value3: '采煤机检修工', value4: '检修班', value5: '综采一队' } },
  { name: '高长虎', level: 4, position: { x: 183, y: 0, z: 29 }, info: { title: '501综采工作面', value1: '3658', value2: '安全', value3: '综采维修电工', value4: '检修班', value5: '综采一队' } },
  { name: '葛治国', level: 4, position: { x: 269, y: 0, z: 55 }, info: { title: '501综采工作面', value1: 'x3595', value2: '安全', value3: '综采勤杂工', value4: '检修班', value5: '综采一队' } },
  { name: '阎翔', level: 4, position: { x: 186, y: 0, z: 35 }, info: { title: '501综采工作面', value1: 'X2576', value2: '安全', value3: '皮带检修工', value4: '检修班', value5: '综采一队' } },
  { name: '王浩东', level: 4, position: { x: 200, y: 0, z: 39 }, info: { title: '501综采工作面', value1: 'X3095', value2: '安全', value3: '三机检修工', value4: '检修班', value5: '综采一队' } },
  { name: '高遵奇', level: 4, position: { x: 211, y: 0, z: 38 }, info: { title: '501综采工作面', value1: '1846', value2: '安全', value3: '综采勤杂工', value4: '检修班', value5: '综采一队' } },
  { name: '刘鑫', level: 4, position: { x: 224, y: 0, z: 44 }, info: { title: '501综采工作面', value1: '6252', value2: '安全', value3: '综采勤杂工', value4: '检修班', value5: '综采一队' } },
  { name: '齐进荣', level: 4, position: { x: 238, y: 0, z: 48 }, info: { title: '501综采工作面', value1: '6401', value2: '安全', value3: '泵站检修工', value4: '检修班', value5: '综采一队' } },
  { name: '赵岩', level: 4, position: { x: 253, y: 0, z: 47 }, info: { title: '501综采工作面', value1: 'X2708', value2: '安全', value3: '综采维修电工', value4: '检修班', value5: '综采一队' } },
  { name: '成兆强', level: 4, position: { x: 259, y: 0, z: 54 }, info: { title: '501综采工作面', value1: 'X2587', value2: '安全', value3: '综采维修电工', value4: '检修班', value5: '综采一队' } },
  { name: '仵朋辉', level: 4, position: { x: 288, y: 0, z: 55 }, info: { title: '501综采工作面', value1: '6945', value2: '安全', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张涵溪', level: 4, position: { x: 298, y: 0, z: 66 }, info: { title: '501综采工作面', value1: 'X3053', value2: '安全', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张一', level: 1, position: { x: -126, y: 0, z: -176 }, info: { title: '501综采工作面', value1: 'X3053', value2: '重点监管', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张二', level: 2, position: { x: 19, y: 0, z: -134 }, info: { title: '501综采工作面', value1: 'X3053', value2: '加强监管', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张三', level: 3, position: { x: 77, y: 0, z: -110 }, info: { title: '501综采工作面', value1: 'X3053', value2: '需关注', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张四', level: 3, position: { x: 176, y: 0, z: -347 }, info: { title: '501综采工作面', value1: 'X3053', value2: '需关注', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张五', level: 2, position: { x: 308, y: 0, z: -355 }, info: { title: '501综采工作面', value1: 'X3053', value2: '加强监管', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张六', level: 1, position: { x: 382, y: 0, z: -355 }, info: { title: '501综采工作面', value1: 'X3053', value2: '重点监管', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张七', level: 1, position: { x: -87, y: 0, z: -168 }, info: { title: '501综采工作面', value1: 'X3053', value2: '重点监管', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张八', level: 2, position: { x: -50, y: 0, z: -153 }, info: { title: '501综采工作面', value1: 'X3053', value2: '加强监管', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张九', level: 2, position: { x: 45, y: 0, z: -121 }, info: { title: '501综采工作面', value1: 'X3053', value2: '加强监管', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张十', level: 2, position: { x: 96, y: 0, z: -103 }, info: { title: '501综采工作面', value1: 'X3053', value2: '加强监管', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
  { name: '张十一', level: 3, position: { x: 217, y: 0, z: -353 }, info: { title: '501综采工作面', value1: 'X3053', value2: '需关注', value3: '支架检修工', value4: '检修班', value5: '综采一队' } },
]

// 人员监管相关的配置
const personMap = [
  { name: '重点监管', level: 1, img: [34, 35, 40, 59, 85, 89] },
  { name: '加强监管', level: 2, img: [36, 37, 41, 60, 84, 88] },
  { name: '需关注', level: 3, img: [30, 31, 38, 61, 87, 91] },
  { name: '安全', level: 4, img: [32, 33, 39, 62, 86, 90] }
]

// 报警列表
const alertList = [{
  id: 1,
  position: '1000综采工作面',
  position2: '2#煤层',
  value: '此区域有重点监管作业人员，请及时处理！'
}, {
  id: 2,
  position: '627综采工作面',
  position2: '2#煤层',
  value: '此区域有重点监管作业人员，请及时处理！'
}, {
  id: 3,
  position: '1000综采工作面',
  position2: '2#煤层',
  value: '此区域有重点监管作业人员，请及时处理！'
}, {
  id: 4,
  position: '1000综采工作面',
  position2: '1#煤层',
  value: '此区域有重点监管作业人员，请及时处理！'
}, {
  id: 5,
  position: '627综采工作面',
  position2: '1#煤层',
  value: '此区域有重点监管作业人员，请及时处理！'
}, {
  id: 6,
  position: '627综采工作面',
  position2: '3#煤层',
  value: '此区域有重点监管作业人员，请及时处理！'
}]

// 0 显示全部
let personShowType = [0, 1, 2, 3, 4]


// 辉光bloom
const bloomList = []

// 动画开关
let animationFlag = true

// 渲染开关
let pause3D = false

// 当前场景
let currentScene = ''

// 是否要获取数据
let isNeedGetData = true

const locationPositionPointsArr = [
  {
    name: '625综采工作面', value: [
      [-172.76845576958868, -173.88359475764463],
      [-178.7048052787303, -151.92570544382798],
      [173.60491816569265, -37.858487997093164],
      [180.14997132162955, -58.97302077676528]
    ]
  },
  {
    name: '623综采工作面', value: [
      [170.6048420009893, -32.94089359946429],
      [163.09989230811448, -10.901263262993925],
      [-187.26226992677, -124.16375280692326],
      [-180.50292691487775, -146.56462850225734]
    ]
  },
  {
    name: '621综采工作面', value: [
      [-190.15247662469972, -118.71737555108072],
      [-196.06809163678292, -98.09644141837367],
      [154.8155587128457, 17.75614360038307],
      [161.84787157891995, -4.229311979866299]
    ]
  },
  {
    name: '619综采工作面', value: [
      [-207.06397277437463, -65.48867660980977],
      [-212.80088942027774, -44.861066028818925],
      [76.80064750352344, 49.86296366961059],
      [90.837930320499, 2.4910102547645963]
    ]
  },
  {
    name: '617综采工作面', value: [
      [82.43453210380454, 27.35733149631355],
      [75.88679432357674, 48.43286918139536],
      [-212.96788367759257, -44.53021885566115],
      [-207.09710532848436, -64.87983102024812]
    ]
  },
  {
    name: '613综采工作面', value: [
      [-214.3468411400542, -37.42558673292096],
      [-219.63972962742724, -18.57659294530214],
      [68.25750253645691, 75.14806195855388],
      [75.01981658543724, 54.46424157183384]
    ]
  },
  {
    name: '611综采工作面', value: [
      [74.32921163891399, 84.01118623592104],
      [69.29534576800094, 104.02853534570883],
      [-215.4080081377334, 9.97784430831598],
      [-209.08229457231192, -9.338345001847259]
    ]
  },
  {
    name: '609综采工作面', value: [
      [56.95020801045598, 106.54345788288404],
      [51.14829016289491, 126.09795206656986],
      [-235.6003084772454, 34.73660249802458],
      [-223.2293177852777, 13.413713103218882]
    ]
  },
  {
    name: '607综采工作面', value: [
      [-227.1408752545453, 44.23034693920781],
      [-231.48056177779415, 61.147324374265544],
      [53.48822721332914, 154.7114597868286],
      [58.53166799239125, 137.08390399940657]
    ]
  },
  {
    name: '605综采工作面', value: [
      [50.363313051320574, 160.08061428815031],
      [44.844067157435745, 178.5791466876004],
      [-240.8290167503397, 85.90624382134894],
      [-234.37563826351635, 67.07967587942517]
    ]
  },
  {
    name: '603综采工作面', value: [
      [-240.71437026092542, 91.54049682874107],
      [-247.90025772661227, 113.6429297516499],
      [36.628331735045776, 208.2283352842604],
      [43.94180930287217, 183.0515579887738]
    ]
  },
  {
    name: '601综采工作面', value: [
      [15.324864793340325, 206.75562222769557],
      [-135.461878501552, 157.58746672298423],
      [-140.17525730720195, 173.79068914873633],
      [11.508315905095031, 225.00380298678698]
    ]
  },
  {
    name: '624综采工作面', value: [
      [-208.34201693060146, -93.70571559465067],
      [-200.39369127175803, -116.1156177471551],
      [-377.05046100193647, -215.8580149183565],
      [-389.03195963100944, -192.16919745245005]
    ]
  },
  {
    name: '620综采工作面', value: [
      [-289.3254881651576, -131.76748310056539],
      [-299.8568528712433, -112.60218256883543],
      [-471.11400042256975, -206.1346271199567],
      [-459.9940628777833, -225.79488496557144]
    ]
  },
  {
    name: '1009综采工作面', value: [
      [136.98012002134857, -292.9162679814666],
      [135.14252674243676, -316.1333058201859],
      [227.09902701281553, -313.86512726951895],
      [226.23314562246216, -292.34464458380154]
    ]
  },
  {
    name: '1008综采工作面', value: [
      [135.42831951573783, -286.3282290966625],
      [135.92141738759608, -264.13443450773474],
      [422.38293717235814, -263.9507490277414],
      [431.0717868741278, -285.71820958422046]
    ]
  },
  {
    name: '1007综采工作面', value: [
      [383.3464709074434, -256.5561382730073],
      [383.16057506421816, -232.26944258273903],
      [135.28168875815032, -238.18401944665771],
      [136.18554377188346, -259.34913551253675]
    ]
  },
  {
    name: '1006综采工作面', value: [
      [196.51570206994577, -226.21334436553818],
      [188.64896411340266, -208.33576178137142],
      [385.7119372559356, -141.5277212800312],
      [393.0735600569428, -162.54688730199598]
    ]
  },
  {
    name: '1005综采工作面', value: [
      [382.47553358484726, -137.23631674894062],
      [377.27875800052476, -115.55663287133325],
      [157.19545312471874, -186.54070312947903],
      [164.30801756032912, -209.8801884310313]
    ]
  },
  {
    name: '1004综采工作面', value: [
      [156.42459463693882, -181.6659157144293],
      [150.20032539380486, -161.91402952081796],
      [368.7862950519434, -89.57420832626796],
      [375.57305805896937, -111.34444827368398]
    ]
  },
  {
    name: '1003综采工作面', value: [
      [366.29945090406295, -82.56773159427769],
      [360.78367187467745, -63.81181700765211],
      [137.10179995380236, -135.340011904266],
      [146.5287860971438, -155.8823434456547]
    ]
  },
  {
    name: '1002综采工作面', value: [
      [138.3278716689725, -128.65149442338634],
      [133.69032866392266, -110.22900042999746],
      [347.05220758885434, -39.04721265695093],
      [351.1885271878992, -61.78372867906393]
    ]
  },
  {
    name: '1001综采工作面', value: [
      [239.15772445143529, -67.3826712386999],
      [233.39902376365853, -49.033290223894724],
      [123.46363622271392, -81.44061074894992],
      [130.85439649394826, -104.95859892165723]
    ]
  },
  {
    name: '311综采工作面', value: [
      [351.0549001030408, -1.1394759053140007],
      [342.19785638374736, 21.679752212915027],
      [517.7335363523498, 15.852074551044524],
      [515.4459365919768, -5.660379803982721]
    ]
  },
  {
    name: '310综采工作面', value: [
      [516.373275367615, 21.72453354551557],
      [516.9682007480163, 42.881541223758575],
      [331.43416136517106, 48.39366534697467],
      [341.1848117575237, 27.15167363058294]
    ]
  },
  {
    name: '309综采工作面', value: [
      [332.0223828339102, 54.13954181633095],
      [323.88877762623315, 78.37371837070405],
      [625.6501115654601, 67.167036191789],
      [625.002116557929, 43.91156201014715]
    ]
  },
  {
    name: '308综采工作面', value: [
      [598.3569792337643, 72.93717568516755],
      [599.4654687601452, 94.8777858185726],
      [313.76114877254497, 104.51129738780374],
      [323.1676631978639, 81.06443170653704]
    ]
  },
  {
    name: '307综采工作面', value: [
      [314.4621505273717, 111.61186312340185],
      [600.2640869339766, 100.19053747856722],
      [601.1686368723828, 122.7222354583178],
      [306.3095028451655, 131.87444079132285]
    ]
  },
  {
    name: '306综采工作面', value: [
      [340.1023332819067, 135.96571102411093],
      [332.5117803228643, 154.876597960384],
      [608.723879138801, 147.27088443606078],
      [609.0918350771253, 126.44236851904373]
    ]
  },
  {
    name: '305综采工作面', value: [
      [629.4871924085929, 154.3365931993337],
      [631.1690706833683, 173.8437042854098],
      [320.6087251507147, 183.33399095219315],
      [330.3968770792574, 163.12946766112015]
    ]
  },
  {
    name: '304综采工作面', value: [
      [322.24153157191324, 190.22856640897413],
      [314.8822727358302, 208.69332417039837],
      [632.732036687613, 197.08432457610664],
      [629.9662568698631, 177.95028068704605]
    ]
  },
  {
    name: '303综采工作面', value: [
      [630.4379048892251, 203.5717808167846],
      [632.6979758137619, 219.7893222867455],
      [306.97528842462975, 231.96743915314443],
      [314.189513788995, 211.21269760004992]
    ]
  },
  {
    name: '302综采工作面', value: [
      [306.20848808436676, 239.26598050699118],
      [299.8657030584911, 259.1608731086711],
      [653.7729165928733, 245.01807914102142],
      [652.0084284881873, 227.02850485229376]
    ]
  },
  {
    name: '301综采工作面', value: [
      [609.4012702680797, 251.40578119316885],
      [611.2782716087805, 269.33254368724386],
      [290.5508623423308, 281.08370081167874],
      [299.152912644586, 260.9301468788417]
    ]
  },
  {
    name: '300综采工作面', value: [
      [281.3598017237434, 314.54287275943085],
      [496.6058193367491, 298.9385460036755],
      [501.38506352414123, 316.7004663491181],
      [295.2566847906041, 329.0343852088112]
    ]
  },
  {
    name: '402综采工作面', value: [
      [239.69520535752793, 350.8306764772809],
      [232.92711258372245, 371.9530765879481],
      [448.1293016499543, 364.5627181124992],
      [446.1574551562507, 344.53668064657074]
    ]
  },
  {
    name: '404综采工作面', value: [
      [477.653350845403, 369.1638399520227],
      [477.57059674098065, 389.85684474934385],
      [222.63943615113305, 396.7504574233725],
      [232.13711132883267, 376.9066441757934]
    ]
  },
  {
    name: '406综采工作面', value: [
      [224.19257715219712, 400.7625940808163],
      [219.03339615674605, 420.79641367042103],
      [399.0413883767537, 414.5552816050414],
      [395.2640506433186, 394.29853888712637]
    ]
  },
  {
    name: '209综采工作面', value: [
      [212.33769302808673, 315.85080458708904],
      [220.4366531697645, 336.8867019078737],
      [49.53681290309183, 340.882661517703],
      [48.276364137002076, 322.3228029637838]
    ]
  },
  {
    name: '208综采工作面', value: [
      [162.84779972852104, 345.79262238581424],
      [157.22596939413268, 362.46089945570066],
      [217.80499954579662, 383.1518660948406],
      [223.41964773126412, 365.2099213033925]
    ]
  },
  {
    name: '207综采工作面', value: [
      [215.80665530892324, 389.61064317579974],
      [211.14337151204933, 407.06602012804166],
      [86.34732507353824, 367.4187487873546],
      [90.0687913530827, 349.4049819291458]
    ]
  },
  {
    name: '206综采工作面', value: [
      [43.35795491162217, 359.6164635491752],
      [39.06320881518431, 374.83063456934815],
      [202.60616309366313, 430.1731571448395],
      [208.77298974666266, 413.75927761464845]
    ]
  },
  {
    name: '205综采工作面', value: [
      [200.5980106605363, 432.44040241203214],
      [195.36221282962, 450.5159129213367],
      [4.8502642079554334, 388.38182813329877],
      [9.353971247003017, 369.1147841175045]
    ]
  },
  {
    name: '204综采工作面', value: [
      [-30.284035799485963, 385.2040259048058],
      [-35.234398129635, 402.38274888458176],
      [188.8429942724391, 475.04631610695276],
      [192.20729465296458, 459.25121035727483]
    ]
  },
  {
    name: '203综采工作面', value: [
      [186.57994853367853, 478.0087882930451],
      [182.48346201051066, 492.0654221943736],
      [1.0140821732596237, 432.20612650059616],
      [4.883369745268894, 418.1308569426932]
    ]
  },
  {
    name: '809综采工作面', value: [
      [-398.6786551500588, 329.3908824827944],
      [-411.3547515356286, 352.57860379701367],
      [-597.6760604076346, 346.0237583708715],
      [-595.9624546617557, 323.16927761024397]
    ]
  },
  {
    name: '807综采工作面', value: [
      [-652.1629015971117, 349.11298594607393],
      [-652.555023812626, 372.5103155848481],
      [-425.8382017811771, 378.1061903015678],
      [-412.3543583936871, 357.38559410561317]
    ]
  },
  {
    name: '805综采工作面', value: [
      [-431.13567471956424, 384.82926242761846],
      [-442.91239488771953, 407.198021016157],
      [-636.3359949911869, 398.21903466612576],
      [-632.553011389606, 373.1468936164648]
    ]
  },
  {
    name: '803综采工作面', value: [
      [-628.3250915396177, 405.5369625654057],
      [-627.5067666419819, 425.90826850447974],
      [-456.5936442208045, 432.19936529272263],
      [-445.3909546438816, 411.2712420028767]
    ]
  },
  {
    name: '801综采工作面', value: [
      [-458.340625377533, 437.38132954419086],
      [-470.4387460561892, 459.41368623406424],
      [-619.8856832183064, 453.4455730325837],
      [-619.3738120860683, 429.36086561636796]
    ]
  },
  {
    name: '814综采工作面', value: [
      [-404.7812606197381, 360.76742665168746],
      [-416.1105496162465, 381.82365934820297],
      [-289.243343199031, 388.6092923752757],
      [-288.9969099346652, 365.01130068240633]
    ]
  },
  {
    name: '812综采工作面', value: [
      [-290.7320563807527, 392.79743304003244],
      [-291.6078527217687, 418.60889391126807],
      [-430.9294237277687, 411.8240604164179],
      [-418.02515091075657, 387.1140163001409]
    ]
  },
  {
    name: '810综采工作面', value: [
      [-436.61951925111015, 417.3978624028724],
      [-450.7991754207317, 441.2676535498844],
      [-330.99175466724506, 446.10367994880846],
      [-330.6161220715844, 420.49144370279254]
    ]
  },
  {
    name: '627综采工作面', value: [
      [-169.4729056939662, -177.18667409916316],
      [-161.99919943328482, -202.39944122055684],
      [123.99540290307962, -109.68193600423362],
      [116.49385071436714, -84.51911044503228]
    ]
  },
  {
    name: '501综采工作面', value: [
      [158.13972743168304, 32.09793844217825],
      [162.82769888302585, 14.058061836919748],
      [310.91250921453997, 61.66808076786539],
      [303.7467557563578, 77.47254625242493]
    ]
  },
  {
    name: '1010综采工作面', value: [
      [137.6916401532582, -343.1253215789816],
      [137.31367824282844, -366.30070090925665],
      [441.11689317310083, -362.18320805583585],
      [442.7491855500083, -338.531256655308]
    ]
  }
]

export const STATE = {
  initialState,
  sceneList,
  popupLocationList,
  popupEnvironmentList,
  popupEnvironmentMap,
  personShowType,
  currentPopup,
  mainMachinePopup,
  monitorList,
  baseStationList,
  personList,
  personMap,
  bloomList,
  clickObjects,
  outlineObjects,
  roomModelName,
  PUBLIC_PATH,
  router,
  animationFlag,
  alertList,
  pause3D,
  currentScene,
  locationPositionPointsArr,
  isNeedGetData,
  clock
}
