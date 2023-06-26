import { STATE } from './STATE.js'
import { CACHE } from './CACHE.js'
import router from '@/router/index'
import TU from './threeUtils.js'


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
    // 新建组
    const group = new Bol3D.Group()
    group.position.set(e.position.x, 0, e.position.z)
    group.name = 'location_group_' + e.name
    // 首页location 的popup
    const popup = new Bol3D.POI.Popup3D({
      value: `
        <div style="
          margin:0;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -14%);
        ">

          <div class="location_title" style="
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
              font-size: 2.5vh;
              text-align: center;">${e.name}
            </p>
            <p style="font-size: 1.5vh; margin-top: 0.5vh;">${e.sub}</p>
          </div>
    
          <div style="
            background: url('./assets/3d/image/2.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:13vh;
          ">
          </div>
  
          <div style="
            background: url('./assets/3d/image/69.png') center / 100% 100% no-repeat;
            width: 7vw;
            height:7vw;
            position: relative;
            top: -6vh;
            animation: myrotate 8s linear infinite;
            scale: 1 0.4;
          ">
          </div>
        </div>
      `,
      position: [0, 0, 0],
      className: 'popup3dclass popup3d_location',
      scale: [0.3, 0.3, 0.3],
      closeVisible: 'hidden'
    })
    group.add(popup)
    popup.name = e.name
    popup.element.addEventListener("click", () => {
      enterRoom(e.name)
    })

    // 重点区域的popup 首页
    const popup2 = new Bol3D.POI.Popup3D({
      value: `
        <div style="
              margin:0;
              color: #ffffff;
              display: flex;
              flex-direction: column;
              align-items: center;
              transform: translate(0, -27%);
            ">

          <div class="location_title"
               name=${e.name}
                style="
                background: url('./assets/3d/image/99.png') center / 100% 100% no-repeat;
                width: 34vw;
                height:30vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              ">
            <div style="display: flex; width: 80%; height: 16%;position: absolute; top: 5%;align-items: center; justify-content: space-between;">
              <div style="display: flex; flex-direction: column;justify-content: space-between;height: 80%;margin-top: 5%; ">
                <p class="font-gradient">${e.name}</p>
                <p style="font-size: 2vh;">${e.sub}</p>
              </div>
              <div style="display: flex; width: 40%; height:60%; position: absolute; right: 0; top: 40%;">
                <img onclick="CACHE.environmentLocationPopup = this, API.handleLocationBtn(0)" style="width: 33.3%;cursor:pointer; pointer-events: all;" src="/assets/3d/image/100.png" />
                <img onclick="CACHE.environmentLocationPopup = this, API.handleLocationBtn(1)" style="width: 33.3%;cursor:pointer; pointer-events: all;" src="/assets/3d/image/101.png" />
                <img onclick="CACHE.environmentLocationPopup = this, API.handleLocationBtn(2)" style="width: 33.3%;cursor:pointer; pointer-events: all;" src="/assets/3d/image/102.png" />
              </div>
            </div>
            <div style="display: flex; width: 80%;height: 18%;position: absolute;top: 27%;">
              <div style="display: flex;width: 35%;flex-direction: column;align-items: center;">
                <p class="font-gradient">区域评分</p>
                <p class="font-gradient">80</p>
              </div>
              <div style="display: flex; margin-left:5%;width: 60%;align-items: center;justify-content: space-between">
                <div style="display: flex;flex-direction: column; align-items: center;justify-content: space-between;height: 68%;margin-bottom: 6%;"><p style="font-size: 2vh;">人员</p><p style="font-size: 2vh;">97</p></div>
                <div style="display: flex;flex-direction: column; align-items: center;justify-content: space-between;height: 68%;margin-bottom: 6%;"><p style="font-size: 2vh;">设备</p><p style="font-size: 2vh;">97</p></div>
                <div style="display: flex;flex-direction: column; align-items: center;justify-content: space-between;height: 68%;margin-bottom: 6%;"><p style="font-size: 2vh;">环境</p><p style="font-size: 2vh;">97</p></div>
                <div style="display: flex;flex-direction: column; align-items: center;justify-content: space-between;height: 68%;margin-bottom: 6%;"><p style="font-size: 2vh;">管理</p><p style="font-size: 2vh;">97</p></div>
                <div style="position: absolute; opacity: 0.5; background: linear-gradient(-90deg, rgba(11,16,19,0), rgba(97,158,225,0.88), rgba(91,175,227,0.88), rgba(97,158,225,0.88), rgba(11,16,19,0)); height: 2%; width: 66%;margin-bottom: 5%;"></div>
                <div style="position: absolute; opacity: 0.5; background: linear-gradient(-90deg, rgba(11,16,19,0), rgba(97,158,225,0.88), rgba(91,175,227,0.88), rgba(97,158,225,0.88), rgba(11,16,19,0)); height: 2%; width: 66%;margin-bottom: -11%;"></div>
              </div>
            </div>
          </div>

          <div style="
                background: url('./assets/3d/image/103.png') center / 100% 100% no-repeat;
                width: 6vw;
                height:13vh;
              ">
          </div>

          <div style="
                background: url('./assets/3d/image/104.png') center / 100% 100% no-repeat;
                width: 7vw;
                height:7vw;
                position: relative;
                top: -6vh;
                animation: myrotate 8s linear infinite;
                scale: 1 0.4;
              ">
          </div>
        </div>
      `,
      position: [0, 0, 0],
      className: 'popup3dclass popup3d_location',
      scale: [0.3, 0.3, 0.3],
      closeVisible: 'hidden'
    })
    popup2.visible = false
    group.add(popup2)


    // 重点区域的popup 传感器页
    const popup3 = new Bol3D.POI.Popup3D({
      value: `
        <div style="
          margin:0;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -27%);
        ">

        <div class="location_title"
            name=${e.name}
            style="
              background: url('./assets/3d/image/97.png') center / 100% 100% no-repeat;
              width: 24vw;
              height:30vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
          ">
          <div
            style="display: flex; width: 80%; height: 16%;position: absolute; top: 5%;align-items: center; justify-content: space-between;">
            <p class="font-gradient" style="flex: 1; text-align: center">设备名</p>
            <p class="font-gradient" style="flex: 1; text-align: center">监测值</p>
          </div>
          <div style="overflow-y: scroll;pointer-events: all;display: flex; flex-direction: column; width: 80%; margin-top: 13%; height: 52%;">
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">甲烷传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">0.5%</p></div>
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">粉尘传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">100mg/m³</p></div>
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">温度传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">23℃</p></div>
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">一氧化碳传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">11ppm</p></div>
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">二氧化碳传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">0.7%</p></div>
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">甲烷传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">0.5%</p></div>
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">粉尘传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">100mg/m³</p></div>
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">温度传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">23℃</p></div>
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">一氧化碳传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">11ppm</p></div>
            <div style="margin-bottom: 1vh;display: flex;justify-content: space-between;"><p style="font-size: 2vh; flex: 1;">二氧化碳传感器</p><p style="font-size: 2vh; text-align: center;flex: 1;">0.7%</p></div>
          </div>
          <div onclick="CACHE.environmentLocationPopup = this, API.handleLocationBtn(3)" style="cursor: pointer;pointer-events: all;background: url('./assets/3d/image/45.png') center / 100% 100% no-repeat; position: absolute; width: 3vh; height: 3vh; right: 5%; top: 6%;"></div>
        </div>

        <div style="
            background: url('./assets/3d/image/103.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:13vh;
          ">
        </div>

        <div style="
            background: url('./assets/3d/image/104.png') center / 100% 100% no-repeat;
            width: 7vw;
            height:7vw;
            position: relative;
            top: -6vh;
            animation: myrotate 8s linear infinite;
            scale: 1 0.4;
          ">
        </div>
      </div>
      `,
      position: [0, 0, 0],
      className: 'popup3dclass popup3d_location',
      scale: [0.3, 0.3, 0.3],
      closeVisible: 'hidden'
    })
    popup3.visible = false
    group.add(popup3)


    // 重点区域的popup 监控页
    const popup4 = new Bol3D.POI.Popup3D({
      value: `
        <div style="
          margin:0;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -27%);
        ">

      <div class="location_title" name=${e.name} style="
              background: url('./assets/3d/image/98.png') center / 100% 100% no-repeat;
              width: 34vw;
              height:30vh;
              display: flex;
              padding: 0 8%;
              justify-content: center;
              align-items: center;
          ">
        <div style="display: flex;flex-direction: column;height:65%;margin-top:2%; width: 40%;align-items: center;">
          <p class="font-gradient" style="text-align: center">设备名</p>
          <div style="pointer-events: all;overflow-y: scroll;pointer-events: all;display: flex; flex-direction: column; width: 100%; height: 75%;align-items: center;">
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">1号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">2号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">3号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">4号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">5号监控</div>
            <div style="cursor: pointer;font-size: 1.6vh; display: flex;background-color: #164674; border-radius:2vh; margin-top: 4%; height: 20%; width: 90%;justify-content: center;align-items: center;flex-shrink:0">6号监控</div>
          </div>
        </div>
        
        <div style="width: 55%;margin-left: 5%; background-color: #164674;height: 54%;margin-top: 5%;">
          <video src="/assets/3d/image/46.mp4" autoplay controls muted loop style="pointer-events: all;width: 100%; height: 100%;"></video>
        </div>
        <div onclick="CACHE.environmentLocationPopup = this, API.handleLocationBtn(4)"
          style="cursor: pointer;pointer-events: all;background: url('./assets/3d/image/45.png') center / 100% 100% no-repeat; position: absolute; width: 3vh; height: 3vh; right: 4%; top: 8%;">
        </div>
      </div>

      <div style="
            background: url('./assets/3d/image/103.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:13vh;
          ">
      </div>

      <div style="
            background: url('./assets/3d/image/104.png') center / 100% 100% no-repeat;
            width: 7vw;
            height:7vw;
            position: relative;
            top: -6vh;
            animation: myrotate 8s linear infinite;
            scale: 1 0.4;
          ">
      </div>
    </div>
      `,
      position: [0, 0, 0],
      className: 'popup3dclass popup3d_location',
      scale: [0.3, 0.3, 0.3],
      closeVisible: 'hidden'
    })
    popup4.visible = false
    group.add(popup4)





    function waitContainerLoad() {
      if (!CACHE.container) {
        setTimeout(() => {
          waitContainerLoad()
        }, 1000)
      } else {
        CACHE.container.attach(group)
      }
    }
    waitContainerLoad()
    if (!STATE.sceneList.locationPopup) {
      STATE.sceneList.locationPopup = []
    }
    STATE.sceneList.locationPopup.push(group)
  })
  // locationPopupTitleBounce()
}

