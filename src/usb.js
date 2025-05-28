const { subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorY, mirrorZ, rotate, rotateZ, translate, translateY, translateZ } = require('@jscad/modeling').transforms

const { hullRing } = require('./hulls')
const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { fourWayRotate, xx } = require('./symmetries')
const { threadInsertPrintNegative } = require('./thread-insert')

const screwPositive = cylinder({ radius: 3, height: 4, center: [0, 0, 2] })
const screwNegative = union(
  cylinder({ radius: 3.2/2, height: 9 }),
  cylinder({ radius: 7/2, height: 20, center: [0, 0, 4 + 10] }))
const screwTs = [[10, 0], [-10, 0]]

const slack = 0.4
const usbWidth = 18.4 + slack
const usbLength = 11.5 + slack
const gap = 1

const insertLength = usbLength - 4 - gap
const insertPositive = printCylinderCut(4, insertLength)
const insertNegative = translateY(insertLength, mirrorY(threadInsertPrintNegative({ screwLength: insertLength })))
const insertTs = [[usbWidth/2 + 4, 4, 4], [-usbWidth/2 - 4, 4, 4]]

const usbNegative = cuboid({ size: [usbWidth, 20, 20], center: [0, 4 + 10, 10] })

const usbBase = subtract(
  hull(screwTs.map((t) => translate(t, screwPositive)), insertTs.map((t) => translate(t, insertPositive))),
  union(
    screwTs.map((t) => translate(t, screwNegative)),
    insertTs.map((t) => translate(t, insertNegative)),
    usbNegative))

const thickness = 2
const coverHeight = 4 + thickness

const usbCover = translateY(18,
  subtract(
    hull(xx(cylinder({ radius: 4, height: coverHeight, center: [usbWidth/2 + 4, 0, coverHeight/2] }))),
    union(
      xx(cylinder({ radius: 3.2/2, height: 99, center: [usbWidth/2 + 4, 0, 0] })),
      cuboid({ size: [usbWidth, 99, usbLength], center: [0, 0, thickness + usbLength/2] }))))

const main = () => {
  return union(usbBase, usbCover)
}

module.exports = { usbBase, main }

