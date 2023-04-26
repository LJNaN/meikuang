import { STATE } from './STATE.js'
import { CACHE } from './CACHE.js'

// 相机动画（传指定state）
const targetPos = new Bol3D.Vector3()
const pos = new Bol3D.Vector3()
function cameraAnimation({ cameraState, callback, delayTime = 0, duration = 800 }) {
  targetPos.set(cameraState.target.x, cameraState.target.y, cameraState.target.z)
  pos.set(cameraState.position.x, cameraState.position.y, cameraState.position.z)

  if (targetPos.distanceTo(CACHE.container.orbitControls.target) < 0.1 && pos.distanceTo(CACHE.container.orbitControls.object.position) < 0.1) {
    callback && callback()
    return
  }

  if (STATE.isAnimating) return
  STATE.isAnimating = true

  CACHE.container.orbitControls.enabled = false

  let count = 0

  const t1 = new Bol3D.TWEEN.Tween(CACHE.container.orbitControls.object.position)
    .to(
      {
        x: cameraState.position.x,
        y: cameraState.position.y,
        z: cameraState.position.z
      },
      duration
    )
    .onUpdate(() => { })
    .onComplete(() => {
      count++

      if (count == 2) {
        CACHE.container.orbitControls.enabled = true
        STATE.isAnimating = false
        callback && callback()
      }
    })

  t1.delay(delayTime).start()

  const t2 = new Bol3D.TWEEN.Tween(CACHE.container.orbitControls.target)
    .to(
      {
        x: cameraState.target.x,
        y: cameraState.target.y,
        z: cameraState.target.z
      },
      duration
    )
    .onUpdate(() => { })
    .onComplete(() => {
      count++
      if (count == 2) {
        CACHE.container.orbitControls.enabled = true
        STATE.isAnimating = false
        callback && callback()
      }
    })

  t1.delay(delayTime).start()
  t2.delay(delayTime).start()

  return t1
}

function loadGUI() {
  // gui
  const gui = new dat.GUI()
  // default opts
  const deafultsScene = { distance: 8000, }
  // scenes
  const scenesFolder = gui.addFolder('场景')
  // toneMapping
  scenesFolder.add(CACHE.container.renderer, 'toneMappingExposure', 0, 10).step(0.001).name('exposure')
  scenesFolder.add(CACHE.container.ambientLight, 'intensity').step(0.1).min(0).max(10).name('环境光强度')
  scenesFolder.add(CACHE.container.gammaPass, 'enabled').name('gamma校正')
  scenesFolder
    .addColor(CACHE.container.attrs.lights.directionLights[0], 'color')
    .onChange((val) => {
      CACHE.container.directionLights[0].color.set(val)
    })
    .name('平行光颜色')
  scenesFolder.add(CACHE.container.directionLights[0].position, 'x')
  scenesFolder.add(CACHE.container.directionLights[0].position, 'y')
  scenesFolder.add(CACHE.container.directionLights[0].position, 'z')
  scenesFolder.add(deafultsScene, 'distance').onChange((val) => {
    CACHE.container.directionLights[0].shadow.camera.left = -val
    CACHE.container.directionLights[0].shadow.camera.right = val
    CACHE.container.directionLights[0].shadow.camera.top = val
    CACHE.container.directionLights[0].shadow.camera.bottom = -val
    CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
    CACHE.container.directionLights[0].shadow.needsUpdate = true
  })
  scenesFolder.add(CACHE.container.directionLights[0].shadow.camera, 'far').onChange(() => {
    CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
    CACHE.container.directionLights[0].shadow.needsUpdate = true
  })
  scenesFolder.add(CACHE.container.directionLights[0].shadow.camera, 'near').onChange(() => {
    CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
    CACHE.container.directionLights[0].shadow.needsUpdate = true
  })
  scenesFolder
    .add(CACHE.container.directionLights[0].shadow, 'bias')
    .step(0.0001)
    .onChange(() => {
      CACHE.container.directionLights[0].shadow.needsUpdate = true
    })
  scenesFolder.add(CACHE.container.directionLights[0], 'intensity').step(0.1).min(0).max(10)

  // filter pass
  const filterFolder = gui.addFolder('滤镜')
  const defaultsFilter = {
    hue: 0,
    saturation: 1,
    vibrance: 0,
    brightness: 0,
    contrast: 1
  }
  filterFolder.add(CACHE.container.filterPass, 'enabled')
  filterFolder
    .add(defaultsFilter, 'hue')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.hue.value = val
    })
  filterFolder
    .add(defaultsFilter, 'saturation')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.saturation.value = val
    })
  filterFolder
    .add(defaultsFilter, 'vibrance')
    .min(0)
    .max(10)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.vibrance.value = val
    })

  filterFolder
    .add(defaultsFilter, 'brightness')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.brightness.value = val
    })
  filterFolder
    .add(defaultsFilter, 'contrast')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.contrast.value = val
    })


}

