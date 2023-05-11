let container = null;
let Bol3D = null;
/**
 * 初始化 TU
 * @date 2023-05-06
 * @param {any} scene container 
 * @param {any} bol3d Bol3D
 * @returns {any}
 */
function init(scene, bol3d) {
  container = scene;
  Bol3D = bol3d;
}

class MapAnimation {
    /**
     * 描述
     * @date 2023-02-15
     * @param {any} mesh  目标 mesh 对象
     * @param {number} offset  偏移量
     * @param {'x'|'y'|'all'} [axis] axis='x'  偏移方向
     */
    constructor(mesh, offset, axis = 'x') {
        this.mesh = mesh;
        this.offset = offset;
        this.axis = axis;
        this.rAFid = null;
    }
    /**
     * 动画开始
     * @date 2023-02-15
     * @param {any} callback 回调, 返回一个 mesh 参数
     */
    start(callback) {
        const offset = this.mesh.material.map.offset;
        const targetOffsetAxis = offset[this.axis];
        const offsetArry = [];
        if (this.axis == 'x') {
            offsetArry[0] = targetOffsetAxis + this.offset;
            offsetArry[1] = offset.y;
        } else if (this.axis == 'y') {
            offsetArry[0] = offset.x;
            offsetArry[1] = targetOffsetAxis + this.offset;
        } else {
            offsetArry[0] = offset.x + this.offset;
            offsetArry[1] = offset.y + this.offset;
        }
        this.mesh.material.map.offset.set(...offsetArry);
        this.rAFid = requestAnimationFrame(this.start.bind(this, callback));
        callback?.(this.mesh);
    }
    /**
     * 动画停止
     * @date 2023-02-15
     */
    stop() {
        cancelAnimationFrame(this.rAFid);
    }

}

/** 模型聚焦
 * @date 2023-01-31
 * @param {array}    point       // 点坐标
 * @param {array}    look        // 视角坐标
 * @param {number}   [times=1000]  // 聚焦动画时间 默认 1000 毫秒
 * @param {Function} [doit]        // 回调函数
 */
function focus(point, look, times = 1000, doit) {
  new Bol3D.TWEEN.Tween(container.orbitCamera)
    .to({
      position: new Bol3D.Vector3(...look)
    }, times)
    .start();
  new Bol3D.TWEEN.Tween(container.orbitControls)
    .to({
      target: new Bol3D.Vector3(...point)
    }, times)
    .start()
    .onComplete(function () {
      doit?.();
    });
}

/** 切换模型
 * @date 2023-01-31
 * @param {array | string} names  // 要显示的模型名字（除此模型以外都隐藏或显示）
 */
function toggleModel(names, isShow = true) {
  names = Array.isArray(names) ? names : [names];
  container.sceneModels.forEach(model => model.visible = names.includes(model.name));
}

/** 显示隐藏模型
 * @date 2023-01-31
 * @param {string | array} names  // 要显示的模型名字
 * @param {boolean} [isShow=true]      // true 显示模型，false 隐藏模型，（默认隐藏）
 */
function showModel(names, isShow = true) {
  names = Array.isArray(names) ? names : [names];
  names.forEach(name => container.sceneModels[name].visible = isShow);
}

/** 获取 visible 为 true 的模型
 * @date 2023-01-31
 * @returns {any}   // 返回 visible 为 true 的模型
 */
function getShowModel() {
  return container.sceneModels.filter(item => item.visible)
}

/** 获取 visible 为 false 的模型
 * @date 2023-01-31
 * @returns {any}   // 返回 visible 为 false 的模型
 */
function getHideModel() {
  return container.sceneModels.filter(item => !item.visible)
}

/** 设置透明度
 * @date 2023-01-31 
 * @param {any} meshs               // mesh 的类型数组
 * @param {number} num              // 透明度 0~1
 * @param {boolean} [isTran=true]   // 可选：true 透明，false 不透明，（默认透明）
 */
function setOpacity(meshs, num, isTran = true) {
  getMesh(meshs).forEach(mesh => {
    mesh.material.transparent = isTran;
    mesh.material.opacity = num;
  });
}

/** 设置颜色
 * @date 2023-01-31
 * @param {any} meshs   // 要查找的元素
 * @param {color} color // 颜色 16 进制
 */
function setColor(meshs, color) {
  getMesh(meshs).forEach(item => item.material.color.set(color));
}

/** 查找 mesh 元素
 * @date 2023-01-31
 * @param {array | object} data   // 要查找的元素
 * @returns {array}    // 返回结果
 */
function getMesh(data) {
  const meshList = [];
  function _getMesh(list) {
    list.forEach(a => {
      if (a.isMesh) meshList.push(a);
      else {
        a.children?.forEach(a => _getMesh([a]));
      }
    });
  }
  data = Array.isArray(data) ? data : [data];
  _getMesh(data);
  return meshList
}

