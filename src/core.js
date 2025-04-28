const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { eyeletCornerPositive, eyeletCornerNegative } = require('./eyelet')
const { app, corner, plate } = require('./plate')
const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { fourWayMirror, fourWayRotate } = require('./symmetries')
const { threadInsertNegative, threadInsertPositive, threadInsertPrintNegative } = require('./thread-insert')

const height = 25

connectDiameter = 10
connectDistance = 15
connectWidth = 4
connectThickness = 6
connectThreadInsertY = 5.4

const armPositive = intersect(
  cuboid({ size: [99, 99, height], center: [0, 0, height/2] }),
  hull(
    translateZ(connectDiameter/2, printCylinder(connectThickness, connectThickness)),
    translateZ(connectDiameter/2 + connectDistance, printCylinderCut(connectThickness, connectThickness))))

const armNegative = union(
  translate([0, connectThreadInsertY, connectDiameter/2],
    mirrorY(threadInsertPrintNegative({ openLength: 8 } ))),
  translate([0, connectThreadInsertY, connectDiameter/2 + connectDistance],
    mirrorY(threadInsertPrintNegative({ openLength: 8 } ))),
  hull(
    translateZ(connectDiameter/2,
      mirrorY(printCylinder(connectDiameter/2 + 0.1, connectWidth))),
    translateZ(connectDiameter/2 + connectDistance,
      mirrorY(printCylinderCut(connectDiameter/2 + 0.1, connectWidth)))))


const pillarPositive = () => {
  return cylinder({ radius: 4, height: height, center: [0, 0, height/2]})
}

const pillarNegative = () => {
  return union(
    cylinder({ radius: 3.2/2, height: height, center: [0, 0, height/2]}),
    threadInsertNegative(),
    translateZ(height, mirrorZ(threadInsertNegative())))
}

const length = 60
const width = 60

const pillarT = [width/2, length/2]
const armT = [width/2 + 10, length/2 + 5]

const armAlpha =
  Math.PI/4 - Math.asin(Math.sqrt(2)*(armT[1] - armT[0])/2/Math.sqrt(2*2 + 100*100)) +
  Math.atan2(2, 100)

const cornersPositive = fourWayMirror(
  hull(
    translate(pillarT, pillarPositive()),
    translate(armT, rotateZ(armAlpha, armPositive))))
const cornersNegative = fourWayMirror(
  union(translate(pillarT, pillarNegative()), translate(armT, rotateZ(armAlpha, armNegative))))

const armTest = translate(armT, rotateZ(armAlpha,
  cuboid({ size: [100, 4, 1], center: [50, -2, 0.5] })))
const diagonalTest = rotateZ(Math.PI/4, cuboid({ size: [400, 0.1, 0.1] }))

const test = []
// const test = union(armTest, diagonalTest)

const appPositive = fourWayMirror(
  translate(app, cylinder({ radius: 3.2/2 + 1.4, height: height, center: [0, 0, height/2] })))
const appNegative = fourWayMirror(
  translate(app,
    threadInsertNegative(),
    cylinder({ radius: 3.2/2, height: height, center: [0, 0, height/2] })))

const frame = union(
  plate(),
  fourWayMirror(cuboid({ size: [4, corner[1]*2, 8], center: [corner[0] + 2, 0, 4] })))

const eyeletsY = length/2 - 6
const eyeletsPositive = fourWayMirror(
  translate([width/2, eyeletsY, 0],
    translateZ(8,
      rotateZ(-Math.PI/2,
        eyeletCornerPositive(4, 2))),
    cuboid({ size: [4, 11, 8], center: [2, -2, 4] })))
const eyeletsNegative = fourWayMirror(
  translate([width/2, eyeletsY, 8],
    rotateZ(-Math.PI/2,
      eyeletCornerNegative(4))))

const threadInsertsTs = [
  [30.5/2, 30.5/2], [20, 20], [30, 10], [width/2, length/2 - 10], [width/2 - 10, length/2]];
const threadInsertsPositive = fourWayMirror(
  union(threadInsertsTs.map((t) => { return translate(t, threadInsertPositive()) })))
const threadInsertsNegative = fourWayMirror(
  union(threadInsertsTs.map((t) => { return translate(t, threadInsertNegative({ screwLength: 6 })) })))

const stack20Params = { screwDiameter: 2, insertLength: 4, outerDiameter: 3.2, constrainHeight: 4 }
const stack20Positive = fourWayMirror(translate([10, 10], threadInsertPositive(stack20Params)))
const stack20Negative = fourWayMirror(translate([10, 10], threadInsertNegative(stack20Params)))

const screw3Positive = union(
  cylinder({ radius: 5.9/2, height: 7, center: [0, 0, 3.5] }),
  cylinder({ radius: 7.2/2, height: 5, center: [0, 0, 2.5] }))
const screw3Negative = threadInsertNegative({ insertLength: 5 })
const port20Positive = [30, 50].map((y) => fourWayMirror(translate([10, y], screw3Positive)))
const port20Negative = [30, 50].map((y) => fourWayMirror(translate([10, y], screw3Negative)))

const core = subtract(
  union(cornersPositive, appPositive, eyeletsPositive, frame, threadInsertsPositive, stack20Positive, port20Positive, test),
  union(cornersNegative, appNegative, eyeletsNegative, threadInsertsNegative, stack20Negative, port20Negative))

const main = () => {
  return core
}

module.exports = { armT, armAlpha, core, width, length, height, main }