/**
 * 加载地方的3d弹窗
 */
function initLocationPopup() {
  STATE.popupLocationList.forEach((e, index) => {
    // location 的popup
    const popup = new Bol3D.POI.Popup3D({
      value: `
        <div style="
          margin:0;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -27%);
        ">

          <div style="
            background: url('./assets/3d/image/1.png') center / 100% 100% no-repeat;
            width: 16vw;
            height:10vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
            <p style="
              pointer-events: all;
              cursor: pointer;
              font-family: YouSheBiaoTiHei;
              font-size: 3vh;
              text-align: center;">${e.name}
            </p>
            <p style="font-size: 1vh; margin-top: 0.5vh;">${e.sub}</p>
          </div>
    
          <div style="
            background: url('./assets/3d/image/2.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:13vh;
          ">
          </div>
  
          <div style="
            background: url('./assets/3d/image/3.png') center / 100% 100% no-repeat;
            width: 7vw;
            height:5vh;
            position: relative;
            top: -3vh;
          ">
          </div>
        </div>
      `,
      position: [0, 0, 0],
      className: 'popup3dclass popup3d_location',
      scale: [0.3, 0.3, 0.3],
      closeVisible: 'hidden'
    })
    const group = new Bol3D.Group()
    group.add(popup)
    group.position.set(e.position.x, 0, e.position.z)
    group.name = 'location_group_' + e.name
    popup.name = e.name

    // location 的区域风险的环境评分弹窗
    const popup2 = new Bol3D.POI.Popup3D({
      value: `
        <div style="
          margin:0;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -182%);
        ">

          <div style="
            background: url('./assets/3d/image/44.png') center / 100% 100% no-repeat;
            width: 30vw;
            height:25vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
            <p style="
              position: absolute;
              top: 13%;
              font-size: 3vh;
              font-family: YouSheBiaoTiHei;">区域评分: ${e.regionRate.total}
            </p>

            <div style="
              width: 80%;
              height: 35%;
              position: absolute;
              display: flex;
              justify-content: space-between;
              top: 41%;
            ">
              <div style="
                position: absolute;
                top: 40%;
                width: 120%;
                left: -10%;
                height: 1px;
                background: linear-gradient(-90deg, rgba(11, 16, 19, 0), rgba(97, 158, 225, 0.88), rgba(91, 175, 227, 0.88), rgba(97, 158, 225, 0.88), rgba(11, 16, 19, 0));
                opacity: 0.5;
                ">
              </div>

              <div style="
                position: absolute;
                top: 105%;
                width: 120%;
                left: -10%;
                height: 1px;
                background: linear-gradient(-90deg, rgba(11, 16, 19, 0), rgba(97, 158, 225, 0.88), rgba(91, 175, 227, 0.88), rgba(97, 158, 225, 0.88), rgba(11, 16, 19, 0));
                opacity: 0.5;
                ">
              </div>

              <div style="
                  display: flex;
                  flex: 1;
                  flex-direction: column;
                  justify-content: space-between;
                  align-items: center;
              ">
                <p>人员</p>
                <p>${e.regionRate.member || ''}</p>
              </div>
              <div style="
                  display: flex;
                  flex: 1;
                  flex-direction: column;
                  justify-content: space-between;
                  align-items: center;
              ">
                <p>设备</p>
                <p>${e.regionRate.device || ''}</p>
              </div>
              <div style="
                  display: flex;
                  flex: 1;
                  flex-direction: column;
                  justify-content: space-between;
                  align-items: center;
              ">
                <p>环境</p>
                <p>${e.regionRate.environment || ''}</p>
              </div>
              <div style="
                  display: flex;
                  flex: 1;
                  flex-direction: column;
                  justify-content: space-between;
                  align-items: center;
              ">
                <p>管理</p>
                <p>${e.regionRate.manager || ''}</p>
              </div>
            </div>
          </div>
        </div>
      `,
      position: [0, 0, 0],
      className: 'popup3dclass popup3d_location_region',
      scale: [0.2, 0.2, 0.2],
      closeVisible: 'show'
    })
    popup2.visible = false
    group.add(popup2)

    // 双击popup 判断是弹窗还是他妈的直接进去
    popup.element.addEventListener("dblclick", () => {
      if (CACHE.regionalRateMode) {
        popup2.visible = true
        const cameraState = {
          position: { x: e.position.x + 200, y: 200, z: e.position.z + 200 },
          target: { x: e.position.x, y: 60, z: e.position.z }
        }
        cameraAnimation({ cameraState })
      } else {
        popup2.visible = false
        enterRoom(e.name)
      }
    })



    CACHE.container.attach(group)
    if (!STATE.sceneList.locationPopup) {
      STATE.sceneList.locationPopup = []
    }
    STATE.sceneList.locationPopup.push(group)
  })
}

