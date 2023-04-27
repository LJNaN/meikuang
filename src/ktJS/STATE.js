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
    intensity: 3
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
}

const clickObjects = []

const clock = new Bol3D.Clock()
clock.running = true

const sceneList = {}

// 室内名称与模型对应 可能要带旋转动画
const roomModelName = [
  {
    name: '综采',
    modelName: 'zcgzm',
    model: null,
    rotateMeshName: ['CMJ-1', 'CMJ-2'],
    rotateMesh: [],
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
  }, {
    name: '切眼',
    modelName: 'jjgzm',
    model: null,
    rotateMeshName: ['GunTong02_1', 'GunTong02_2', 'GunTong03_1', 'GunTong03_2', 'GunTong01_1', 'GunTong01_2', 'XuanZ_01', 'XuanZ_02'],
    rotateMesh: [],
    cameraState: {
      position: { x: -385.48531236599695, y: 34.316284718300054, z: 94.37294254683876 },
      target: { x: -325, y: 17, z: 0 }
    }
  }, {
    name: '1012进风顺槽(反掘)',
    modelName: 'jjgzm',
    model: null,
    rotateMeshName: ['GunTong02_1', 'GunTong02_2', 'GunTong03_1', 'GunTong03_2', 'GunTong01_1', 'GunTong01_2', 'XuanZ_01', 'XuanZ_02'],
    rotateMesh: [],
    cameraState: {
      position: { x: -385.48531236599695, y: 34.316284718300054, z: 94.37294254683876 },
      target: { x: -325, y: 17, z: 0 }
    }
  }, {
    name: '1012进风顺槽',
    modelName: 'jjgzm',
    model: null,
    rotateMeshName: ['GunTong02_1', 'GunTong02_2', 'GunTong03_1', 'GunTong03_2', 'GunTong01_1', 'GunTong01_2', 'XuanZ_01', 'XuanZ_02'],
    rotateMesh: [],
    cameraState: {
      position: { x: -385.48531236599695, y: 34.316284718300054, z: 94.37294254683876 },
      target: { x: -325, y: 17, z: 0 }
    }
  }, {
    name: '1000回风顺槽',
    modelName: 'jjgzm',
    model: null,
    rotateMeshName: ['GunTong02_1', 'GunTong02_2', 'GunTong03_1', 'GunTong03_2', 'GunTong01_1', 'GunTong01_2', 'XuanZ_01', 'XuanZ_02'],
    rotateMesh: [],
    cameraState: {
      position: { x: -385.48531236599695, y: 34.316284718300054, z: 94.37294254683876 },
      target: { x: -325, y: 17, z: 0 }
    }
  }, {
    name: '变电所',
    modelName: 'bds',
    model: null,
    cameraState: {
      position: { x: -9.183068727946065, y: 11.10052625603611, z: 54.63494743 },
      target: { x: 12, y: 2, z: -67 }
    },
    light: {
      ambientLight: 5,
      directionLight: {
        position: { x: 28, y: 78, z: -170 },
        intensity: 0.5
      }
    }
  }, {
    name: '硐室',
    modelName: 'ts',
    model: null,
    cameraState: {
      position: { x: -0.3093126463213294, y: 11.727035310572795, z: 165.990725 },
      target: { x: 1.364810008556404, y: 0, z: 10.44429 }
    },
    light: {
      ambientLight: 2.4,
      directionLight: {
        position: { x: -199, y: 153, z: 490 },
        intensity: 1.1
      }
    }
  }, {
    name: '车场',
    modelName: 'jxcc',
    model: null,
    cameraState: {
      position: { x: -10.988701731980953, y: 9.639845533042365, z: -339.09349 },
      target: { x: 29.161178829448026, y: 9.573553611874645e-16, z: -188.6605 }
    },
    light: {
      ambientLight: 2.4,
      directionLight: {
        position: { x: -199, y: 153, z: 490 },
        intensity: 1.1
      }
    }
  }, {
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
  }, {
    name: '通风机',
    modelName: 'tfjf',
    model: null,
    cameraState: {
      position: { x: -9.521073252546508, y: 13.908286516854734, z: 107.7863630 },
      target: { x: 12, y: 6, z: 30 }
    },
    light: {
      ambientLight: 1.8,
      directionLight: {
        position: { x: -104, y: 99, z: -180 },
        intensity: 1.1
      }
    }
  }, {
    name: '瓦斯',
    modelName: 'wsb',
    model: null,
    cameraState: {
      position: { x: -384.6690627414645, y: 174.49079152217837, z: -37.03028 },
      target: { x: 55.536598513306814, y: -6.628203094673001e-15, z: 53.83176578 }
    },
    light: {
      ambientLight: 1.3,
      directionLight: {
        position: { x: 20, y: 82, z: 0 },
        intensity: 1.9
      }
    }
  }, {
    name: '运输',
    modelName: 'ysdx',
    model: null,
    cameraState: {
      position: { x: -4.6352181327133835, y: 12.460919224437124, z: 315.5377954 },
      target: { x: 8, y: 0, z: 178 }
    },
    light: {
      ambientLight: 1.4,
      directionLight: {
        position: { x: -96, y: 120, z: 220 },
        intensity: 1.3
      }
    }
  }]

