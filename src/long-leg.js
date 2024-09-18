const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { fromValues } = require('@jscad/modeling').maths.mat4
const { cuboid, cylinder } = require('@jscad/modeling').primitives
const { mirrorZ, rotateX, rotateY, rotateZ, transform, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

// TODO
// - label 80, the height, somewhere

const height = 80
const angle = Math.PI/6
const length = height / Math.cos(angle)
const width = 10
const thickness = 4

const shearYonZ = (k, shape) => {
  const mat = fromValues(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, k, 1, 0,
    0, 0, 0, 1)
  return transform(mat, shape)
}

const body = (y, length) => {
  return shearYonZ(Math.sin(angle),
    cuboid({
      size: [width, length, thickness],
      center: [0, y + length/2, thickness/2] }))
}

const grooves = union(
  [0, 2, 4, 6, 8, 10, 12, 14, 16].map((x) => {
    return union(
      rotateY(Math.PI/2,
        cylinder({ radius: 1, height: 20, segments: 4, center: [-0.3, x, 0] })))
  })) 

const footRadius = 6
const e = 0.001
const foot = subtract(
  hull(
    body(0, footRadius*2),
    rotateX(Math.PI/2 - angle,
      cylinder({radius: footRadius, height: e, center: [0, footRadius, e/2] }))),
  rotateX(Math.PI/2 - angle, grooves))

const screwThickness = 4
const screwPositive =
  cylinder({ radius: 4, height: screwThickness, center: [0, 0, screwThickness / 2] })
const screwNegative = union(
  cylinder({ radius: 3.2 / 2, height: 20 }),
  cylinder({ radius: 4.2, height: 20, center: [0, 0, 10 + screwThickness] }))
const screwsSunwise = [[0, 0], [10*Math.sqrt(2)/2, 10*Math.sqrt(2)/2]]
const screwsWiddershins = [[0, 0], [-10*Math.sqrt(2)/2, 10*Math.sqrt(2)/2]]
const screwsCross = [[-5, 2.5], [5, 2.5]]
const screwsDiagonal = [[-10*Math.sqrt(2)/2, 4], [10*Math.sqrt(2)/2, 4]]
const positionScrews = (screw, orientation) => {
  if (orientation == "s") {
    ts = screwsSunwise
  } else if (orientation == "w") {
    ts = screwsWiddershins
  } else if (orientation == "c") {
    ts = screwsCross
  } else if (orientation == "d") {
    ts = screwsDiagonal
  }
  return translateY(length,
    rotateX(Math.PI/2 - angle,
      translateY(thickness,
        union(ts.map((t) => translate(t, screw))))))
}

const screwConnect = 16
const screws = (orientation) => {
  return subtract(
    hull(
      body(length - screwConnect, screwConnect),
      positionScrews(screwPositive, orientation)),
    positionScrews(screwNegative, orientation))
}

const longLeg = (orientation) => {
  return union(foot, body(8, length - 20), screws(orientation))
}

const main = () => {
  return longLeg("s")
}

module.exports = { longLeg, main }

