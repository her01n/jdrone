const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateX, rotateY, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { doubleBellyPositive, doubleBellyNegative, doubleBellyConnect } = require('./belly')

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

const cameraScrewY = 14 + 5.6

const bellyCameraScrew = subtract(
  union(
    doubleBellyPositive(),
    translateY(cameraScrewY, cameraScrewPositive),
    hull(
      doubleBellyConnect(),
      translateY(cameraScrewY, cameraScrewConnect))),
  union(
    doubleBellyNegative(),
    translateY(cameraScrewY, cameraScrewNegative)))

const main = () => {
  return bellyCameraScrew
}

module.exports = { main }

