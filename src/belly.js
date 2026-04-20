const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateY, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { hornConnect, hornPositive } = require('./horns')
const { xx, yy } = require('./symmetries')

const batteryLength = 105
const batteryWidth = 35
const batteryHeight = 25

const pillarHeight = 27

const pillarPositive = cylinder({ height: pillarHeight, radius: 3, center: [0, 0, pillarHeight / 2] })
const pillarNegative = cylinder({ height: pillarHeight, radius: 3.2 / 2, center: [0, 0, pillarHeight / 2] })

const leg = hull(
  cuboid({ size: [60 + 8, 8, 2], center: [0, 0, 1] }),
  xx(cylinder({ height: 4, radius: 3, center: [20, 0, 2] }))) 

const hornsY = batteryLength/2 - 40
const batteryConnect = cuboid({ size: [40, 8, 2], center: [0, 0, 1] })

const batteryNegative = cuboid({ size: [batteryWidth, batteryLength, 100], center: [0, -40, 2 + 50] })

const belly = subtract(
  union(
    xx(translateX(20, pillarPositive)),
    leg,
    translateY(hornsY, hornPositive),
    yy(hull(batteryConnect, translateY(hornsY, hornConnect)))),
  union(
    xx(translateX(20, pillarNegative)),
    batteryNegative))
   
const main = () => {
  return belly
}

module.exports = { belly, main } 