// 区域风险的弹窗三个按钮的行为
// 0 传感器 1 监控 2 进入场景 3 传感器关闭 4 监控关闭
function handleLocationBtn(type) {
  let locationName = null
  let group = null
  if (type === 0) {
    locationName = CACHE.environmentLocationPopup.parentElement.parentElement.parentElement.getAttribute('name')
    group = STATE.sceneList.locationPopup.find(e => e.name === `location_group_${locationName}`)
    if (group) {
      group.children[1].visible = false
      group.children[2].visible = true
    }
  } else if (type === 1) {
    locationName = CACHE.environmentLocationPopup.parentElement.parentElement.parentElement.getAttribute('name')
    group = STATE.sceneList.locationPopup.find(e => e.name === `location_group_${locationName}`)
    if (group) {
      group.children[1].visible = false
      group.children[3].visible = true
    }
  } else if (type === 2) {
    locationName = CACHE.environmentLocationPopup.parentElement.parentElement.parentElement.getAttribute('name')
    enterRoom(locationName)
  } else if (type === 3) {
    locationName = CACHE.environmentLocationPopup.parentElement.getAttribute('name')
    group = STATE.sceneList.locationPopup.find(e => e.name === `location_group_${locationName}`)
    if (group) {
      group.children[1].visible = true
      group.children[2].visible = false
    }
  } else if (type === 4) {
    locationName = CACHE.environmentLocationPopup.parentElement.getAttribute('name')
    group = STATE.sceneList.locationPopup.find(e => e.name === `location_group_${locationName}`)
    if (group) {
      group.children[1].visible = true
      group.children[3].visible = false
    }
  }

  // 移动镜头
  if (type === 0 || type === 1) {
    const currentCameraPosition = CACHE.container.orbitCamera.position
    const distance = Math.sqrt((currentCameraPosition.x - group.position.x) ** 2 + (currentCameraPosition.y - group.position.y) ** 2 + (currentCameraPosition.z - group.position.z) ** 2)
    if (distance > 350) {
      const cameraState = {
        position: { x: group.position.x + 200, y: 200, z: group.position.z + 200 },
        target: { x: group.position.x, y: 20, z: group.position.z }
      }
      cameraAnimation({ cameraState })
    }
    // 其他标签透明化
    const itemIndex = STATE.sceneList.locationPopup.findIndex(e => e.name === group.name)
    if (itemIndex >= 0) {
      STATE.sceneList.locationPopup.forEach((e, index) => {
        if(itemIndex === index) {
          STATE.regionalriskLeftLocationIndex.value = itemIndex
          opacityPopup(e.children[1], false)
        } else {
          opacityPopup(e.children[1], true)
        }
      })
    }
  } else if (type === 3 || type === 4) {
    // 取消透明
    STATE.regionalriskLeftLocationIndex.value = -1
    STATE.sceneList.locationPopup.forEach(e => {
      opacityPopup(e.children[1], false)
    })
  }
}

