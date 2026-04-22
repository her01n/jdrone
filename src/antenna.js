const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const antennaHeight = 3
const antennaWidth = 4.1
const antennaLength = 7
const antennaThickness = 2
const notchRadius = 1

const antennaPositive = cuboid({
  size: [antennaThickness + antennaWidth + antennaThickness, antennaLength + 2*notchRadius, antennaHeight],
  center: [0, (antennaLength + 2*notchRadius)/2, antennaHeight/2 ] })

const antennaNegative = subtract(
  cuboid({
    size: [antennaWidth, antennaLength + 2*notchRadius, 99],
    center: [0, (antennaLength + 2*notchRadius)/2, 0] }),
  cylinder({
    radius: notchRadius,
    height: antennaHeight,
    center: [antennaWidth/2, antennaLength + notchRadius, antennaHeight/2 ] }))

const antennaConnect = cuboid({
  size: [antennaThickness + antennaWidth + antennaThickness, antennaThickness*2, antennaHeight],
  center: [0, -antennaThickness/2, antennaHeight/2 ] })

const framePositive = cylinder({ radius: 3.5, height: 4, center: [0, 0, 2] })
const frameNegative = cylinder({ radius: 3.2 / 2, height: 4, center: [0, 0, 2] })
const frameConnect = cylinder({ radius: 3, height: antennaHeight, center: [0, 0, antennaHeight / 2] })

const antennaTransform = (shape) => translate([6, 6, 0], rotateZ(-Math.PI/2, shape))

const antenna = subtract(
  union(
    antennaTransform(antennaPositive),
    framePositive,
    hull(frameConnect, antennaTransform(antennaConnect))),
  union(
    antennaTransform(antennaNegative),
    frameNegative))

const main = () => {
  return antenna
}

module.exports = { antenna, main }