/** 创建镜面物体
 * @date 2023-01-31
 * @param {object} option
 * @param {array} [option.size=[10000, 10000]] // 镜面大小默认 [10000,10000]
 * @param {color} [option.color=0xffffff]  // 镜面颜色
 * @returns {any}               //创建的镜面物体对象
 */
function createMirror(option = {}) {
  const { size = [10000, 10000], color = 0xffffff } = option;
  const geometry = new Bol3D.PlaneGeometry(...size);
  const verticalMirror = new Bol3D.Reflector(geometry, {
    clipBias: 0.0003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color
  });
  verticalMirror.material.transparent = false;
  return verticalMirror
}



/**
 * 虚化场景
 * @date 2023-04-19
 * @param {any} target
 * @param {object} options
 * @param {any} [options.color]  虚化颜色
 * @param {any} [options.lineColor]  线颜色
 */
function onFadeModel(target, options = {}) {
  const { lineColor = "#36BCFF", color = "#009EFF" } = options;
  let buildMaterial = new Bol3D.MeshBasicMaterial({
    color,     // 颜色
    transparent: true,    // 是否开启使用透明度
    opacity: 0.25,        // 透明度
    depthWrite: false,    // 关闭深度写入 透视效果
    side: Bol3D.DoubleSide, // 双面显示
  });
  // 建筑线材质
  let lineMaterial = new Bol3D.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    side: Bol3D.DoubleSide,
  });
  target.traverse(child => {
    if (child.isMesh) {
      if (!child.userData.initMaterial) child.userData.initMaterial = child.material.clone();
      child.userData.fadeMaterial = buildMaterial;
      child.material = buildMaterial;
      if (child.geometry) {
        const edges = new Bol3D.EdgesGeometry(
          child.geometry
        );
        const line = new Bol3D.LineSegments(
          edges,
          lineMaterial                      // 赋线条材质
        );
        const oldLine = child.children.find(item => item.isLineSegments);
        oldLine && child.remove(oldLine);
        child.add(line);                     // 把每一个mesh生成的线条添加到场景中
      }
    }
  });
}


/**
 * 还原虚化场景
 * @date 2023-04-19
 * @param {any} target
 */
function offFadeModel(target) {
  target.traverse(child => {
    if (child.isMesh) {
      child.userData.initMaterial && (child.material = child.userData.initMaterial);
      child.traverse(item => {
        if (item.isLineSegments) {
          item.visible = false;
        }
      });
    }
  });
}

var toZhangHang = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MapAnimation: MapAnimation,
  focus: focus,
  toggleModel: toggleModel,
  showModel: showModel,
  getShowModel: getShowModel,
  getHideModel: getHideModel,
  setOpacity: setOpacity,
  setColor: setColor,
  getMesh: getMesh,
  createMirror: createMirror,
  onFadeModel: onFadeModel,
  offFadeModel: offFadeModel
});

/**
 * 输出一个shader基本框架
 * 材质赋值 看源码中的注释
 * @returns shaderConfig
 */
function shaderTemplate() {
  const shaderConfig = {
    uniform: {
      iTime: { value: 0 }
    },
    vertexShader: `
      // 解决深度问题
      #include <logdepthbuf_pars_vertex>
      #include <common>

      // 获取时间 颜色 位置 uv信息等基本属性
      uniform float iTime;
      varying vec3 vColor;
      varying vec3 vPosition;
      varying vec2 vUv;

      
      void main() { 
        // 输出位置 uv信息
        vPosition = vec3(position.x, position.y, position.z);
        vUv = vec2(uv.x, uv.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

        // 解决深度问题
        #include <logdepthbuf_vertex>
      } 
    `,
    // 片元着色器
    fragmentShader: ` 
      // 解决深度问题
      #include <logdepthbuf_pars_fragment>
      #include <common>

      // 接收位置
      uniform float iTime;
      varying vec3 vPosition;
      varying vec2 vUv;
      float x;
      float y;
      float z;

      void main() {
        x = vPosition.x / 1.0 + 0.5;  // 除以模型长宽高的 x  +0.5是让坐标系变为0-1(居中)
        y = vPosition.y / 1.0 + 0.5;  // 除以模型长宽高的 y  +0.5是让坐标系变为0-1(居中)
        z = vPosition.z / 1.0 + 0.5;  // 除以模型长宽高的 z  +0.5是让坐标系变为0-1(居中)

        // 用 position 位置信息
        // gl_FragColor = vec4(x, y, z, 1.0);

        // 用 uv 信息
        gl_FragColor = vec4(vUv.x, 0.8, vUv.y, 1.0);

        // 解决深度问题
        #include <logdepthbuf_fragment>
      }
    `
  };

  // const mat = new Bol3D.ShaderMaterial()
  // mat.uniforms = shaderConfig.uniform
  // mat.vertexShader = shaderConfig.vertexShader
  // mat.fragmentShader = shaderConfig.fragmentShader
  // mat.transparent = true
  // mat.side = 2

  return shaderConfig
}


