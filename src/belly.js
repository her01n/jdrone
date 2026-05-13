const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateX, rotateY, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { hornConnect, hornPositive } = require('./horns')
const { xx, yy } = require('./symmetries')

const leg = hull(
  cuboid({ size: [60 + 8, 8, 2], center: [0, 0, 1] }),
  xx(cylinder({ height: 4, radius: 3, center: [20, 0, 2] }))) 

const pillarPositive = (pillarHeight) => {
  return cylinder({ height: pillarHeight, radius: 3, center: [0, 0, pillarHeight / 2] })
}
const pillarNegative = (pillarHeight) => {
  return cylinder({ height: pillarHeight, radius: 3.2 / 2, center: [0, 0, pillarHeight / 2] })
}
const pillarConnect = cylinder({ height: 2, radius: 3, center: [0, 0, 1] })

const batteryNegative = (batteryWidth, batteryHeight, plusLength, pillarHeight) => {
  return cuboid({
    size: [batteryWidth, 40 + plusLength, batteryHeight],
    center: [0, plusLength/2 - 20, pillarHeight - batteryHeight/2] })
}

const batteryConnect = cuboid({ size: [40, 8, 2], center: [0, 0, 1] })

const simpleBelly = ({ batteryWidth = 35, batteryHeight = 27, plusLength = 14, pillarHeight = 28 } = {}) => {
  return subtract(
    union(
      xx(translateX(20, pillarPositive(pillarHeight))),
      leg,
      translateY(plusLength, hornPositive),
      yy(hull(batteryConnect, translateY(plusLength, hornConnect)))),
    union(
      xx(translateX(20, pillarNegative(pillarHeight))),
      batteryNegative(batteryWidth, batteryHeight, plusLength, pillarHeight)))
}

const pillarTs = [[20, 0], [-20, 0], [20, -20], [-20, -20]]

const doubleBellyPositive = ({ batteryWidth = 35, batteryHeight = 27, plusLength = 14, pillarHeight = 28 } = {}) => {
  return union(
    pillarTs.map((t) => translate(t, pillarPositive(pillarHeight))),
    leg,
    translateY(plusLength, hornPositive),
    hull(
      pillarTs.map((t) => translate(t, pillarConnect)),
      translateY(plusLength, hornConnect)))
}

const doubleBellyNegative = ({ batteryWidth = 35, batteryHeight = 27, plusLength = 14, pillarHeight = 28 } = {}) => {
  return union(
    pillarTs.map((t) => translate(t, pillarNegative(pillarHeight))),
    batteryNegative(batteryWidth, batteryHeight, plusLength, pillarHeight))
}

const doubleBellyConnect = ({ batteryWidth = 35, batteryHeight = 27, plusLength = 14, pillarHeight = 28 } = {}) => {
  return hull(
    xx(translateX(20, pillarConnect)),
    translateY(plusLength, xx(translateX(batteryWidth/2, pillarConnect))))
}

const main = () => {
  return simpleBelly()
}

module.exports = { main, doubleBellyPositive, doubleBellyNegative, doubleBellyConnect, simpleBelly } 

