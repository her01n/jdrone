const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { fourWayMirror, fourWayRotate, xx, yy, zz } = require('./symmetries')

const connectWidth = 12
const connectDiameter = 10
const connectDistance = 15

const screws = (shape) => {
  return [
    translateZ(connectDiameter/2, shape),
    translateZ(connectDiameter/2 + connectDistance, shape)]
}

const connect = ({ length = 4, slack = 0 } = {}) => {
  const half =
    zz(
      xx(
        translateX((connectWidth - connectDiameter) / 2,
          printCylinder(connectDiameter/2 + slack, length))))
  return hull(screws(half))
}

module.exports = { connect, screws }