/**
 * 加载环境的3d弹窗
 */
function initEnvironmentPopup() {
  STATE.popupEnvironmentList.forEach((e, index) => {
    const map = STATE.popupEnvironmentMap.find(e2 => e2.shortName === e.name)
    const popup = new Bol3D.POI.Popup3D({
      value: `
        <div style="
          margin:0;
          cursor: pointer;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -17%);
        ">

          <div style="
            background: url('./assets/3d/image/${map.imgUrl}.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:6vw;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
          </div>
    
          <div style="
            background: url('./assets/3d/image/2.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:13vh;
            position: relative;
            top: -5vh;
          ">
          </div>
  
          <div style="
            background: url('./assets/3d/image/3.png') center / 100% 100% no-repeat;
            width: 7vw;
            height:5vh;
            position: relative;
            top: -7vh;
          ">
          </div>
        </div>
      `,
      position: [0, 0, 0],
      className: 'popup3dclass',
      scale: [0.1, 0.1, 0.1],
      closeVisible: 'hidden'
    })
    // 加group来间接改变popup的中心点
    const group = new Bol3D.Group()
    group.add(popup)
    group.position.set(e.position.x, 0, e.position.z)
    group.name = 'environment_group_' + e.id
    popup.name = e.id
    popup.visible = false



    popup.element.addEventListener('dblclick', (() => {
      STATE.currentPopup.forEach(e2 => {
        CACHE.container.remove(e2)
      })

      cameraAnimation({
        cameraState: {
          position: { x: e.position.x + 200, y: 200, z: e.position.z + 200 },
          target: e.position
        }
      })

      // 设置点击之后的弹窗
      let contentText = ``
      if (e.info) e.info.forEach(e2 => {
        contentText += `<p style="font-size: 1.6vh;">${e2.name}: ${e2.value}</p>`
      })
      const popup2 = new Bol3D.POI.Popup3D({
        value: `
        <div style="
          margin:0;
          cursor: pointer;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -115%);
        ">

          <div style="
            background: url('./assets/3d/image/15.png') center / 100% 100% no-repeat;
            width: 23vw;
            height:15vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
            <p style="position: absolute; top: 19%;font-size: 1.6vh;font-family: YouSheBiaoTiHei;">${map.name}</p>
            <div style="width: 75%; height: 45%; margin-top: 8%; display: flex; flex-direction: column; justify-content: space-around;">
              ${contentText}
            </div>
          </div>
        </div>
        `,
        position: [e.position.x, 0, e.position.z],
        className: 'popup3dclass popup3d_enviroment_detail',
        scale: [0.2, 0.2, 0.2],
        closeVisible: 'show'
      })
      STATE.currentPopup.push(popup2)
      CACHE.container.attach(popup2)
    }))

    CACHE.container.attach(group)

    // if(e.id === '001487') {
    //   setModelPosition(group)
    // }

    if (!STATE.sceneList.environmentPopup) {
      STATE.sceneList.environmentPopup = []
    }
    STATE.sceneList.environmentPopup.push(group)
  })
}


/**
 * 显示隐藏3d弹窗
 */
function showPopup(groups = [], isShow = true) {
  STATE.currentPopup.forEach(e => {
    CACHE.container.remove(e)
  })

  groups.forEach(group => {
    // 如果里面还有组  主要是针对 monitorIcon
    if (group.type && group.type === 'Group') {
      group.visible = isShow
      group.children.forEach(item => {
        item.traverse(child => {
          child.visible = isShow
        })
      })
    } else { // 如果直接是mesh
      group.forEach(item => {
        // 针对location location[0]动态 [1]为false 只有双击才显示
        if (item.name.includes('location_group_')) {
          item.children[0].visible = isShow
          item.children[1].visible = false
        } else {
          item.traverse(child => {
            child.visible = isShow
          })
        }
      })
    }

  })
}

