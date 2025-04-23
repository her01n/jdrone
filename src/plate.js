const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { fourWayMirror, fourWayRotate } = require('./symmetries')

const thickness = 1.8

const batteryLength = 16
const batteryPitch = 30
const batteryWidth = 5
const batteryWall = 2.4

const batteryPositive = cuboid({
  size: [batteryPitch + batteryWidth*2 + batteryWall*2, batteryPitch + batteryWidth*2 + batteryWall*2, thickness],
  center: [0, 0, thickness/2] })
const batteryNegative = fourWayRotate(
  cuboid({ size: [batteryWidth, batteryLength, thickness], center: [batteryPitch/2 + batteryWidth/2, 0, thickness/2] }))

const arrowNegative = arrowCut(20, thickness)

const corner = [30, 30]
const app = [20, 50]

const crossWidth = 10

const H = union(
  cuboid({ size: [crossWidth, 99, thickness], center: [10, 0, thickness/2] }),
  cuboid({ size: [crossWidth, 99, thickness], center: [-10, 0, thickness/2] }))
const X = rotateZ(Math.PI/4,
  cuboid({ size: [crossWidth, 99, thickness], center: [0, 0, thickness/2] }))
const cross = intersect(
  hull(
    fourWayMirror(
      union([corner, app].map((t) => translate(t, cylinder({ radius: 0.001, height: 99 })))))),
  union(fourWayRotate(union(H, X))))

const plate = ({ frameWidth = 8, frameHeight = 4} = {}) => {
  const frame = hullChain(
    [[corner[0], corner[1]], [corner[0], -corner[1]], [app[0], -app[1]], [-app[0], -app[1]],
     [-corner[0], -corner[1]], [-corner[0], corner[1]], [-app[0], app[1]], [app[0], app[1]],
     [corner[0], corner[1]], [-corner[0], corner[1]], [-corner[0], -corner[1]], [corner[0], -corner[1]]]
       .map((t) =>
         translate(t,
           cylinder({ radius: frameWidth/2, height: frameHeight, center: [0, 0, frameHeight/2] }))))
  return subtract(
    union(frame, cross, batteryPositive),
    union(arrowNegative, batteryNegative))
}

const main = () => {
  return plate
}

module.exports = { corner, app, plate, main }

