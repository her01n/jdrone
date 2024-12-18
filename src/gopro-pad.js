const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const screwPositive = cylinder({
  radius: 4,
  height: 2,
  center: [0, 0, 1] })

const screwNegative = cylinder({ radius: 3.2/2, height: 100 })

const gopro = cuboid({ size: [17, 15, 2], center: [0, 0, 1] })

const a = 40

const goproPad = subtract(
  hull(
    translateX(a/2, screwPositive),
    translateX(-a/2, screwPositive),
    gopro),
  translateX(a/2, screwNegative),
  translateX(-a/2, screwNegative))

const main = () => {
  return goproPad
}

module.exports = { main, goproPad }
