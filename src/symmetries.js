const { subtract, union } = require('@jscad/modeling').booleans
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const yy = (shape) => { return union(shape, mirrorY(shape)); }
const xx = (shape) => { return union(shape, mirrorX(shape)); }

const fourWayMirror = (shape) => {
  return [shape, mirrorX(shape), mirrorY(shape), mirrorY(mirrorX(shape))]
}

const fourWayRotate = (shape) => {
  return [shape, rotateZ(Math.PI/2, shape), rotateZ(Math.PI, shape), rotateZ(Math.PI*3/2, shape)]
}

module.exports = { fourWayMirror, fourWayRotate, xx, yy }