// location popup 弹窗
const popupLocationList = [
  {
    name: '1010切眼',
    sub: '工作人员数量: 13人',
    position: { x: 278.81202800325644, y: 0, z: -360.275618 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '501综采工作面',
    sub: '工作人员数量: 13人',
    position: { x: 220, y: 0, z: 42 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '627综采工作面',
    sub: '工作人员数量: 13人',
    position: { x: -18.530259199427906, y: 0, z: -149.209289 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '820进风顺槽',
    sub: '工作人员数量: 13人',
    position: { x: -368, y: 0, z: 316 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '634进风顺槽',
    sub: '工作人员数量: 13人',
    position: { x: -350, y: 0, z: -331 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '632回风顺槽',
    sub: '工作人员数量: 13人',
    position: { x: -311, y: 0, z: -342 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '1012进风顺槽(反掘)',
    sub: '工作人员数量: 13人',
    position: { x: -65, y: 0, z: -391 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '1012进风顺槽',
    sub: '工作人员数量: 13人',
    position: { x: -22, y: 0, z: -392 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '1000回风顺槽',
    sub: '工作人员数量: 13人',
    position: { x: 371, y: 0, z: -222 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '1#中央变电所',
    sub: '',
    position: { x: 224, y: 0, z: 309 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '2#中央变电所',
    sub: '',
    position: { x: -216, y: 0, z: 178 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '北二2#变电所',
    sub: '',
    position: { x: -165, y: 0, z: -231 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '3#中央变电所',
    sub: '',
    position: { x: 424, y: 0, z: -244 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '西采区变电所',
    sub: '',
    position: { x: -36, y: 0, z: 229 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '八盘区变电所',
    sub: '',
    position: { x: -394, y: 0, z: 351 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '永久避险硐室',
    sub: '',
    position: { x: 310, y: 0, z: 78 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '北一避难硐室',
    sub: '',
    position: { x: 317, y: 0, z: 120 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '排矸硐室',
    sub: '',
    position: { x: 415, y: 0, z: -215 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '1000机头硐室',
    sub: '',
    position: { x: 410, y: 0, z: -218 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '北二避难硐室',
    sub: '',
    position: { x: -209, y: 0, z: -54 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '816回风机头硐室',
    sub: '',
    position: { x: -389, y: 0, z: -312 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '二号车场',
    sub: '',
    position: { x: 177, y: 0, z: 491 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '三号车场',
    sub: '',
    position: { x: 255, y: 0, z: 298 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '七号车场',
    sub: '',
    position: { x: -224, y: 0, z: 161 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '局部通风机',
    sub: '',
    position: { x: -386, y: 0, z: 303 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '局部通风机',
    sub: '',
    position: { x: -358, y: 0, z: 316 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '局部通风机',
    sub: '',
    position: { x: -376, y: 0, z: 279 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '局部通风机',
    sub: '',
    position: { x: -305, y: 0, z: 203 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '主要通风机',
    sub: '',
    position: { x: -338, y: 0, z: 146 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '主要通风机',
    sub: '',
    position: { x: -334, y: 0, z: 138 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '北一2#抽采瓦斯泵',
    sub: '',
    position: { x: 339, y: 0, z: -1 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '四号瓦斯斜井',
    sub: '',
    position: { x: 444, y: 0, z: -219 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '北二2#抽采瓦斯泵',
    sub: '',
    position: { x: -193, y: 0, z: -157 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '1009辅助运输顺槽',
    sub: '',
    position: { x: 417, y: 0, z: -309 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '1006辅助运输顺槽',
    sub: '',
    position: { x: 386, y: 0, z: -168 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '305运输巷',
    sub: '',
    position: { x: 353, y: 0, z: 175 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '304运输巷',
    sub: '',
    position: { x: 346, y: 0, z: 200 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '303运输顺槽',
    sub: '',
    position: { x: 334, y: 0, z: 224 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '302运输顺槽',
    sub: '',
    position: { x: 327, y: 0, z: 247 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '301运输顺槽',
    sub: '',
    position: { x: 314, y: 0, z: 274 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '300运输',
    sub: '',
    position: { x: 353, y: 0, z: 301 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '208运输',
    sub: '',
    position: { x: 221, y: 0, z: 363 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '402运输',
    sub: '',
    position: { x: 266, y: 0, z: 371 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '207运输',
    sub: '',
    position: { x: 212, y: 0, z: 384 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '406运输',
    sub: '',
    position: { x: 256, y: 0, z: 392 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '206运输',
    sub: '',
    position: { x: 205, y: 0, z: 408 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '406运输',
    sub: '',
    position: { x: 249, y: 0, z: 423 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '205运输',
    sub: '',
    position: { x: 150, y: 0, z: 437 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }, {
    name: '204运输',
    sub: '',
    position: { x: 186, y: 0, z: 474 },
    regionRate: {
      total: 95,
      member: Math.floor(Math.random() * 10) + 90,
      device: Math.floor(Math.random() * 10) + 90,
      environment: Math.floor(Math.random() * 10) + 90,
      manager: Math.floor(Math.random() * 10) + 90
    }
  }]

// Environment popup 的对应
const popupEnvironmentMap = [{
  shortName: 'CH4',
  name: 'GJG100J型甲烷传感器',
  imgUrl: '51'
}, {
  shortName: 'CO2',
  name: 'KGQ9二氧化碳传感器',
  imgUrl: '47'
}, {
  shortName: 'CO',
  name: 'KGA5一氧化碳传感器',
  imgUrl: '49'
}, {
  shortName: 'T',
  name: 'KG3007A温度传感器',
  imgUrl: '48'
}, {
  shortName: 'YW',
  name: 'KGQ5烟雾传感器',
  imgUrl: '50'
}, {
  shortName: 'FC',
  name: 'GCG1000粉尘传感器',
  imgUrl: '52'
}, {
  shortName: 'FY',
  name: 'KJY3A负压传感器',
  imgUrl: '53'
}]

// Environment popup 弹窗
const popupEnvironmentList = [{
  name: 'CH4',
  position: { x: 245, y: 0, z: 313 },
  id: '001487',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 243, y: 0, z: 303 },
  id: '000902',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 220, y: 0, z: 337 },
  id: '001424',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 296, y: 0, z: 144 },
  id: '008507',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 297, y: 0, z: 139 },
  id: '008512',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 304, y: 0, z: 86 },
  id: '000026',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 270, y: 0, z: 73 },
  id: '000176',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 222, y: 0, z: 58 },
  id: '000569',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 167, y: 0, z: 38 },
  id: '008474',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 161, y: 0, z: 34 },
  id: '003319',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'FC',
  position: { x: 161, y: 0, z: 36 },
  id: '005381',
  info: [{
    name: '粉尘浓度',
    value: '10mg/m³'
  }]
}, {
  name: 'T',
  position: { x: 425, y: 0, z: -257 },
  id: '003913',
  info: [{
    name: '温度',
    value: '28℃'
  }]
}, {
  name: 'CH4',
  position: { x: 395, y: 0, z: -338 },
  id: '000773',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 345, y: 0, z: -339 },
  id: '000005',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 279, y: 0, z: -340 },
  id: '000003',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 182, y: 0, z: -340 },
  id: '000001',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 24, y: 0, z: -142 },
  id: '004133',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CO',
  position: { x: 25, y: 0, z: -146 },
  id: '005215',
  info: [{
    name: 'CO浓度',
    value: '24PPM'
  }]
}, {
  name: 'FC',
  position: { x: 17, y: 0, z: -148 },
  id: '005216',
  info: [{
    name: '粉尘浓度',
    value: '10mg/m³'
  }]
}, {
  name: 'CH4',
  position: { x: 16, y: 0, z: 146 },
  id: '002304',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: -28, y: 0, z: -160 },
  id: '002407',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 207, y: 0, z: 414 },
  id: '001509',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'T',
  position: { x: 207, y: 0, z: 416 },
  id: '001058',
  info: [{
    name: '温度',
    value: '28℃'
  }]
}, {
  name: 'CO',
  position: { x: 26, y: 0, z: 391 },
  id: '001031',
  info: [{
    name: 'CO浓度',
    value: '0.2%'
  }]
}, {
  name: 'CO',
  position: { x: 312, y: 0, z: 85 },
  id: '005379',
  info: [{
    name: 'CO浓度',
    value: '0.2%'
  }]
}, {
  name: 'CH4',
  position: { x: 301, y: 0, z: 82 },
  id: '000054',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CH4',
  position: { x: 299, y: 0, z: 81 },
  id: '008476',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CO',
  position: { x: 299, y: 0, z: 82 },
  id: '009082',
  info: [{
    name: 'CO浓度',
    value: '0.2%'
  }]
}, {
  name: 'T',
  position: { x: 299, y: 0, z: 83 },
  id: '009091',
  info: [{
    name: '温度',
    value: '28℃'
  }]
}, {
  name: 'CH4',
  position: { x: 424, y: 0, z: -240 },
  id: '003909',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'T',
  position: { x: 423, y: 0, z: -239 },
  id: '003913',
  info: [{
    name: '温度',
    value: '28℃'
  }]
}, {
  name: 'CH4',
  position: { x: 424, y: 0, z: -240 },
  id: '003909',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}, {
  name: 'CO',
  position: { x: 405, y: 0, z: -200 },
  id: '000509',
  info: [{
    name: 'CO浓度',
    value: '0.2%'
  }]
}, {
  name: 'CH4',
  position: { x: 424, y: 0, z: -240 },
  id: '003909',
  info: [{
    name: 'CH4浓度',
    value: '0.9%'
  }]
}]

// 当前展示的popup 主要是第二层popup
const currentPopup = []

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
  { name: '重点监管', level: 1, img: [34, 35, 40, 59] },
  { name: '加强监管', level: 2, img: [36, 37, 41, 60] },
  { name: '需关注', level: 3, img: [30, 31, 38, 61] },
  { name: '安全', level: 4, img: [32, 33, 39, 62] }
]

// 0 显示全部
let personShowType = [0, 1, 2, 3, 4]


// 辉光bloom
const bloomList = []

// 动画开关
let animationFlag = true

// 渲染开关
let pause3D = false

export const STATE = {
  initialState,
  sceneList,
  popupLocationList,
  popupEnvironmentList,
  popupEnvironmentMap,
  personShowType,
  currentPopup,
  monitorList,
  baseStationList,
  personList,
  personMap,
  bloomList,
  clickObjects,
  roomModelName,
  PUBLIC_PATH,
  router,
  animationFlag,
  pause3D,
  clock
}
