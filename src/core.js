const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { eyeletCornerPositive, eyeletCornerNegative } = require('./eyelet')
const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { fourWayMirror, fourWayRotate, xx, yy } = require('./symmetries')
const { threadInsertNegative, threadInsertPositive, threadInsertPrintNegative } = require('./thread-insert')
const { frame, frameThreadPositive, frameThreadNegative, length, width } = require('./frame')

const threadTs = [[30.5/2, 30.5/2],
    [10, 20], [10, 40],
    [20, 10], [20, 20], [20, 30], [20, 40],
    [30, 10], [30, 20], [30, 30]]

const frameThreadsPositive = yy(xx(threadTs.map((t) => translate(t, frameThreadPositive))))
const frameThreadsNegative = yy(xx(threadTs.map((t) => translate(t, frameThreadNegative))))

const stack20Params = { screwDiameter: 2, insertLength: 4, outerDiameter: 3.2, height: 4 }
const stack20Positive = threadInsertPositive(stack20Params)
const stack20Negative = translateZ(4, mirrorZ(threadInsertNegative(stack20Params)))
const stack20Ts = [[10, 10], [10, 30]]
const stack20sPositive = xx(yy(stack20Ts.map((t) => translate(t, stack20Positive))))
const stack20sNegative = xx(yy(stack20Ts.map((t) => translate(t, stack20Negative))))

const height = 25

connectDiameter = 10
connectDistance = 15
connectWidth = 4
connectThickness = 6
connectLength = 7
connectThreadInsertY = 5.4

const armPositive = intersect(
  cuboid({ size: [99, 99, height], center: [0, 0, height/2] }),
  hull(
    translateZ(connectDiameter/2, printCylinder(connectThickness, connectLength)),
    translateZ(connectDiameter/2 + connectDistance, printCylinderCut(connectThickness, connectLength))))

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


const core = subtract(
  union(frame(), cornersPositive, frameThreadsPositive, stack20sPositive),
  union(cornersNegative, frameThreadsNegative, stack20sNegative))

const main = () => {
  return core
}

module.exports = { armAlpha, armT, height, core, main }