// 上下浮动动画
function locationPopupTitleBounce() {
  const currentTimeHookArr = []
  STATE.sceneList.locationPopup.forEach((e, index) => {
    const element = e.children[0].element.getElementsByClassName('location_title')[0]

    if (element) {
      const keyframes = [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-2vh)' }
      ];
      const options = {
        iterations: Infinity, // 动画执行次数
        iterationStart: 0, // 动画开始时间点
        delay: 0, // 动画开始之前的延迟
        endDelay: 0, // 动画结束之后的延迟
        direction: 'alternate', // 动画是否在下一周期逆向播放
        duration: 1000, // 动画时长
        fill: 'forwards', // 动画前后保持的状态
        easing: 'ease-in-out', // 动画缓动类型
      }
      let webAnimation = element.animate(keyframes, options);

      // 存两个对象 ，为了拿currenttime
      if (index === 0 || index === 1) {
        currentTimeHookArr.push(webAnimation)
      }

      element.addEventListener('mouseover', () => {
        webAnimation.pause();
      })

      element.addEventListener('mouseout', () => {
        // 拿到真实的currenttime，要在其他popup上去拿
        if (STATE.sceneList.locationPopup.length >= 2) {
          const currentTime = index === 0 ? currentTimeHookArr[1].currentTime : currentTimeHookArr[0].currentTime
          options.delay = options.duration * 2 - currentTime % (options.duration * 2)

          webAnimation.cancel()
          webAnimation = null
          webAnimation = element.animate(keyframes, options)
          if (index === 0) currentTimeHookArr[0] = webAnimation
          else if (index === 1) currentTimeHookArr[1] = webAnimation
          webAnimation.play()
        } else {
          webAnimation.play();
        }
      })
    }
  })
}

/**
 * 加载环境的3d弹窗
 */
