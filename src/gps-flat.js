const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateY, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { hullRing } = require('./hulls')
const { fourWayMirror, fourWayRotate, xx, yy } = require('./symmetries')

const framePositive = cylinder({ radius: 3.5, height: 4, center: [0, 0, 2] })
const frameNegative = cylinder({ radius: 3.2 / 2, height: 4, center: [0, 0, 2] })

const boardPositive = union(
  hull(
    cylinder({ radius: 4, height: 4, center: [0, 0, 2] }),
    cylinder({ radius: 3, height: 6, center: [0, 0, 3] })),
  cylinder({ radius: 3, height: 8, center: [0, 0, 4] }))

const boardNegative = union(
  cylinder({ radius: 5 / 2, height: 4, center: [0, 0, 2] }),
  cylinder({ radius: 3.2 / 2, height: 8, center: [0, 0, 4] }))

const connect = cylinder({ radius: 2, height: 4, center: [0, 0, 2] });

const bx = 21 / 2
const by = 31 / 2

const frameTs = [[20, 15], [-20, 15], [-20, -15], [20, -15]]
const boardTs = [[bx, by], [-bx, by], [-bx, -by], [bx, -by]]

const is = [0, 1, 2, 3]

const gpsFlat = subtract(
  union(
    is.map((i) => union(
      translate(frameTs[i], framePositive),
      translate(boardTs[i], boardPositive),
      hull(translate(frameTs[i], connect), translate(boardTs[i], connect)))),
    xx(yy(hullChain(translate(boardTs[0], connect), translate([0, by - bx, 0], connect), connect)))),
 union(
   is.map((i) => union(
     translate(frameTs[i], frameNegative),
     translate(boardTs[i], boardNegative)))))

const main = () => {
  return gpsFlat
}

module.exports = { gpsFlat, main }