// 加载监控摄像头
function initMonitorIconList() {
  STATE.monitorIconList.forEach(e => {
    const icon = new Bol3D.POI.Icon({
      position: [e.position.x, e.position.y, e.position.z],
      url: './assets/3d/image/29.png',
      scale: [15, 15],
      color: 0xffffff
    })

    if (!STATE.sceneList.monitorIcon) {
      STATE.sceneList.monitorIcon = new Bol3D.Group()
    }
    STATE.sceneList.monitorIcon.add(icon)

  })
  container.attach(STATE.sceneList.monitorIcon)


  setTimeout(() => {
    STATE.sceneList.monitorIcon.children.forEach(e => {
      e.material.transparent = false
      e.material.alphaToCoverage = true
    })
  }, 1000);
}

// 加载监管人员
function initPersonPopup() {
  STATE.personList.forEach((e, index) => {
    const map = STATE.personMap.find(e2 => e2.level === e.level)
    // 一根竖直的弹窗
    const popup = new Bol3D.POI.Popup3D({
      value: `
      <div style="
        pointer-events: all;
        cursor: pointer;
        margin:0;
        color: #ffffff;
      ">
        
        <div style="
          position: absolute;
          background: url('./assets/3d/image/${map.img[0]}.png') center / 100% 100% no-repeat;
          width: 2vw;
          height:8vh;
          transform: translate(-50%, -50%);
        ">
        </div>
      </div>
      `,
      position: [0, 20, 0],
      className: 'popup3dclass',
      scale: [0.4, 0.4, 0.4],
      closeVisible: 'hidden'
    })

    // 圆点
    const popup3 = new Bol3D.POI.Popup3D({
      value: `
      <div style="
        pointer-events: all;
        margin:0;
        cursor: pointer;
        color: #ffffff;
      ">

        <div style="
          position: absolute;
          background: url('./assets/3d/image/${map.img[3]}.png') center / 100% 100% no-repeat;
          width: 2vw;
          height:2vw;
          transform: translate(-50%, -50%);
        ">
        </div>
      </div>
      `,
      position: [0, 0, 0],
      className: 'popup3dclass',
      scale: [0.4, 0.4, 0.4],
      closeVisible: 'hidden'
    })
    popup3.element.addEventListener('dblclick', ((e) => {
      const strSplit = e.target.style.backgroundImage.match(/\/\d{1,}.png/)
      if (strSplit) {
        const num = Number(strSplit[0].replace(/[^0-9]/ig, ''))
        const personMap2 = STATE.personMap.find(e2 => e2.img.includes(num))
        if (personMap2) window.handlePerson(personMap2.level)
      }
    }))
    popup3.visible = false
    // 加group来间接改变popup的中心点
    const group = new Bol3D.Group()
    group.add(popup)
    group.add(popup3)
    group.position.set(e.position.x, 0, e.position.z)
    group.name = 'person_group_' + e.level + '_' + e.name

    // if(index === 0) {
    //   setModelPosition(group)
    // }

    // 点击一根竖直的弹窗
    popup.element.addEventListener('dblclick', (() => {
      STATE.currentPopup.forEach(e2 => {
        CACHE.container.remove(e2)
      })

      cameraAnimation({
        cameraState: {
          position: { x: e.position.x + 200, y: 200, z: e.position.z + 200 },
          target: e.position
        }
      })

      // 设置点击之后的弹窗
      const popup2 = new Bol3D.POI.Popup3D({
        value: `
        <div style="
            margin:0;
            cursor: pointer;
            pointer-events: all;
            color: #ffffff;
            position: relative;
            left: 0;
            top: -3vh;
            transform: translate(-50%, -50%);
          ">

          <div style="
            position: absolute;
            background: url('./assets/3d/image/${map.img[1]}.png') center / 100% 100% no-repeat;
            width: 20vw;
            height:3.5vh;
            left: 1vw;
            top: -3.5vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 0.3vh;
            font-family: YouSheBiaoTiHei;
          ">
            <p style="
              pointer-events: none;
              display: inline;
              text-align: center;
              min-width: 15vw;
              font-size: 2vh;"
            >${e.name} ${map.name}</p>
          </div>

          <div style="
            background: url('./assets/3d/image/${map.img[2]}.png') center / 100% 100% no-repeat;
            min-width: 220px;
            width: 22vw;
            height:17vh;
            position: absolute;
            top: -0.5vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
            <p style="position: absolute; top: 21%;font-family: YouSheBiaoTiHei;font-size:2.3vh;">${e.info.title}</p>
            <div
              style="width: 75%; height: 34%; margin-top: 8%; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; justify-content: space-between;">
              <p style="font-size: 0.6vw">${e.info.value1}</p>
              <p style="font-size: 0.6vw">${e.info.value2}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <p style="font-size: 0.6vw">${e.info.value3}</p>
              <p style="font-size: 0.6vw"> | </p>
              <p style="font-size: 0.6vw">${e.info.value4}</p>
              <p style="font-size: 0.6vw"> | </p>
              <p style="font-size: 0.6vw">${e.info.value5}</p>
            </div>
          </div>
        </div>
      </div>
        `,
        position: [e.position.x, 20, e.position.z],
        className: 'popup3dclass popup3d_person_detail',
        scale: [0.22, 0.22, 0.22],
        closeVisible: 'show'
      })
      STATE.currentPopup.push(popup2)
      CACHE.container.attach(popup2)
    }))

    CACHE.container.attach(group);

    if (!STATE.sceneList.personPopup) {
      STATE.sceneList.personPopup = []
    }
    STATE.sceneList.personPopup.push(group)
  })
}

