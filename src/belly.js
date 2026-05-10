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

const simpleBelly = (batteryWidth, batteryHeight, plusLength, pillarHeight) => {
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

const cameraAngle = Math.PI / 12
const screwThickness = 7
const cameraRadius = 15 / 2
const cameraScrewPositive = translateY(cameraRadius*2,
  rotateX(-cameraAngle, 
    cylinder({ radius: cameraRadius, height: screwThickness, center: [0, -cameraRadius, screwThickness / 2] })))
const cameraScrewNegative = translateY(cameraRadius*2,
  rotateX(-cameraAngle,
    cylinder({ radius: 6.35 / 2, height: screwThickness, center: [0, -cameraRadius, screwThickness / 2] }),
    cylinder({ radius: 6, height: 20, center: [0, -cameraRadius, -10] })))
const cameraScrewConnect = cylinder({ radius: cameraRadius, height: 4, center: [0, cameraRadius, 2] })

const bellyCameraScrew = (batteryWidth, batteryHeight, plusLength, pillarHeight) => {
  const pillarTs = [[20, 0], [-20, 0], [20, -20], [-20, -20]]
  const cameraScrewY = plusLength + 5.6
  return subtract(
    union(
      pillarTs.map((t) => translate(t, pillarPositive(pillarHeight))),
      leg,
      translateY(plusLength, hornPositive),
      translateY(cameraScrewY, cameraScrewPositive),
      hull(
        pillarTs.map((t) => translate(t, pillarConnect)),
        translateY(plusLength, xx(translateX(batteryWidth/2, pillarConnect))),
        translateY(plusLength, hornConnect),
        translateY(cameraScrewY, cameraScrewConnect))),
    union(
      pillarTs.map((t) => translate(t, pillarNegative(pillarHeight))),
      translateY(cameraScrewY, cameraScrewNegative),
      batteryNegative(batteryWidth, batteryHeight, plusLength, pillarHeight)))
}

const main = () => {
  return simpleBelly(35, 27, 14, 28)
}
   
module.exports = { bellyCameraScrew, main, simpleBelly } 

