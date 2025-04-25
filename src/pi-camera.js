const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { eyeletCornerPositive, eyeletCornerNegative } = require('./eyelet')
const { app, corner, plate } = require('./plate')
const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { fourWayMirror, fourWayRotate, xx, yy } = require('./symmetries')
const { threadInsertNegative, threadInsertPositive, threadInsertPrintNegative } = require('./thread-insert')

const thickness = 1.2
const width = 20
const length = 12
const center = 9.0
const height = 8 - thickness

const box = cuboid({ size: [width, length, height], center: [0, 0, height/2] })

const lenThickness = 1.0
const lenInnerDiameter = 6
const cameraHeight = 3.3
const cameraSize = 8.6
const lenHeight = height - thickness - cameraHeight
const lenOuterDiameter = lenInnerDiameter + 2*Math.cos(Math.PI/6)*lenHeight

const lenTransform = (shape) => translateY((length - cameraSize) / 2, shape)
const lenPositive = lenTransform(hull(
  cylinder({ radius: lenOuterDiameter/2 + lenThickness, height: 0.001, center: [0, 0, 0.001/2] }),
  cylinder({ radius: lenInnerDiameter/2 + lenThickness, height: lenHeight, center: [0, 0, lenHeight/2] })))
const lenNegative = lenTransform(hull(
  cylinder({ radius: lenOuterDiameter/2, height: 0.001 }),
  cylinder({ radius: lenInnerDiameter/2, height: lenHeight, center: [0, 0, lenHeight/2] })))

const cameraNegative = union(
  cuboid({ size: [center, length, height], center: [0, 0, thickness + height/2] }),
  translateZ(height + thickness - 0.4, mirrorZ(lenPositive)))

const sideThreadsNegative = xx(
  translate([width/2, 0, height/2],
    rotateZ(Math.PI/2,
      threadInsertPrintNegative(
        { screwDiameter: 2, insertLength: 3, outerDiameter: 3.2, screwLength: 3.8 } ))))

const structureX = 7.5
const structureY = length/2 - 2
const structureNegative = fourWayMirror(
  translate([structureX, structureY, 0],
    threadInsertNegative({ screwDiameter: 2, insertLength: height - 2, outerDiameter: 3.2 })))

const base = subtract(
  union(box),
  union(cameraNegative, sideThreadsNegative, structureNegative))

const platePositive = cuboid({ size: [width - 0.4, length - 0.4, thickness], center: [0, 0, thickness/2] })
const plateNegative = fourWayMirror(
  translate([structureX, structureY], cylinder({ radius: 2.2/2, height: 99 })))

const cover = subtract(
  union(platePositive, lenPositive),
  union(plateNegative, lenNegative))

const piCamera = union(base, translateX(24, cover))

const main = () => {
  return piCamera
}

module.exports = { main, base, cover, piCamera }