function initEnvironmentPopup() {
  STATE.popupEnvironmentList.forEach((e, index) => {
    const map = STATE.popupEnvironmentMap.find(e2 => e2.shortName === e.name)

    // 超标
    let isExceeding = false
    if (map.threshold) {
      if (map.shortName === 'FY') {
        if (e.info.value <= map.threshold[0] || e.info.value >= map.threshold[1]) {
          isExceeding = true
        }
      } else if (e.info.value > map.threshold) {
        isExceeding = true
      }
    }

    const popup = new Bol3D.POI.Popup3D({
      value: `
        <div style="
          margin:0;
          cursor: pointer;
          color: #ffffff;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">

          <div style="
            pointer-events: all;
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
            background: url('./assets/3d/image/54.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:13vh;
            position: relative;
            top: -5vh;
          ">
          </div>
  
          <div style="
            background: url('./assets/3d/image/71.png') center / 100% 100% no-repeat;
            width: 7vw;
            height:7vw;
            position: relative;
            top: -13vh;
            animation: myrotate 8s linear infinite;
            scale: 1 0.4;
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
    group.userData.isExceeding = isExceeding
    group.userData.initDetailPopup = initDetailPopup
    popup.name = e.id
    popup.visible = false



    popup.element.addEventListener('click', (() => {
      // 移动镜头
      cameraAnimation({
        cameraState: {
          position: { x: e.position.x + 100, y: 100, z: e.position.z + 100 },
          target: { x: e.position.x, y: e.position.y + 20, z: e.position.z }
        }
      })

      // 清除之前的所有弹窗 (报警的除外)
      STATE.currentPopup.forEach(e2 => {
        if (!e2.userData.isExceeding) {
          CACHE.container.remove(e2)
        }
      })


      // 其他标签透明
      STATE.sceneList.environmentPopup.forEach(e2 => {
        opacityPopup(e2.children[0], true)
      })
      opacityPopup(popup, false)

      initDetailPopup()
    }))

    function initDetailPopup() {

      // 设置点击之后的弹窗
      let contentText = ``
      if (e.info) {
        contentText += `<p style="font-size: 1.6vh;">${e.info.name}: ${e.info.value}${e.info.unit}</p>`
      }

      // 警告效果
      let alertText = ``
      if (isExceeding) {
        alertText = `<div style="
          z-index: 4;
          position: absolute;
          background: url('./assets/3d/image/83.png') center / 100% 100% no-repeat;
          width: 23vw;
          height:15vh;
          animation: environment_alert 2s infinite;
        ">`
      }

      // 其他标签恢复透明
      function closeCallBack() {
        STATE.sceneList.environmentPopup.forEach(e2 => {
          opacityPopup(e2.children[0], false)
        })
      }

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
            <div style="z-index: 5;position: absolute; top: 15%;justify-content: center;width:80%;height:20%;display:flex;align-items:center;">
              <p style="font-size: 1.6vh;font-family: YouSheBiaoTiHei;line-height:80%;text-align:center">${e.title || map.name}</p>
            </div>
            <div style="z-index: 5;width: 75%; height: 45%; margin-top: 8%; display: flex; flex-direction: column; justify-content: space-around;">
              ${contentText}
            </div>
          </div>

          ${alertText}
          
          </div>
        </div>
        `,
        position: [e.position.x, 0, e.position.z],
        className: 'popup3dclass popup3d_enviroment_detail',
        scale: [0.2, 0.2, 0.2],
        closeVisible: 'show',
        closeCallBack
      })
      popup2.userData.isExceeding = isExceeding
      STATE.currentPopup.push(popup2)
      function waitContainerLoad2() {
        if (!CACHE.container) {
          setTimeout(() => {
            waitContainerLoad2()
          }, 1000)
        } else {
          CACHE.container.attach(popup2)
        }
      }
      waitContainerLoad2()
    }

    function waitContainerLoad() {
      if (!CACHE.container) {
        setTimeout(() => {
          waitContainerLoad()
        }, 1000)
      } else {
        CACHE.container.attach(group)
      }
    }
    waitContainerLoad()

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
    // 如果里面还有组  主要是针对 monitorPopup
    if (group.type && group.type === 'Group') {
      group.visible = isShow
      group.children.forEach(item => {
        item.traverse(child => {
          child.visible = isShow
        })
      })
    } else { // 如果直接是mesh
      group.forEach(item => {
        item.traverse(child => {
          child.visible = isShow
        })
      })
    }

  })
}

// 加载监控摄像头
function initmonitorList() {
  STATE.monitorList.forEach((e, index) => {
    const popup = new Bol3D.POI.Popup3D({
      value: `
        <div style="
          margin:0;
          cursor: pointer;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">

          <div style="
            pointer-events: all;
            background: url('./assets/3d/image/56.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:6vw;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
          </div>
    
          <div style="
            background: url('./assets/3d/image/57.png') center / 100% 100% no-repeat;
            width: 6vw;
            height:13vh;
            position: relative;
            top: -5vh;
          ">
          </div>
  
          <div style="
            background: url('./assets/3d/image/70.png') center / 100% 100% no-repeat;
            width: 7vw;
            height:7vw;
            position: relative;
            top: -13vh;
            animation: myrotate 8s linear infinite;
            scale: 1 0.4;
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
    group.name = 'monitor_group_' + e.id
    popup.name = e.id
    popup.visible = false

    popup.element.addEventListener('click', (() => {
      STATE.currentPopup.forEach(e2 => {
        CACHE.container.remove(e2)
      })

      cameraAnimation({
        cameraState: {
          position: { x: e.position.x + 100 * (window.innerWidth / 1000), y: 100, z: e.position.z + 100 * (window.innerWidth / 1000) },
          target: { x: e.position.x, y: e.position.y + 42, z: e.position.z }
        }
      })

      // 设置点击之后的弹窗
      const popup2 = new Bol3D.POI.Popup3D({
        value: `
        <div style="
          margin:0;
          cursor: pointer;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(0, -80%);
        ">

          <div style="
            background: url('./assets/3d/image/15.png') center / 100% 100% no-repeat;
            width: 30vw;
            height: 40vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
            <video
              src="./assets/3d/image/46.mp4"
              autoplay
              muted
              controls
              id="monitorVideo"
              style="width:87%; height: 70%;position:absolute; top: 17%">
            </video>
          </div>
        </div>
        `,
        position: [e.position.x, 0, e.position.z],
        className: 'popup3dclass popup3d_monitor_detail',
        scale: [0.2, 0.2, 0.2],
        closeVisible: 'show'
      })
      STATE.currentPopup.push(popup2)
      function waitContainerLoad() {
        if (!CACHE.container) {
          setTimeout(() => {
            waitContainerLoad()
          }, 1000)
        } else {
          CACHE.container.attach(popup2)
        }
      }
      waitContainerLoad()

      setTimeout(() => {
        const monitorVideoDom = document.getElementById('monitorVideo')
        if (monitorVideoDom) {
          monitorVideoDom.play()
        }
      }, 200)
    }))

    function waitContainerLoad() {
      if (!CACHE.container) {
        setTimeout(() => {
          waitContainerLoad()
        }, 1000)
      } else {
        CACHE.container.attach(group)
      }
    }
    waitContainerLoad()

    if (!STATE.sceneList.monitorPopup) {
      STATE.sceneList.monitorPopup = []
    }
    STATE.sceneList.monitorPopup.push(group)
  })
}

// 加载监管人员
function initPersonPopup() {

  STATE.personList.forEach((e, index) => {
    const map = STATE.personMap.find(e2 => e2.level === e.level)
    // 一根竖直的弹窗
    const popup = new Bol3D.POI.Popup3D({
      value: `
      <div style="
        margin:0;
        color: #ffffff;
      ">
        
        <div style="
          cursor: pointer;
          pointer-events: all;
          position: absolute;
          background: url('./assets/3d/image/${map.img[4]}.png') center / 100% 100% no-repeat;
          width: 3vh;
          height:3vh;
          transform: translate(-50%, -258%);
        "></div>

        <div style="
          position: absolute;
          pointer-events: none;
          background: url('./assets/3d/image/${map.img[5]}.png') center / 100% 100% no-repeat;
          width: 0.3vw;
          height:7vh;
          transform: translate(-50%, -67%);
        "></div>
      </div>
      `,
      position: [0, 0, 0],
      className: 'popup3dclass',
      scale: [0.4, 0.4, 0.4],
      closeVisible: 'hidden'
    })

    // 圆点（被去掉了）
    // const popup3 = new Bol3D.POI.Popup3D({
    //   value: `
    //   <div style="
    //     pointer-events: all;
    //     margin:0;
    //     cursor: pointer;
    //     color: #ffffff;
    //   ">

    //     <div style="
    //       position: absolute;
    //       background: url('./assets/3d/image/${map.img[3]}.png') center / 100% 100% no-repeat;
    //       width: 2vw;
    //       height:2vw;
    //       transform: translate(-50%, -50%);
    //     ">
    //     </div>
    //   </div>
    //   `,
    //   position: [0, 0, 0],
    //   className: 'popup3dclass',
    //   scale: [0.4, 0.4, 0.4],
    //   closeVisible: 'hidden'
    // })
    // popup3.element.addEventListener('click', ((e) => {
    //   const strSplit = e.target.style.backgroundImage.match(/\/\d{1,}.png/)
    //   if (strSplit) {
    //     const num = Number(strSplit[0].replace(/[^0-9]/ig, ''))
    //     const personMap2 = STATE.personMap.find(e2 => e2.img.includes(num))
    //     if (personMap2) window.handlePerson(personMap2.level)
    //   }
    // }))
    // popup3.visible = false

    // 加group来间接改变popup的中心点
    const group = new Bol3D.Group()
    group.add(popup)
    // group.add(popup3)
    group.position.set(e.position.x, 0, e.position.z)
    group.name = 'person_group_' + e.level + '_' + e.name

    // 点击头像
    popup.element.addEventListener('click', (() => {
      STATE.currentPopup.forEach(e2 => {
        CACHE.container.remove(e2)
      })

      cameraAnimation({
        cameraState: {
          position: { x: e.position.x + 100 * (window.innerWidth / 1000), y: 255, z: e.position.z + (-144 * (window.innerWidth / 1000)) },
          target: { x: e.position.x, y: e.position.y, z: e.position.z },
        }
      })

      // 设置点击之后的弹窗
      // 为重点管控的话会多一句话
      const importanValue = e.level == 1
      ? '<p style="position: absolute; top: 35%;font-family: YouSheBiaoTiHei;font-size:2vh; color: #d86943;">此区域有重点管控人员，请及时处理！</p>'
      : ''
      
      const popup2 = new Bol3D.POI.Popup3D({
        value: `
        <div style="
            margin:0;
            cursor: pointer;
            pointer-events: all;
            color: #ffffff;
            position: relative;
            left: 0;
            top: -9vh;
            transform: translate(-50%, 0%);
          ">

          <div style="
            position: absolute;
            background: url('./assets/3d/image/${map.img[1]}.png') center / 100% 100% no-repeat;
            width: 26vw;
            height:5.4vh;
            left: 0.5vw;
            top: -5.5vh;
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
              font-size: 4vh;"
            >${map.name}</p>
          </div>

          <div style="
            background: url('./assets/3d/image/${map.img[2]}.png') center / 100% 100% no-repeat;
            min-width: 220px;
            width: 28vw;
            height:24vh;
            position: absolute;
            top: -0.5vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
            <p style="position: absolute; top: 20%;font-family: YouSheBiaoTiHei;font-size:3.3vh;">${e.info.title}</p>
            ${importanValue}
            <div
              style="width: 75%; height: 34%; margin-top: 10%; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; justify-content: space-between;">
              <p style="font-size: 1vw">${e.name}</p>
              <p style="font-size: 1vw">工号:${e.info.value1}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <p style="font-size: 1vw">${e.info.value3}</p>
              <p style="font-size: 1vw"> | </p>
              <p style="font-size: 1vw">${e.info.value4}</p>
              <p style="font-size: 1vw"> | </p>
              <p style="font-size: 1vw">${e.info.value5}</p>
            </div>
          </div>
        </div>
      </div>
        `,
        position: [e.position.x, 0, e.position.z],
        className: 'popup3dclass popup3d_person_detail',
        scale: [0.22, 0.22, 0.22],
        closeVisible: 'show'
      })
      STATE.currentPopup.push(popup2)
      function waitContainerLoad2() {
        if (!CACHE.container) {
          setTimeout(() => {
            waitContainerLoad2()
          }, 1000)
        } else {
          CACHE.container.attach(popup2)
        }
      }
      waitContainerLoad2()
    }))

    function waitContainerLoad() {
      if (!CACHE.container) {
        setTimeout(() => {
          waitContainerLoad()
        }, 1000)
      } else {
        // 默认隐藏安全
        if (e.level == 4) {
          group.children[0].visible = false
        }
        CACHE.container.attach(group);
      }
    }
    waitContainerLoad()

    if (!STATE.sceneList.personPopup) {
      STATE.sceneList.personPopup = []
    }
    STATE.sceneList.personPopup.push(group)
  })
}

// 加载人员定位基站
function initBaseStationPopup() {
  STATE.baseStationList.forEach(e => {
    const icon = new Bol3D.POI.Icon({
      position: [e.position.x, e.position.y, e.position.z],
      url: './assets/3d/image/68.png',
      scale: [30, 30],
      color: 0xffffff
    })

    if (!STATE.sceneList.baseStationPopup) {
      STATE.sceneList.baseStationPopup = []
    }
    STATE.sceneList.baseStationPopup.push(icon)
  })

  STATE.sceneList.baseStationPopup.forEach(e => {
    container.attach(e)
  })


  setTimeout(() => {
    STATE.sceneList.baseStationPopup.forEach(e => {
      e.material.transparent = false
      e.material.alphaToCoverage = true
    })
  }, 1000);
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
        // e.children[1].visible = false // 不显示光点
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



  // 如果给清空了 显示光点（这个功能被干掉了）
  if (!STATE.personShowType.length) {
    STATE.personShowType = []
    STATE.sceneList.personPopup.map(e => {
      e.children[0].visible = false
      // e.children[1].visible = true // 不显示光点
    })
  } else {
    STATE.sceneList.personPopup.map(e => {
      // e.children[1].visible = false // 不显示光点

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

// 会动的那两个机器的弹窗
function initMainMachinePopup(name) {
  if (name === 'zongcai' || name === 'qieyan') {
    const mockInfo = [
      { name: '采煤机速度', value: '9.22m/min' },
      { name: '当前位置', value: '71.1m' },
      { name: '总支架数', value: '65.506架' },
      { name: '运动方向', value: '顺风运行' },
      { name: '左滚筒高度', value: '0.93m' },
      { name: '右滚筒高度', value: '2.08' }
    ]
    let text = ''
    mockInfo.forEach(e => {
      text += `<div style="display: flex;"><p style="font-size: 3vh; color: #7facd4; margin-right: 1vw;">${e.name}:</p><p style="font-size: 3vh;">${e.value}</p></div>`
    })
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
          background: url('./assets/3d/image/44.png') center / 100% 100% no-repeat;
          width: 20vw;
          height: 46vh;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          padding: 3vh 2vw;
        ">
          <p style="font-size: 5vh; font-family: YouSheBiaoTiHei; text-align: center; margin-top: 11%;">设备信息</p>
          <div style="display: flex; flex-direction: column; justify-content: space-around; margin-top: 3%; height: 67%;">
            ${text}
          </div>
        </div>
      </div>
        `,
      position: [0, 0, 0],
      className: 'popup3dclass popup3d_main_machine',
      scale: (() => {
        let scale = []
        const screenTime = (window.innerWidth / 1000)
        scale = name === 'zongcai' ? [0.045 / screenTime, 0.045 / screenTime, 0.045 / screenTime] : [0.1 / screenTime, 0.1 / screenTime, 0.1 / screenTime]

        return scale
      })(),
      closeVisible: 'show'
    })

    const group = new Bol3D.Group()
    group.add(popup)
    group.position.set(0, 0, 0)
    group.name = 'machine_group_' + name

    function waitContainerLoad() {
      if (!CACHE.container) {
        setTimeout(() => {
          waitContainerLoad()
        }, 1000)
      } else {
        CACHE.container.attach(group)
      }
    }
    waitContainerLoad()
    STATE.sceneList.mainMachinePopup = group

    if (name === 'zongcai') {
      const CMJGroup = STATE.sceneList.zcgzm.children.find(e => e.name === 'CMJGroup')
      if (CMJGroup) {
        group.position.set(0, 2.1, 0)
        CMJGroup.add(group)
      }
    } else if (name === 'qieyan') {
      group.position.set(-320, 31, 0)
    }
  }
}

// canvas 截图 用于切换场景过渡
function prtScreen() {
  const canvas = CACHE.container.renderer.domElement
  const imageDataUrl = canvas.toDataURL();

  const img = document.createElement('img');
  img.style.position = 'fixed'
  img.style.height = '100vh'
  img.style.width = '100vw'
  img.style.left = '0'
  img.style.top = '0'
  img.style.pointerEvents = 'none'
  img.style.zIndex = 100
  img.src = imageDataUrl
  document.body.appendChild(img);

  const keyframes = [
    { opacity: 1 },
    { opacity: 0 }
  ];
  const options = {
    iterations: 1, // 动画执行次数
    duration: 300 // 动画时长
  }
  const webAnimation = img.animate(keyframes, options);

  webAnimation.play()
  webAnimation.onfinish = (() => {
    img.remove()
  })
}



/**
 * 测试用盒子
 */
function testBox() {
  const boxG = new Bol3D.BoxGeometry(5, 5, 5)
  const boxM = new Bol3D.MeshBasicMaterial({ color: 0xffffff })
  const box = new Bol3D.Mesh(boxG, boxM)
  setModelPosition(box)
  function waitContainerLoad() {
    if (!CACHE.container) {
      setTimeout(() => {
        waitContainerLoad()
      }, 1000)
    } else {
      CACHE.container.attach(box)
    }
  }
  waitContainerLoad()

  let markData = []
  function markReset() {
    markData = []
    console.log(
      "%c暂存坐标已清空",
      "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
    );
  }
  function markStep() {
    markData.push([box.position.x, box.position.z])
    console.log(
      "%c该点标注成功，您可以继续使用此函数以形成多边形。当前已添加的坐标为：",
      "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
    );

  }

  window.markData = markData
  window.markReset = markReset
  window.markStep = markStep
}

/**
 * 设置模型位置(position)，旋转(rotation)，缩放(scale),有该属性的物体亦可
 * @param {object} mesh 待操作模型
 */
function setModelPosition(mesh) {
  const controls = CACHE.container.transformControl
  controls.showY = false
  const gui = new dat.GUI()
  const options = {
    transformModel: "translate"
  }
  gui.add(options, 'transformModel', ["translate", 'rotate', 'scale']).onChange(val => controls.setMode(val))
  const positionX = gui.add(mesh.position, 'x').onChange(val => mesh.position.x = val).name('positionX')
  const positionY = gui.add(mesh.position, 'y').onChange(val => mesh.position.y = val).name('positionY')
  const positionZ = gui.add(mesh.position, 'z').onChange(val => mesh.position.z = val).name('positionZ')
  controls.attach(mesh)
  controls.addEventListener("change", (e) => {
    positionX.setValue(mesh.position.x)
    positionY.setValue(mesh.position.y)
    positionZ.setValue(mesh.position.z)
  })
}

/**
 * 进入场景
 * @param {String} name 场景名
 */
function enterRoom(name = '') {
  const item = STATE.roomModelName.find(e => name.includes(e.name))

  // 如果找到匹配的
  if (item) {
    // 过渡
    prtScreen()
    // 更改当前场景 相机移动到标签上
    STATE.currentScene[1] = STATE.currentScene[0]
    STATE.currentScene[0] = name
    const popup = STATE.popupLocationList.find(e => e.name === name)
    const popupCameraState = {
      position: { x: popup.position.x, y: popup.position.y, z: popup.position.z },
      target: { x: popup.position.x, y: popup.position.y, z: popup.position.z }
    }
    // cameraAnimation({ cameraState: popupCameraState, callback: afterCamera, duration: 500 })
    afterCamera()

    // 相机移动完之后
    function afterCamera() {
      // 关灯
      CACHE.container.spotLights.forEach(e => {
        e.visible = false
      })

      // 重点区域点进去的
      STATE.sceneList.locationPopup.forEach(e => {
        API.opacityPopup(e.children[1], false)
      })

      // 跳路由
      if (name.includes('切眼') || name.includes('槽')) {
        STATE.animationFlag = true
        STATE.router.push('/qieyan')

      } else if (name.includes('综采')) {
        STATE.animationFlag = true
        STATE.router.push('/zongcai')

      } else {
        STATE.router.push('/other')
      }

      // 隐藏场景与文字 设定旋转角度 显示内部场景
      STATE.sceneList.text.visible = false
      CACHE.container.orbitControls.maxPolarAngle = Math.PI
      CACHE.container.orbitControls.minPolarAngle = 0
      CACHE.container.sceneList.mkxdw.visible = false
      item.model.visible = true

      // 设定场景配套的光源
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

      // 隐藏标签 相机移动到预设位置
      showPopup([
        STATE.sceneList.environmentPopup,
        STATE.sceneList.locationPopup,
        STATE.sceneList.personPopup,
        STATE.sceneList.monitorPopup,
        STATE.sceneList.baseStationPopup
      ], false)

      cameraAnimation({ cameraState: item.cameraState, duration: 0 })

      // 主要是配合综采的
      let CMJGroup = null
      let bladePoint1 = null
      let bladePoint2 = null
      let bladePoint1_2 = null
      let bladePoint2_2 = null
      if (name.includes('综采')) {
        // 俩刀片的粒子效果
        bladePoint1 = new API.BladePoints(300, './assets/3d/image/92.png')
        bladePoint1_2 = new API.BladePoints(300, './assets/3d/image/93.png')
        bladePoint2 = new API.BladePoints(300, './assets/3d/image/92.png')
        bladePoint2_2 = new API.BladePoints(300, './assets/3d/image/93.png')

        // 整个组移动
        CMJGroup = item.model.children.find(e => e.name === 'CMJGroup')
        if (CMJGroup) {
          CMJGroup.userData.move = true
          CMJGroup.userData.directionLeft = false
          CMJGroup = CMJGroup

          CMJGroup.children.forEach(child => {
            if (child.name === 'CMJ-1') {
              let wordPosition = new Bol3D.Vector3()
              child.getWorldPosition(wordPosition)
              bladePoint1.point.position.set(wordPosition.x, wordPosition.y, wordPosition.z)
              bladePoint1_2.point.position.set(wordPosition.x, wordPosition.y, wordPosition.z)
              child.userData.points = [bladePoint1, bladePoint1_2]

            } else if (child.name === 'CMJ-2') {
              let wordPosition = new Bol3D.Vector3()
              child.getWorldPosition(wordPosition)
              bladePoint2.point.position.set(wordPosition.x, wordPosition.y, wordPosition.z)
              bladePoint2_2.point.position.set(wordPosition.x, wordPosition.y, wordPosition.z)
              child.userData.points = [bladePoint2, bladePoint2_2]
            }
          })
        }
      }

      const animation = () => {
        if (STATE.animationFlag) {
          if (bladePoint1) bladePoint1.play = true
          if (bladePoint2) bladePoint2.play = true
          if (bladePoint1_2) bladePoint1_2.play = true
          if (bladePoint2_2) bladePoint2_2.play = true

          // 综采的左右移动
          if (CMJGroup) {
            let directionLeft = CMJGroup.userData.directionLeft
            let move = CMJGroup.userData.move

            if (move) {
              if (CMJGroup.position.z > -55) {
                CMJGroup.userData.move = false
                CMJGroup.userData.directionLeft = false
                CACHE.timer = setTimeout(() => {
                  CMJGroup.position.z = -55
                  CMJGroup.userData.move = true
                }, 2000);

              } else if (CMJGroup.position.z < -85) {
                CMJGroup.userData.move = false
                CMJGroup.userData.directionLeft = true
                CACHE.timer = setTimeout(() => {
                  CMJGroup.position.z = -85
                  CMJGroup.userData.move = true;
                }, 2000);
              }
              CMJGroup.position.z += directionLeft ? 0.05 : -0.05

              CMJGroup.children.forEach(child => {
                if (child.name === 'CMJ-1' || child.name === 'CMJ-2') {
                  let wordPosition = new Bol3D.Vector3()
                  child.getWorldPosition(wordPosition)
                  child.userData.points.forEach(e => {
                    e.point.position.set(wordPosition.x, wordPosition.y, wordPosition.z)
                  })
                }
              })
            }
          }


          // 齿轮旋转
          if (item.rotateMesh) {
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
          if (bladePoint1_2) bladePoint1_2.play = false
          if (bladePoint2_2) bladePoint2_2.play = false
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
  // 从显示环境信息里退出来
  if (type === 'hideRegionalRisk') {
    STATE.sceneList.locationPopup.forEach(e => {
      opacityPopup(e.children[1], false)
    })
    STATE.sceneList.environmentPopup.forEach(e => {
      opacityPopup(e.children[0], false)
    })

    showPopup([
      STATE.sceneList.environmentPopup,
      STATE.sceneList.monitorPopup,
      STATE.sceneList.locationPopup
    ], false)
    showPopup([
      STATE.sceneList.baseStationPopup
    ])

    STATE.currentScene[1] = STATE.currentScene[0]
    STATE.currentScene[0] = '/'

    STATE.sceneList.personPopup.forEach(e => {
      const level = e.name.split('person_group_')[1].split('_')[0]
      if ((level != undefined) && STATE.personShowType.includes(Number(level))) {
        e.children[0].visible = true
      }
    })

    STATE.sceneList.locationPopup.forEach(e => {
      e.children[0].visible = true
    })

    cameraAnimation({ cameraState: STATE.initialState, duration: 500 })

  } else {
    // 过渡
    prtScreen()
    cameraAnimation({ cameraState: STATE.initialState, callback: afterCamera, duration: 0 })

    // 解决闪屏
    function afterCamera() {
      // 开灯
      CACHE.container.spotLights.forEach(e => {
        e.visible = true
      })

      // 清空计时器 清空默认场景名字 关闭环境信息
      if (CACHE.timer) {
        clearTimeout(CACHE.timer)
      }

      // 清空动画序列
      renderAnimationList = []

      // 恢复初始灯光与控制器状态
      CACHE.container.ambientLight.intensity = STATE.initialState.ambientLight.intensity
      CACHE.container.directionLights[0].position.set(...STATE.initialState.directionLights[0].position)
      CACHE.container.directionLights[0].intensity = STATE.initialState.directionLights[0].intensity
      CACHE.container.orbitControls.maxPolarAngle = STATE.initialState.maxPolarAngle
      CACHE.container.orbitControls.minPolarAngle = STATE.initialState.minPolarAngle

      // 显示场景
      for (let key in STATE.sceneList) {
        if (STATE.sceneList[key]) {
          if (key === 'mkxdw' || key === 'text') {
            STATE.sceneList[key].visible = true
          } else {
            STATE.sceneList[key].visible = false
          }
        }
      }

      // 显示标签
      showPopup([
        STATE.sceneList.baseStationPopup
      ], true)

      // 处理 location
      if (STATE.currentScene[1] === '/') { // 如果是从首页进的
        STATE.currentScene[1] = STATE.currentScene[0]
        STATE.currentScene[0] = '/'
        router.push('/')
        STATE.sceneList.personPopup.forEach(e => {
          const level = e.name.split('person_group_')[1].split('_')[0]
          if ((level != undefined) && STATE.personShowType.includes(Number(level))) {
            e.children[0].visible = true
          }
        })
        STATE.sceneList.locationPopup.forEach(e => {
          e.children[0].visible = true
          e.children[1].visible = false
          e.children[2].visible = false
          e.children[3].visible = false
        })
      } else if (STATE.currentScene[1] === '/regionalrisk') { // 如果是种地区域页进的
        STATE.currentScene[1] = STATE.currentScene[0]
        STATE.currentScene[0] = '/regionalrisk'
        router.push('/regionalrisk')
        STATE.sceneList.locationPopup.forEach(e => {
          // 是重点区域里的
          if (STATE.importantLocation.includes(e.name.split('location_group_')[1])) {
            e.children[0].visible = false
            e.children[1].visible = true
            e.children[2].visible = false
            e.children[3].visible = false
          } else {
            e.children[0].visible = false
            e.children[1].visible = false
            e.children[2].visible = false
            e.children[3].visible = false
          }
        })
      }

      // 销毁粒子
      if (type === 'zongcai') {
        const CMJGroup = STATE.sceneList.zcgzm.children.find(e => e.name === 'CMJGroup')
        CMJGroup.children.forEach(e => {
          if (e.name === 'CMJ-1' || e.name === 'CMJ-2') {
            e.userData.points.forEach(e2 => {
              e2.point.geometry.dispose()
              e2.point.material.dispose()
              CACHE.container.scene.remove(e2.point)
              e2.point = null
            })
          }
        })
      }

      // 删除弹窗
      if (STATE.sceneList.mainMachinePopup) {
        const popup = STATE.sceneList.mainMachinePopup
        popup.parent.remove(popup)
        popup.children[0].element.remove()
        STATE.sceneList.mainMachinePopup = null
      }

      // 恢复选中状态
      // STATE.personShowType = []
      // showPerson(0)
    }
  }
}

/**
 * 挖煤刀片的粒子效果
 */

class BladePoints {
  constructor(particleCount = 200, imageUrl = './92.png') {
    this.velocities = null
    this.imageUrl = imageUrl
    this.particleCount = particleCount
    this.particlesGeometry = null
    this.point = {}
    this.play = true
    // 设置初始速度和时间
    this.initialVelocities = new Float32Array(this.particleCount).fill(0).map(() => Math.random() * 2);
    this.times = new Float32Array(this.particleCount).fill(0);
    // 重力
    this.gravity = -9.81 * 2;
    this.init()
  }
  init() {
    const this_ = this
    this.createPoints()
    function waitContainerLoad() {
      if (!CACHE.container) {
        setTimeout(() => {
          waitContainerLoad()
        }, 1000)
      } else {
        CACHE.container.attach(this_.point);
      }
    }
    waitContainerLoad()
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
      sizes[i] = Math.random() * 8 + 0.3;
    }
    this.particlesGeometry.setAttribute('size', new Bol3D.BufferAttribute(sizes, 1));

    this.particlesGeometry.setAttribute('position', new Bol3D.BufferAttribute(positions, 3));

    // 加载贴图
    const textureLoader = new Bol3D.TextureLoader();
    const particleTexture = textureLoader.load(this.imageUrl);

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
    gl_FragColor = vec4(textureColor.r * 0.2, textureColor.g * 0.2, textureColor.b * 0.2, textureColor.a);
    #include <logdepthbuf_fragment>
}
`;

    const particleMaterial = new Bol3D.ShaderMaterial({
      uniforms: {
        pointTexture: { value: particleTexture },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      alphaToCoverage: true,
      transparent: true
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
        const spreadSpeed = Math.random() * 0.6;
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
            this.initialVelocities[i] = Math.random() * 2;
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

// 暂停所有3D活动
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

/**
 * 其他标签透明化
 * @param {Object3D} popup popup
 * @param {Boolean} type 是否透明
 */
function opacityPopup(popup, type) {
  if (popup.isObject3D) {
    popup.element.style.opacity = type ? 0.3 : 1
  }
}


// 生成随机点相关的
function randomPointInQuadrilateral(p1, p2, p3, p4) {
  /*
   * 在四边形区域内随机生成一个点
   *
   * @param p1, p2, p3, p4: 四个顶点的坐标，每个坐标是一个二元组
   * @return: 生成的随机点的坐标，是一个二元组
   */
  // 计算四边形的面积
  var S = Math.abs(
    (p1[0] - p3[0]) * (p2[1] - p4[1]) - (p2[0] - p4[0]) * (p1[1] - p3[1])
  );
  // 在[0, S]之间随机生成一个数
  var s = Math.random() * S;
  // 将四边形分成两个三角形，分别计算它们的面积和重心坐标
  var S1 = Math.abs(
    (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
  );
  var S2 = Math.abs(
    (p2[0] - p4[0]) * (p1[1] - p4[1]) - (p1[0] - p4[0]) * (p2[1] - p4[1])
  );
  var G1 = [
    (p1[0] + p2[0] + p3[0]) / 3,
    (p1[1] + p2[1] + p3[1]) / 3
  ];
  var G2 = [
    (p2[0] + p3[0] + p4[0]) / 3,
    (p2[1] + p3[1] + p4[1]) / 3
  ];
  // 根据s的值随机生成点的坐标
  var point;
  if (s <= S1) {
    point = randomPointInTriangle(p1, p2, p3);
  } else {
    point = randomPointInTriangle(p2, p3, p4);
  }
  return point;
}
function randomPointInTriangle(p1, p2, p3) {
  /*
   * 在三角形区域内随机生成一个点
   *
   * @param p1, p2, p3: 三个顶点的坐标，每个坐标是一个二元组
   * @return: 生成的随机点的坐标，是一个二元组
   */
  // 在三角形内随机生成一个点
  var a = Math.random(), b = Math.random();
  if (a + b > 1) {
    a = 1 - a;
    b = 1 - b;
  }
  var x = a * p1[0] + b * p2[0] + (1 - a - b) * p3[0];
  var y = a * p1[1] + b * p2[1] + (1 - a - b) * p3[1];
  return [x, y];
}

// 生成在线上的随机点
function randomPointInLine(...polygons) {
  let totalLength = 0;
  const lengths = [];
  for (let i = 0; i < polygons.length; i++) {
    const p1 = polygons[i];
    const p2 = polygons[(i + 1) % polygons.length];
    const length = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
    totalLength += length;
    lengths.push(length);
  }
  const randomValue = Math.random() * totalLength;
  let currentLength = 0;
  let edgeIndex = 0;
  let t = 0;
  for (let i = 0; i < lengths.length; i++) {
    currentLength += lengths[i];
    if (currentLength >= randomValue) {
      edgeIndex = i;
      t = (randomValue - (currentLength - lengths[i])) / lengths[i];
      break;
    }
  }
  const p1 = polygons[edgeIndex];
  const p2 = polygons[(edgeIndex + 1) % polygons.length];
  const randomPoint = { x: p1[0] + (p2[0] - p1[0]) * t, y: p1[1] + (p2[1] - p1[1]) * t };
  return [randomPoint.x, randomPoint.y];
}

function mainSceneTextureAnimate() {
  STATE.mainSceneTextureAnimateMeshArr.forEach(e => {
    e.material.map.offset.x -= 0.002
  })
}

let renderAnimationList = []
const render = () => {
  const singleFrameTime = STATE.clock.getDelta()
  const elapsedTime = STATE.clock.getElapsedTime()

  renderAnimationList.forEach(e => e.animation())
  // 天空
  if (CACHE.container.sky) CACHE.container.sky.rotation.z += 0.0001

  mainSceneTextureAnimate()

  if (!STATE.pause3D) {
    requestAnimationFrame(render);
  }
};

export const API = {
  ...TU,
  cameraAnimation,
  initLocationPopup,
  initEnvironmentPopup,
  initmonitorList,
  initPersonPopup,
  initBaseStationPopup,
  initMainMachinePopup,
  setModelPosition,
  loadGUI,
  showPopup,
  testBox,
  back,
  showPerson,
  prtScreen,
  pause3D,
  opacityPopup,
  BladePoints,
  randomPointInQuadrilateral,
  randomPointInLine,
  handleLocationBtn,
  render
}