// 0 全部 1 重点 2 加强 3 一般 4 日常
function showPerson(type) {
  STATE.currentPopup.forEach(e => {
    CACHE.container.remove(e)
  })

  // 如果点全部显示
  if (type === 0) {
    if (STATE.personShowType.includes(0)) {
      STATE.personShowType = []
      STATE.sceneList.personPopup.forEach(e => {
        e.children[0].visible = false
      })
    } else {
      STATE.personShowType = [0, 1, 2, 3, 4]
      STATE.sceneList.personPopup.forEach(e => {
        e.children[0].visible = true
        e.children[1].visible = false
      })
    }
  } else {
    // 先判断之前是不是显示的全部
    if (STATE.personShowType.includes(0)) {
      STATE.personShowType.splice(STATE.personShowType.indexOf(0), 1)

      if (STATE.personShowType.includes(type)) {
        STATE.personShowType.splice(STATE.personShowType.indexOf(type), 1)
      } else {
        STATE.personShowType.push(type)
      }

    } else {
      // 如果之前不是显示的全部
      // 如果点的是数组里已有的
      if (STATE.personShowType.includes(type)) {
        STATE.personShowType.splice(STATE.personShowType.indexOf(type), 1)

      } else {
        STATE.personShowType.push(type)
        // 如果全给点了
        if (STATE.personShowType.includes(1) && STATE.personShowType.includes(2) && STATE.personShowType.includes(3) && STATE.personShowType.includes(4)) {
          STATE.personShowType = [0, 1, 2, 3, 4]
        }
      }
    }
  }



  // 如果给清空了 显示光点
  if (!STATE.personShowType.length) {
    STATE.personShowType = []
    STATE.sceneList.personPopup.map(e => {
      e.children[0].visible = false
      e.children[1].visible = true
    })
  } else {
    STATE.sceneList.personPopup.map(e => {
      e.children[1].visible = false

      let showFlag = false
      for (let i = 0; i < STATE.personShowType.length; i++) {
        if (e.name.includes('person_group_' + STATE.personShowType[i] + '_')) {
          showFlag = true
        }
      }

      if (showFlag) {
        e.children[0].visible = true
      } else {
        e.children[0].visible = false
      }

    })
  }
}

/**
 * 测试用盒子
 */
function testBox() {
  const boxG = new Bol3D.BoxGeometry(10, 10, 10)
  const boxM = new Bol3D.MeshBasicMaterial({ color: 0xffffff })
  const box = new Bol3D.Mesh(boxG, boxM)
  setModelPosition(box)
  CACHE.container.attach(box)
}

/**
 * 设置模型位置(position)，旋转(rotation)，缩放(scale),有该属性的物体亦可
 * @param {object} mesh 待操作模型
 */
