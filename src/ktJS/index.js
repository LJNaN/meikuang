import { API } from './API.js'
import { CACHE } from './CACHE.js'
import { STATE } from './STATE.js'
import { DATA } from './DATA.js'
import TU from './threeUtils.js'

let container

export const sceneOnLoad = ({ domElement, callback }) => {
  container = new Bol3D.Container({
    publicPath: STATE.PUBLIC_PATH,
    container: domElement,
    viewState: 'orbit',
    hdrUrls: ['/hdr/2.hdr'],
    renderer: {
      alpha: false,
      logarithmicDepthBuffer: true, // 解决z精度造成的重叠闪面（默认true）
      antialias: true, // 抗锯齿
      precision: 'highp',
      preserveDrawingBuffer: true
    },
    bloomEnabled: true,
    bloom: {
      bloomStrength: 0.5, // 强度
      threshold: 0, // 阈值
      bloomRadius: 0, // 半径
    },
    cameras: {
      orbitCamera: {
        position: [STATE.initialState.position.x, STATE.initialState.position.y, STATE.initialState.position.z],
        near: 1,
        far: 50000,
        fov: 30
      }
    },
    bounds: {
      radius: 5000,
      center: [0, 0, 0]
    },
    controls: {
      orbitControls: {
        autoRotate: false,
        autoRotateSpeed: 1,
        target: [STATE.initialState.target.x, STATE.initialState.target.y, STATE.initialState.target.z],
        minDistance: 20,
        maxDistance: 5000,
        maxPolarAngle: STATE.initialState.maxPolarAngle,
        minPolarAngle: STATE.initialState.minPolarAngle,
        // maxPolarAngle: 3.14,
        // minPolarAngle: 0,
        enableDamping: false,
        dampingFactor: 0
      }
    },
    lights: {
      directionLights: STATE.initialState.directionLights,
      ambientLight: STATE.initialState.ambientLight,
      spotLights: STATE.initialState.spotLights
    },
    background: {
      type: 'panorama',
      value: ['/hdr/48.jpg'],
      options: {
        scale: 0.5,
        rotation: [0, 0, 0],
        fog: true, // 天空盒受雾影响 默认值为false
      }
    },
    modelUrls: [
      '/model/mkxdw.glb', // 主
      '/model/jjgzm.glb', // 101切眼
      '/model/zcgzm.glb', // 综采
      '/model/ts.glb', // 硐室
      '/model/jxcc.glb', // 井下车场
      '/model/yfjf.glb', // 压风机房
      '/model/sbf.glb', // 水泵房
      '/model/tfjf.glb', // 通风机房
      '/model/bds.glb', // 变电所
      '/model/ysdx.glb', // 运输大巷
      '/model/wsb.glb', // 瓦斯泵
    ],
    enableShadow: false,
    antiShake: false,
    // fog: {
    //   color: '#2c4027',
    //   intensity: 0.00022
    // },
    toneMapping: {
      toneMappingExposure: 0.596
    },
    outlineEnabled: true, // 需要开启该参数
    outline: {
      edgeStrength: 3,
      edgeGlow: 0,
      edgeThickness: 1,
      pulsePeriod: 0,
      visibleEdgeColor: '#61cef6',
      hiddenEdgeColor: '#61cef6'
    },
    dofEnabled: false,
    msaa: {
      supersampling: false
    },
    gammaEnabled: true,
    stats: false,
    loadingBar: {
      show: true,
      type: 10
    },
    onProgress: (model) => {
      STATE.sceneList[model.name] = model
      if (model.name === 'jjgzm') {  // 101切眼
        model.visible = false
        model.scale.set(10, 10, 10)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })
        model.traverse(child => {
          // 主体点击
          const mainMeshName = STATE.roomModelName.find(e => e.modelName === 'jjgzm').mainMeshName
          if (mainMeshName.includes(child.name)) {
            if (child.type === 'Group' || child.type === 'Object3D') {
              child.traverse(child2 => {
                if (child2.isMesh) {
                  STATE.clickObjects.push(child2)
                  child2.userData.modelName = 'jjgzm'
                }
              })
            } else if (child.isMesh) {
              STATE.clickObjects.push(child)
              child.userData.modelName = 'jjgzm'
            }
          }


          if (child.isMesh) {
            STATE.roomModelName.forEach(e => {
              if (e.rotateMeshName?.includes(child.name)) {
                if (child.name === 'XuanZ_01' || child.name === 'XuanZ_02') {
                  e.rotateMesh.push({ mesh: child, position: 'x', num: 0.1 })
                } else {
                  e.rotateMesh.push({ mesh: child, position: 'z', num: 0.1 })
                }
              }
            })
          }
        })

      } else if (model.name === 'zcgzm') { // 综采
        model.visible = false
        model.scale.set(5, 5, 5)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })
        model.traverse(child => {
          // 主体点击
          const mainMeshName = STATE.roomModelName.find(e => e.modelName === 'zcgzm').mainMeshName
          if (mainMeshName.includes(child.name)) {
            if (child.type === 'Group' || child.type === 'Object3D') {
              child.traverse(child2 => {
                if (child2.isMesh) {
                  STATE.clickObjects.push(child2)
                  child2.userData.modelName = 'zcgzm'
                }
              })
            } else if (child.isMesh) {
              STATE.clickObjects.push(child)
              child.userData.modelName = 'zcgzm'
            }
          }

          if (child.name === 'ji001') {
            child.name = 'CMJGroup'
          }

          if (child.isMesh) {
            if (child.name === 'xd') {
              // child.material.transparent = true
              // child.material.opacity = 0.5
              child.material.side = 0
            } else {
              STATE.roomModelName.forEach(e => {
                if (e.rotateMeshName?.includes(child.name)) {
                  e.rotateMesh.push({ mesh: child, position: 'x', num: 0.1 })
                  e.rotateMesh.push({ mesh: child, position: 'x', num: 0.1 })
                }
              })
            }
          }
        })
      } else if (model.name === 'ts') { // 酮室
        model.visible = false
        model.scale.set(7, 7, 7)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })

        model.traverse(child => {
          if (child.name === 'xd003_1') {
            child.material.side = 0
          }
        })
      } else if (model.name === 'jxcc') { // 车场
        model.visible = false
        model.scale.set(5, 5, 5)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })

        model.traverse(child => {
          if (child.name === 'hd003_2') {
            child.material.side = 0
          }
        })
      } else if (model.name === 'sbf') { // 水泵房
        model.visible = false
        model.scale.set(10, 10, 10)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })

        model.traverse(child => {
          if (child.name === 'xd003_1') {
            child.material.side = 0
          }
        })

      } else if (model.name === 'yfjf') { // 压风机房
        model.visible = false
        model.scale.set(5, 5, 5)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })

        model.traverse(child => {
          if (child.name === 'yfjf_2') {
            child.material.side = 0
            child.material.transparent = true
            child.material.opacity = 0.5
          } else if (child.name === 'yfjf_4') {
            child.material.transparent = true
            child.material.opacity = 0.2
          }
        })
      } else if (model.name === 'tfjf') { // 通风机
        model.visible = false
        model.scale.set(5, 5, 5)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })

        model.traverse(child => {
          if (child.name === 'xd003_1') {
            child.material.side = 0
          }
        })
      } else if (model.name === 'bds') { // 变电所
        model.visible = false
        model.scale.set(5, 5, 5)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })

        model.traverse(child => {
          if (child.name === 'bdshangdao_3') {
            child.material.side = 0
          }
        })
      } else if (model.name === 'wsb') { // 瓦斯泵
        model.visible = false
        model.scale.set(5, 5, 5)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })

        model.traverse(child => {
          if (child.name === 'wsczbzf_2') {
            child.material.transparent = true
            child.material.opacity = 0.5
          } else if (child.name === 'wsczbzf_4') {
            child.material.transparent = true
            child.material.opacity = 0.2
          }
        })
      } else if (model.name === 'ysdx') { // 运输大巷
        model.visible = false
        model.scale.set(5, 5, 5)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })

        model.traverse(child => {
          if (child.name === 'ding_2') {
            child.material.side = 0
          }
        })
      } else if (model.name === 'mkxdw') { // 主场景
        const textArr = ["1009", "627_(1)", "501", "1009", "624", "620", "1001", "626", "627", "628", "629", "630", "631", "632", "609", "607", "605", "603", "601", "814", "812", "810", "801", "803", "805", "807", "809", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "311", "310", "309", "308", "307", "306", "305", "304", "303", "302", "301", "300", "402", "404", "406", "203", "204", "205", "206", "207", "208", "209"]
        const workLocationArr = ['627zcgzm', '501zcgzm', '1010zcgzm', 'jjgzm']
        model.traverse(child => {
          if (child && child.isMesh) {

            if (textArr.includes(child.name)) {
              if (!STATE.sceneList.text) {
                STATE.sceneList.text = new Bol3D.Group()
                STATE.sceneList.text.name = 'text'
              }
              STATE.sceneList.text.add(child.clone())
              child.visible = false
              child.material.dispose()
              child.geometry.dispose()
              if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
              child = null
            } else if (workLocationArr.includes(child.name)) {
              child.material.transparent = true
              child.material.opacity = 0.5
            } else if (child.name === 'hangdao') {
              child.material.transparent = true
              child.material.opacity = 0.4
              // STATE.bloomList.push(child)
            } else {
              child.material.transparent = true
              child.material.opacity = 0.2
            }

            // 不知道这块怎么隐藏不了，不显示了
            if (child && child.name === '1010zcgzm') {
              child.visible = false
            }

            // 预存几个不同状态的材质
            if (child && child.name === '627zcgzm') {
              STATE.statusMaterial.toLeft = child.material.clone()

            } else if (child && child.name === '501zcgzm') {
              STATE.statusMaterial.toRight = child.material.clone()

            } else if (child && child.name === '625gzm') {
              STATE.statusMaterial.over = child.material.clone()
            }
          }
        })

        model.traverse(child => {
          if (child && child.isMesh) {
            if (child.name.includes('gzm') || child.name.includes('jia')) {
              child.material = STATE.statusMaterial.over.clone()
            }
          }
        })
        container.loadingBar.style.visibility = 'hidden'
      }
    },
    onLoad: (evt) => {
      CACHE.container = evt
      window.container = evt
      CACHE.container.sceneList = STATE.sceneList
      CACHE.container.attach(STATE.sceneList.text)

      console.log(
        "%c欢迎打开控制台",
        "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
      );
      console.log(
        "%c新增区域操作步骤：1.使用 markStart() 函数开始标注新区域",
        "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
      );
      console.log(
        "%c2.使用 markStep() 在新区域的四周进行标注，请多次执行此函数以围成一个多边形区域",
        "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
      );
      console.log(
        "%c3.标注完成后请复制区域内容，打开项目包的 /data/workfaceArea.js ，并参照文件内容格式新增 name 与 value 即可",
        "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
      );
      console.log(
        "%c4.使用 markReset() 清空暂存数组，退出编辑模式请直接刷新",
        "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
      );


      // 处理text
      STATE.sceneList.text.children.forEach(e => {
        STATE.bloomList.push(e)
      })

      // 处理点击和辉光
      CACHE.container.clickObjects = STATE.clickObjects
      STATE.bloomList.forEach(e => {
        CACHE.container.addBloom(e)
      })

      // remove unused obj3d
      for (const i in CACHE.removed) {
        const removed = CACHE.removed[i]
        removed.parent.remove(removed)
      }
      delete CACHE.removed

      // 加载弹窗
      // API.initPersonPopup()
      // API.initEnvironmentPopup()
      // API.initLocationPopup()


      // 左右键行为
      // CACHE.container.orbitControls.mouseButtons = {
      //   LEFT: Bol3D.MOUSE.PAN,
      //   MIDDLE: Bol3D.MOUSE.DOLLY,
      //   RIGHT: Bol3D.MOUSE.ROTATE
      // }


      API.initmonitorList()
      // API.initBaseStationPopup()

      console.log(STATE.roomModelName)
      console.log(STATE.sceneList)
      window.STATE = STATE
      window.CACHE = CACHE
      window.API = API

      TU.init(container, Bol3D)

      window.markStart = (() => {
        API.testBox()
      })
      // API.testBox()
      // API.loadGUI()
      API.render()
      callback && callback()
    }
  })

  const events = new Bol3D.Events(container)
  events.onclick = (e) => {
    if (e.objects.length) {
      const obj = e.objects[0].object
      console.log('obj: ', obj);

      // 点击出现弹窗 主要是切眼和综采机器的交互
      if (obj.userData.modelName === 'zcgzm') {
        const CMJGroup = STATE.sceneList.zcgzm.children.find(e => e.name === 'CMJGroup')
        let popup = CMJGroup.children.find(e => e.name === 'machine_group_zongcai')
        if (popup) {
          CMJGroup.remove(popup)
          popup.children[0].element.remove()
          delete STATE.sceneList.mainMachinePopup
        }
        API.initMainMachinePopup('zongcai')

      } else if (obj.userData.modelName === 'jjgzm') {
        let popup = STATE.sceneList.mainMachinePopup
        if (popup) {
          popup.parent.remove(popup)
          popup.children[0].element.remove()
          delete STATE.sceneList.mainMachinePopup
        }
        API.initMainMachinePopup('qieyan')
      }
    }
  }

  events.onhover = (e) => {
    if (e.objects.length) {
      const obj = e.objects[0].object

      // 边缘光  主要是切眼和综采机器的交互
      STATE.outlineObjects = []
      if (obj.userData.modelName) {
        const scene = STATE.roomModelName.find(e2 => e2.modelName === obj.userData.modelName)
        const mainMeshName = scene.mainMeshName

        scene.model.traverse(child => {
          if (mainMeshName.includes(child.name)) {
            if (child.type === 'Group' || child.type === 'Object3D') {
              child.traverse(child2 => {
                if (child2.isMesh) {
                  STATE.outlineObjects.push(child2)
                }
              })
            } else if (child.isMesh) {
              STATE.outlineObjects.push(child)
            }

          }
        })
        container.outlineObjects = STATE.outlineObjects
      }
    } else {
      STATE.outlineObjects = []
      container.outlineObjects = []
    }
  }
}
