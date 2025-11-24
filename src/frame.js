const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { eyeletCornerPositive, eyeletCornerNegative } = require('./eyelet')
const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { fourWayMirror, fourWayRotate, xx, yy } = require('./symmetries')
const { threadInsertNegative, threadInsertPositive, threadInsertPrintNegative } = require('./thread-insert')

const frameThreadPositive = cylinder({ radius: (5 - 0.3) / 2 + 1.2, height: 4, center: [0, 0, 2] })
const frameThreadNegative = cylinder({ radius: (5 - 0.3) / 2, height: 4, center: [0, 0, 2] })

const width = 60
const length = 80
const plate = 1.8

const frame = ({ thickness = 4 } = {}) =>
  subtract(
    xx(yy(
      union(
        cuboid({ size: [8, length/2, thickness], center: [width/2, length/4, thickness/2] }),
        cuboid({ size: [width/2, 8, thickness], center: [width/4, length/2, thickness/2] }),
        cylinder({ radius: 4, height: thickness, center: [width/2, length/2, thickness/2] }),
        cuboid({ size: [width, length, plate], center: [0, 0, plate/2] })))),
  union(
    arrowCut(20, 99),
    yy(cuboid({ size: [12, 18, 99], center: [0, (length - 8 - 18)/2, 0] })),
    xx(cuboid({ size: [4, 22, 99], center: [25, 0, 0] })),
    xx(cuboid({ size: [4, 22, 99], center: [15, 0, 0] }))))

module.exports = { frame, frameThreadPositive, frameThreadNegative, length, width }