function setModelPosition(mesh) {
  const controls = CACHE.container.transformControl
  const gui = new dat.GUI()
  const options = {
    transformModel: "translate"
  }
  gui.add(options, 'transformModel', ["translate", 'rotate', 'scale']).onChange(val => controls.setMode(val))
  const positionX = gui.add(mesh.position, 'x').onChange(val => mesh.position.x = val).name('positionX')
  const positionY = gui.add(mesh.position, 'y').onChange(val => mesh.position.y = val).name('positionY')
  const positionZ = gui.add(mesh.position, 'z').onChange(val => mesh.position.z = val).name('positionZ')
  const rotationX = gui.add(mesh.rotation, 'x').step(0.01).onChange(val => mesh.rotation.x = val).name('rotationX')
  const rotationY = gui.add(mesh.rotation, 'y').step(0.01).onChange(val => mesh.rotation.y = val).name('rotationY')
  const rotationZ = gui.add(mesh.rotation, 'z').step(0.01).onChange(val => mesh.rotation.z = val).name('rotationZ')
  const scaleX = gui.add(mesh.scale, "x").step(0.01).onChange(val => mesh.scale.x = val).name('scaleX')
  const scaleY = gui.add(mesh.scale, "y").step(0.01).onChange(val => mesh.scale.y = val).name('scaleY')
  const scaleZ = gui.add(mesh.scale, "z").step(0.01).onChange(val => mesh.scale.z = val).name('scaleZ')
  controls.attach(mesh)
  controls.addEventListener("change", (e) => {
    positionX.setValue(mesh.position.x)
    positionY.setValue(mesh.position.y)
    positionZ.setValue(mesh.position.z)
    rotationX.setValue(mesh.rotation.x)
    rotationY.setValue(mesh.rotation.y)
    rotationZ.setValue(mesh.rotation.z)
    scaleX.setValue(mesh.scale.x)
    scaleY.setValue(mesh.scale.y)
    scaleZ.setValue(mesh.scale.z)
  })
}

/**
 * 进入场景
 * @param {String} name 场景名
 */
function enterRoom(name = '') {
  const item = STATE.roomModelName.find(e => name.includes(e.name))

  if (item) {
    const popup = STATE.popupLocationList.find(e => e.name === name)
    const popupCameraState = {
      position: { x: popup.position.x, y: popup.position.y, z: popup.position.z },
      target: { x: popup.position.x, y: popup.position.y, z: popup.position.z }
    }
    cameraAnimation({ cameraState: popupCameraState, callback: afterCamera, duration: 500 })


    function afterCamera() {
      if (name.includes('切眼') || name.includes('1012进风顺槽') || name === '1000回风顺槽') {
        STATE.animationFlag = true
        STATE.router.push('/qieyan')

      } else if (name.includes('综采')) {
        STATE.animationFlag = true
        STATE.router.push('/zongcai')
      } else {
        STATE.router.push('/other')
      }
      STATE.sceneList.text.visible = false

      CACHE.container.orbitControls.maxPolarAngle = Math.PI
      CACHE.container.orbitControls.minPolarAngle = 0
      CACHE.container.sceneList.mkxdw.visible = false
      item.model.visible = true


      if (item.light) {
        if (item.light.ambientLight != undefined) {

          CACHE.container.ambientLight.intensity = item.light.ambientLight
        }
        if (item.light.directionLight != undefined) {

          const lightPosition = item.light.directionLight.position
          CACHE.container.directionLights[0].position.set(lightPosition.x, lightPosition.y, lightPosition.z)
          CACHE.container.directionLights[0].intensity = item.light.directionLight.intensity
        }

      }

      showPopup([
        STATE.sceneList.environmentPopup,
        STATE.sceneList.locationPopup,
        STATE.sceneList.personPopup,
        STATE.sceneList.monitorIcon
      ], false)

      cameraAnimation({ cameraState: item.cameraState, duration: 0 })

      let zongcaiMoveMesh = []
      let bladePoint1 = null
      let bladePoint2 = null
      if (name.includes('综采')) {
        bladePoint1 = new API.bladePoints()
        bladePoint2 = new API.bladePoints()

        item.model.children.forEach(child => {
          if (child.isMesh && ['CMJ', 'CMJ-1', 'CMJ-2'].includes(child.name)) {
            if (child.name === 'CMJ') {
              child.userData.move = true
              child.userData.directionLeft = false
            } else if (child.name === 'CMJ-1') {
              let wordPosition = new Bol3D.Vector3()
              child.getWorldPosition(wordPosition)
              bladePoint1.point.position.set(wordPosition.x, wordPosition.y, wordPosition.z)
              child.userData.points = bladePoint1
            } else if (child.name === 'CMJ-2') {
              let wordPosition = new Bol3D.Vector3()
              child.getWorldPosition(wordPosition)
              bladePoint2.point.position.set(wordPosition.x, wordPosition.y, wordPosition.z)
              child.userData.points = bladePoint2
            }
            zongcaiMoveMesh.push(child)
          }
        })
      }

      const animation = () => {
        if (STATE.animationFlag) {
          if (bladePoint1) bladePoint1.play = true
          if (bladePoint2) bladePoint2.play = true

          // 综采的左右移动
          if (zongcaiMoveMesh.length) {
            const CMJ = zongcaiMoveMesh.find(e => e.name === 'CMJ')
            let directionLeft = CMJ.userData.directionLeft
            let move = CMJ.userData.move

            zongcaiMoveMesh.forEach(child => {
              if (child.name === 'CMJ') {
                if (move) {
                  if (child.position.z > -55) {
                    child.userData.move = false
                    child.userData.directionLeft = false
                    CACHE.timer = setTimeout(() => {
                      child.position.z = -55
                      child.userData.move = true
                    }, 2000);

                  } else if (child.position.z < -85) {
                    child.userData.move = false
                    child.userData.directionLeft = true
                    CACHE.timer = setTimeout(() => {
                      child.position.z = -85
                      child.userData.move = true;
                    }, 2000);
                  }
                }
              }

              if (move) {
                child.position.z += directionLeft ? 0.05 : -0.05

                if (child.name === 'CMJ-1' || child.name === 'CMJ-2') {
                  let wordPosition = new Bol3D.Vector3()
                  child.getWorldPosition(wordPosition)
                  child.userData.points.point.position.set(wordPosition.x, wordPosition.y, wordPosition.z)
                }
              }
            })
          }


          // 齿轮旋转
          if(item.rotateMesh) {
            item.rotateMesh.forEach(e2 => {
              if (['XuanZ_01', 'XuanZ_02'].includes(e2.mesh.name)) {
                e2.mesh.rotateOnAxis(e2.mesh.position.clone().set(0, 1, 0), 0.1)
              } else {
                e2.mesh.rotation[e2.position] += e2.num
              }
            })
          }
        } else {
          if (bladePoint1) bladePoint1.play = false
          if (bladePoint2) bladePoint2.play = false
        }
      }
      renderAnimationList.push({ name, animation })
    }
  }
}


