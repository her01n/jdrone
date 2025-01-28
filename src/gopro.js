const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateY, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { threadInsertNegative, threadInsertPositive, threadInsertPrintNegative } = require('./thread-insert')

const finHeight = 15
const centerFinWidth = 3
const sideFinWidth = 4
const finDistance = 3
const slack = 0.1
const z = 9
const screwRadius = 5.2 / 2
const connectHeight = 7
const threadInsertOuterDiameter = 12
const threadInsertPosition = 1 + 8 + centerFinWidth/2 + finDistance
const screwThickness = 2

const finsWidth = centerFinWidth + 2*finDistance + 2*sideFinWidth

const goproConnect = cuboid({
  size: [finsWidth, finHeight, connectHeight],
  center: [0, 0, connectHeight/2] })

const goproPositive = hull(
  translateZ(z,
    rotateY(Math.PI/2,
      cylinder({ radius: finHeight/2, height: finsWidth }),
      cylinder({ radius: threadInsertOuterDiameter/2, height: 2, center: [0, 0, -threadInsertPosition + 1] }))),
  goproConnect)

const cut = finHeight * (1 - Math.cos(Math.PI/4))

const finSlack = 1
const finCut = 
  union(
    rotateY(Math.PI/2,
      cylinder({
        radius: finHeight/2 + finSlack,
        height: finDistance,
        center: [0, 0, -centerFinWidth/2 - finDistance/2] })),
    cuboid({
      size: [finDistance, 100, 200],
      center: [-centerFinWidth/2 - finDistance/2, 0, 100 - finHeight/2 + cut - 2*finSlack] }))

const goproNegative = translateZ(z,
  rotateZ(Math.PI/2, translateY(-100, printCylinderCut(screwRadius, 200))),
  finCut, mirrorX(finCut),
  translateX(-threadInsertPosition,
    rotateZ(-Math.PI/2,
      threadInsertPrintNegative({ outerDiameter: 8, insertLength: 7, screwDiameter: 5 }))),
  rotateY(Math.PI/2,
    cylinder({
      radius: 6,
      height: 200,
      center: [0, 0, finsWidth/2 + 100] })))

const screwConnect = cylinder({ radius: 4, height: screwThickness, center: [0, 0, screwThickness/2] })
const screwNegative = union(
  cylinder({ radius: 3.2 / 2, height: 8 }),
  cylinder({ radius: 7.2 / 2, height: 20, center: [0, 0, screwThickness + 10] }))

const a = 40
screwTs = [[a/2, 0], [-a/2, 0]]

const gopro = subtract(
  union(
    hull(
      goproConnect,
      union(screwTs.map((t) => { return translate(t, screwConnect) }))),
    goproPositive),
  union(
    goproNegative,
    union(screwTs.map((t) => { return translate(t, screwNegative) }))))
   
const main = () => {
  return gopro
}

module.exports = { gopro, goproConnect, goproNegative, goproPositive, main } 

