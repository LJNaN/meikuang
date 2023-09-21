let container = null // container

const removed = {}

let timer = null // 综采的timer

let locationTimer = null // 谈上下移动的timer

let environmentLocationPopup = null // 当前操作的location弹窗

let cameraP = null

let mainSceneLoad = false // 主场景是否加载完毕，主场景标签和工作面状态用的

export const CACHE = {
  container,
  removed,
  locationTimer,
  environmentLocationPopup,
  cameraP,
  mainSceneLoad,
  timer
}
