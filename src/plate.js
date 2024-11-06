const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { fourWayMirror, fourWayRotate } = require('./symmetries')

const thickness = 1.8

const batteryLength = 16
const batteryPitch = 30
const batteryWidth = 5
const batteryWall = 2.4

const batteryPositive = fourWayRotate(
  cuboid({
    size: [batteryLength + batteryWall*2, batteryPitch + 2*batteryWidth + 2*batteryWall, thickness],
    center: [0, 0, thickness/2] }))
const batteryNegative = fourWayRotate(
  cuboid({
    size: [batteryWidth, batteryLength, 8], center: [batteryPitch/2 + batteryWidth/2, 0, 4] }))

const arrowNegative = arrowCut(20, thickness)

const wallWidth = 10
const walls = (length, width) => {
  return union(
    cuboid({ size: [wallWidth, length, thickness], center: [(batteryLength + wallWidth)/2, 0, thickness/2] }),
    cuboid({ size: [wallWidth, length, thickness], center: [-(batteryLength + wallWidth)/2, 0, thickness/2] }),
    cuboid({ size: [width, wallWidth, thickness], center: [0, (batteryLength/2 + wallWidth)/2, thickness/2] }),
    cuboid({ size: [width, wallWidth, thickness], center: [0, -(batteryLength/2 + wallWidth)/2, thickness/2] }))
}

const cross = (length, width) => {
  return intersect(
    cuboid({ size: [width, length, thickness], center: [0, 0, thickness/2] }),
    rotateZ(Math.PI/4,
      union(
        cuboid({ size: [wallWidth, length + width + wallWidth, thickness], center: [0, 0, thickness/2] }),
        cuboid({ size: [length + width + wallWidth, wallWidth, thickness], center: [0, 0, thickness/2] }))))
}

const plate = (length, width) => {
  const sideBatteryNegativeHalf = cuboid({
    center: [width/2 - 4 - batteryWidth/2, 0, 0],
    size: [batteryWidth, batteryLength, 8] })
  if (width - 8 < batteryPitch + 2*batteryWidth) {
    sideBatteryNegative = union(sideBatteryNegativeHalf, mirrorX(sideBatteryNegativeHalf))
  } else {
    sideBatteryNegative = cuboid({ size: [0, 0, 0] })
  }

  return subtract(
    union(batteryPositive, walls(length, width), cross(length, width)),
    union(batteryNegative, sideBatteryNegative, arrowNegative))
}

const main = () => {
  return plate(80, 60)
}

module.exports = { batteryLength, batteryWidth, plate, main }