/**
 * 退回主页面
 */
function back(type) {
  if (type === 'hideRegionalRisk') {
    showPopup([STATE.sceneList.environmentPopup], false)
    showPopup([
      STATE.sceneList.personPopup,
      STATE.sceneList.locationPopup,
      STATE.sceneList.monitorIcon
    ])
    STATE.personShowType = []
    showPerson(0)

  } else {
    if (CACHE.timer) {
      clearTimeout(CACHE.timer)
    }
    CACHE.regionalRateMode = false

    renderAnimationList = []
    CACHE.container.ambientLight.intensity = STATE.initialState.ambientLight.intensity
    CACHE.container.directionLights[0].position.set(...STATE.initialState.directionLights[0].position)
    CACHE.container.directionLights[0].intensity = STATE.initialState.directionLights[0].intensity

    CACHE.container.orbitControls.maxPolarAngle = STATE.initialState.maxPolarAngle
    CACHE.container.orbitControls.minPolarAngle = STATE.initialState.minPolarAngle
    for (let key in STATE.sceneList) {
      if (key === 'mkxdw' || key === 'text') {
        STATE.sceneList[key].visible = true
      } else {
        STATE.sceneList[key].visible = false
      }
    }

    showPopup([
      STATE.sceneList.locationPopup,
      STATE.sceneList.personPopup,
      STATE.sceneList.monitorIcon
    ], true)

    if (type === 'zongcai') {
      STATE.sceneList.zcgzm.children.find(e => {
        if (e.name === 'CMJ-1' || e.name === 'CMJ-2') {
          if (e.userData.points.point) {
            let points = e.userData.points
            points.point.geometry.dispose()
            points.point.material.dispose()
            CACHE.container.scene.remove(points.point)
            points.point = null

          }
        }
      })
    }

    STATE.personShowType = []
    showPerson(0)
    cameraAnimation({ cameraState: STATE.initialState, duration: 0 })
  }
}

/**
 * 挖煤刀片的粒子效果
 */
class bladePoints {
  constructor(particleCount = 500) {
    this.velocities = null
    this.particleCount = particleCount
    this.particlesGeometry = null
    this.point = {}
    this.play = true
    // 设置初始速度和时间
    this.initialVelocities = new Float32Array(this.particleCount).fill(0).map(() => Math.random() * 10);
    this.times = new Float32Array(this.particleCount).fill(0);
    // 重力
    this.gravity = -9.81;
    this.init()
  }
  init() {
    this.createPoints()
    CACHE.container.attach(this.point);
    this.animation()
  }
  createPoints() {
    this.particlesGeometry = new Bol3D.BufferGeometry();
    let particleCount = this.particleCount
    const positions = new Float32Array(particleCount * 3);
    this.velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 5;
      this.velocities[i] = 0;
      this.velocities[i + 1] = 0;
      this.velocities[i + 2] = 0;
    }