/**
 * 飞线动画
 * 
 * const flyLine1 = new FlyLine()
 * 
 * render 中
 * const dt = clock.getElapsedTime()
 * flyline1.animation(dt)
 */
class FlyLine {
  // 输出实例
  flyLine = null

  // 基本属性
  source = { x: 0, y: 0, z: 0 }
  target = { x: 100, y: 100, z: 100 }
  range = 100
  height = 100
  color = '#ff0000'
  size = 30
  density = 2.0
  speed = 1.0
  gap = 1.1

  /** 
   * option 参数:
   * @param {Objcet} source 开始位置
   * @param {Objcet} target 目标位置
   * @param {Float | Number} range 流线拖尾长度
   * @param {Float | Number} height 流线能跳多高，与 target.y 相同的话效果就是( 终点.y - 起点.y )的 1.5 倍高
   * @param {String} color 颜色
   * @param {Float | Number} size 粒子大小
   * @param {Float} density 粒子密度
   * @param {Float} speed 速度 需要与 gap 配合调整
   * @param {Float} gap 流线出现间隔 (大于等于1) 需要与 speed 配合调整
   */
  constructor(option = {}) {
    const { source, target, range, height, color, speed, size, density, gap } = option;
    if (source) this.source = source;
    if (target) this.target = target;
    if (range) this.range = range;
    if (height) this.height = height;
    if (color) this.color = color;
    if (speed) this.speed = speed;
    if (size) this.size = size;
    if (density) this.density = density;
    if (gap) this.gap = gap;

    this.flyLine = this.init();
  }

  init() {
    const positions = [];
    const attrPositions = [];
    const attrCindex = [];
    const attrCnumber = [];

    const _source = new Bol3D.Vector3(this.source.x, this.source.y, this.source.z);
    const _target = new Bol3D.Vector3(this.target.x, this.target.y, this.target.z);
    const _center = _target.clone().lerp(_source, 0.5);
    _center.y += this.height;

    const number = parseInt(_source.distanceTo(_center) + _target.distanceTo(_center)) * this.density;
    const curve = new Bol3D.QuadraticBezierCurve3(
      _source,
      _center,
      _target
    );

    const points = curve.getPoints(number);
    // 粒子位置计算 
    points.forEach((elem, i) => {
      const index = i / (number - 1);
      positions.push({
        x: elem.x,
        y: elem.y,
        z: elem.z
      });
      attrCindex.push(index);
      attrCnumber.push(i);
    });


    positions.forEach((p) => {
      attrPositions.push(p.x, p.y, p.z);
    });

    const geometry = new Bol3D.BufferGeometry();

    geometry.setAttribute('position', new Bol3D.Float32BufferAttribute(attrPositions, 3));
    // 传递当前所在位置
    geometry.setAttribute('index', new Bol3D.Float32BufferAttribute(attrCindex, 1));
    geometry.setAttribute('current', new Bol3D.Float32BufferAttribute(attrCnumber, 1));

    const shader = new Bol3D.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: Bol3D.AdditiveBlending,
      uniforms: {
        uColor: {
          value: new Bol3D.Color(this.color) // 颜色
        },
        uRange: {
          value: this.range
        },
        uSize: {
          value: this.size
        },
        uTotal: {
          value: number
        },
        uGap: {
          value: this.gap
        },
        uSpeed: {
          value: this.speed
        },
        time: {
          value: 0
        }
      },
      vertexShader: `
      attribute float index;
      attribute float current;
      uniform float time;
      uniform float uSize; // 大小
      uniform float uRange; // 展示区间
      uniform float uTotal; // 粒子总数
      uniform float uSpeed; // 速度
      uniform float uGap; // 间隔
      uniform vec3 uColor; // 颜色
      
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
          // 需要当前显示的索引
          float size = uSize;
          float showNumber = uTotal * mod(time, uGap) * uSpeed;
          if (showNumber > current && showNumber < current + uRange) {
              float uIndex = ((current + uRange) - showNumber) / uRange;
              size *= uIndex;
              vOpacity = 1.0;
          } else {
              vOpacity = 0.0;
          }

          // 顶点着色器计算后的Position
          vColor = uColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition; 
          // 大小
          gl_PointSize = size * 30.0 / (-mvPosition.z);
      }`,
      fragmentShader: `
      varying vec3 vColor; 
      varying float vOpacity;
      void main() {
          gl_FragColor = vec4(vColor, vOpacity);
      }`
    });

    const point = new Bol3D.Points(geometry, shader);
    return point
  }

  animation(elapsedTime) {
    this.flyLine.material.uniforms.time.value = elapsedTime;
  }
}

var toJiangNan = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shaderTemplate: shaderTemplate,
  FlyLine: FlyLine
});

const TU = {
  init,
  ...toZhangHang,
  ...toJiangNan
};

export { TU as default };
