const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const fourWayMirror = (shape) => {
  return [shape, mirrorX(shape), mirrorY(shape), mirrorY(mirrorX(shape))]
}

const fourWayRotate = (shape) => {
  return [shape, rotateZ(Math.PI/2, shape), rotateZ(Math.PI, shape), rotateZ(Math.PI*3/2, shape)]
}

module.exports = { fourWayMirror, fourWayRotate }


