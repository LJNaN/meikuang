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
    bloomEnabled: true,
    bloom: {
      bloomStrength: 1.5, // 强度
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
    controls: {
      orbitControls: {
        autoRotate: false,
        autoRotateSpeed: 1,
        target: [STATE.initialState.target.x, STATE.initialState.target.y, STATE.initialState.target.z],
        // minDistance: 0,
        // maxDistance: 2500,
        maxPolarAngle: Math.PI,
        minPolarAngle: 0,
        enableDamping: true,
        dampingFactor: 0.05,
      }
    },
    lights: {
      directionLights: [{ color: 0xedeacc, intensity: 1.0, position: [20.3, 70, 40.2], mapSize: [4096, 4096], near: 10, far: 15000, bias: -0.001, distance: 8000 }],
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
    stats: true,
    // loadingBar: {
    //   show: true,
    //   type: 10
    // }
    onProgress: (model) => {
      STATE.sceneList[model.name] = model
      if (model.name === 'jjgzm') {
        model.visible = false
        model.scale.set(10, 10, 10)
        STATE.roomModelName[2].model = model
        model.traverse(child => {
          if (child.isMesh) {
            if (STATE.roomModelName[2].rotateMeshName.includes(child.name)) {
              if (child.name === 'XuanZ_01' || child.name === 'XuanZ_02') {
                STATE.roomModelName[2].rotateMesh.push({ mesh: child, position: 'x', num: 0.1 })
              } else {
                STATE.roomModelName[2].rotateMesh.push({ mesh: child, position: 'z', num: 0.1 })
              }
              STATE.bloomList.push(child)
            }
          }
        })

      } else if (model.name === 'zcgzm') {
        model.visible = false
        model.scale.set(5, 5, 5)
        STATE.roomModelName[0].model = model
        STATE.roomModelName[1].model = model
        model.traverse(child => {
          if (child.isMesh) {
            if (child.name === 'xd') {
              child.material.transparent = true
              child.material.opacity = 0.5
            } else if (STATE.roomModelName[0].rotateMeshName.includes(child.name)) {
              STATE.roomModelName[0].rotateMesh.push({ mesh: child, position: 'x', num: 0.1 })
              STATE.roomModelName[1].rotateMesh.push({ mesh: child, position: 'x', num: 0.1 })
              STATE.bloomList.push(child)
            }
          }
        })
      }
    },
    onLoad: (evt) => {
      CACHE.container = evt
      window.container = evt
      CACHE.container.sceneList = STATE.sceneList

      API.initPopup()


      console.log(STATE.roomModelName)
      STATE.bloomList.forEach(e => {
        CACHE.container.addBloom(e)
      })

      API.render()
      // API.loadGUI()
      callback && callback()
    }
  })

  const events = new Bol3D.Events(container)
  events.ondbclick = (e) => { }

  events.onhover = (e) => { }
}