    const sizes = new Float32Array(particleCount);
    // 设置粒子大小范围为0.05到1.5
    for (let i = 0; i < particleCount; i++) {
      sizes[i] = Math.random() * 5 + 0.3;
    }
    this.particlesGeometry.setAttribute('size', new Bol3D.BufferAttribute(sizes, 1));

    this.particlesGeometry.setAttribute('position', new Bol3D.BufferAttribute(positions, 3));

    // 加载贴图
    const textureLoader = new Bol3D.TextureLoader();
    const particleTexture = textureLoader.load('./assets/3d/image/28.png');

    // 创建粒子材质，并设置贴图
    const vertexShader = `
    #include <logdepthbuf_pars_vertex>
    #include <common>

    attribute float size;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;

        #include <logdepthbuf_vertex>
    }
    
  `;

    const fragmentShader = `
    #include <logdepthbuf_pars_fragment>
    #include <common>
    uniform sampler2D pointTexture;
    varying vec2 vUv;
    void main() {
        vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
        // if (textureColor.a < 0.5) discard;
        gl_FragColor = vec4(textureColor.r * 0.5, textureColor.g * 0.5, textureColor.b * 0.5, textureColor.a);
        #include <logdepthbuf_fragment>
    }
  `;

    const particleMaterial = new Bol3D.ShaderMaterial({
      uniforms: {
        pointTexture: { value: particleTexture },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      alphaToCoverage: true
    });

    const particles = new Bol3D.Points(this.particlesGeometry, particleMaterial);
    this.point = particles
  }
  animation() {
    if (this.point != null) {
      // 更新粒子位置
      for (let i = 0; i < this.particleCount; i++) {
        const pos = this.particlesGeometry.attributes.position;
        const currentPosition = new Bol3D.Vector3(pos.array[i * 3], pos.array[i * 3 + 1], pos.array[i * 3 + 2]);

        // 更新速度
        const velocity = this.initialVelocities[i] + (this.gravity * this.times[i]);
        this.velocities[i * 3 + 1] = velocity;

        // 添加随机横向扩散（从立方体中心向四周扩散）
        const direction = new Bol3D.Vector3(pos.array[i * 3], 0, pos.array[i * 3 + 2]).normalize();
        const spreadSpeed = Math.random() * 0.2;
        const spreadVector = direction.multiplyScalar(spreadSpeed);

        currentPosition.add(new Bol3D.Vector3(spreadVector.x, this.velocities[i * 3 + 1] * 0.016, spreadVector.z));
        pos.array[i * 3] = currentPosition.x;
        pos.array[i * 3 + 1] = currentPosition.y;
        pos.array[i * 3 + 2] = currentPosition.z;

        // 如果粒子达到一定高度，将其重新设置回初始位置
        if (this.play) {
          if (!this.point.visible) this.point.visible = true
          if (currentPosition.y < -10) {
            pos.array[i * 3] = (Math.random() - 0.5) * 5;
            pos.array[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos.array[i * 3 + 2] = (Math.random() - 0.5) * 5;
            this.times[i] = 0;
            this.initialVelocities[i] = Math.random() * 10;
          } else {
            this.times[i] += 0.1;
          }
        } else {
          this.times[i] += 0.1;
          if (this.point.visible && currentPosition.y < -50) this.point.visible = false
        }
      }

      this.particlesGeometry.attributes.position.needsUpdate = true;



      requestAnimationFrame(this.animation.bind(this));
    }
  }
}


function pause3D(flag = false) {
  if (flag) {
    CACHE.container.renderer.setAnimationLoop(null)
    STATE.pause3D = flag
  } else {
    CACHE.container.renderer.setAnimationLoop(CACHE.container.animation)
    STATE.pause3D = flag
    render()
  }
}


let renderAnimationList = []
const render = () => {
  const singleFrameTime = STATE.clock.getDelta()
  const elapsedTime = STATE.clock.getElapsedTime()

  renderAnimationList.forEach(e => e.animation())

  // 天空
  if (CACHE.container.sky) CACHE.container.sky.rotation.z += 0.0001

  if (!STATE.pause3D) {
    requestAnimationFrame(render);
  }
};

export const API = {
  cameraAnimation,
  initLocationPopup,
  initEnvironmentPopup,
  initMonitorIconList,
  initPersonPopup,
  loadGUI,
  showPopup,
  testBox,
  back,
  showPerson,
  bladePoints,
  pause3D,
  render
}
