import { API } from './API.js'
import { CACHE } from './CACHE.js'
import { STATE } from './STATE.js'
import { DATA } from './DATA.js'

let container

export const sceneOnLoad = ({ domElement, callback }) => {
  container = new Bol3D.Container({
    publicPath: STATE.PUBLIC_PATH,
    container: domElement,
    viewState: 'orbit',
    hdrUrls: ['/hdr/2.hdr'],
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
        // minDistance: 0,
        maxDistance: 5000,
        maxPolarAngle: STATE.initialState.maxPolarAngle,
        minPolarAngle: STATE.initialState.minPolarAngle,
        // maxPolarAngle: 3.14,
        // minPolarAngle: 0,
        enableDamping: false,
        dampingFactor: 0,
      }
    },
    lights: {
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
      ambientLight: {
        color: '#ffffff',
        intensity: 3
      }
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
      '/model/zcgzm.glb' // 综采
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
    outlineEnabled: false,
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
      if (model.name === 'jjgzm') {
        model.visible = false
        model.scale.set(10, 10, 10)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })
        model.traverse(child => {
          if (child.isMesh) {
            STATE.clickObjects.push(child)

            STATE.roomModelName.forEach(e => {
              if (e.rotateMeshName.includes(child.name)) {
                if (child.name === 'XuanZ_01' || child.name === 'XuanZ_02') {
                  e.rotateMesh.push({ mesh: child, position: 'x', num: 0.1 })
                } else {
                  e.rotateMesh.push({ mesh: child, position: 'z', num: 0.1 })
                }
              }
            })
          }
        })

      } else if (model.name === 'zcgzm') {
        model.visible = false
        model.scale.set(5, 5, 5)
        STATE.roomModelName.forEach(e => {
          if (e.modelName === model.name) {
            e.model = model
          }
        })
        model.traverse(child => {
          if (child.isMesh) {
            STATE.clickObjects.push(child)
            if (child.name === 'xd') {
              // child.material.transparent = true
              // child.material.opacity = 0.5
              child.material.side = 0
            } else {
              STATE.roomModelName.forEach(e => {
                if (e.rotateMeshName.includes(child.name)) {
                  e.rotateMesh.push({ mesh: child, position: 'x', num: 0.1 })
                  e.rotateMesh.push({ mesh: child, position: 'x', num: 0.1 })
                }
              })
            }
          }
        })
      } else if (model.name === 'mkxdw') {
        model.traverse(child => {
          if (child && child.isMesh) {
            STATE.clickObjects.push(child)

            const textArr = ["1009", "624", "620", "1001", "626", "627", "628", "629", "630", "631", "632", "609", "607", "605", "603", "601", "814", "812", "810", "801", "803", "805", "807", "809", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "311", "310", "309", "308", "307", "306", "305", "304", "303", "302", "301", "300", "402", "404", "406", "203", "204", "205", "206", "207", "208", "209"]
            const workLocationArr = ['627zcgzm', '501zcgzm', '1010zcgzm', 'jjgzm']
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
              STATE.bloomList.push(child)
            } else {
              child.material.transparent = true
              child.material.opacity = 0.2
            }
          }
        })
      }
    },
    onLoad: (evt) => {
      CACHE.container = evt
      window.container = evt
      CACHE.container.sceneList = STATE.sceneList
      CACHE.container.attach(STATE.sceneList.text)
      console.log(STATE.sceneList)




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
      API.initMonitorIconList()
      API.initPersonPopup()
      API.initLocationPopup()
      API.initEnvironmentPopup()
      // API.testBox()
      // API.loadGUI()
      CACHE.container.loadingBar.style.visibility = 'hidden'
      API.render()
      callback && callback()
    }
  })

  const events = new Bol3D.Events(container)
  events.ondbclick = (e) => {
    if (e.objects.length) {
      const obj = e.objects[0].object
      console.log('obj: ', obj);
    }
  }

  events.onhover = (e) => { }
}
