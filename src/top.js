const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { hullRing } = require('./hulls')
const { app, corner, plate } = require('./plate')
const { xx, yy, fourWayMirror } = require('./symmetries')
const { threadInsertPositive, threadInsertNegative } = require('./thread-insert')

const frameThickness = 2.4
const screwPositive = cylinder({ radius: 4, height: frameThickness, center: [0, 0, frameThickness/2] })
const screwConnect = screwPositive
const screwNegative = cylinder({ radius: 3.2 / 2, height: 20 })

const screwsPositive = 
  union([app, corner].map((t) => fourWayMirror(translate(t, screwPositive))))
const screwsNegative = 
  union([app, corner].map((t) => fourWayMirror(translate(t, screwNegative))))

const threadInsertTs = [[corner[1], 20], [corner[1], 10]]
const threadInsertsPositive = fourWayMirror(
  threadInsertTs.map((t) => translate(t, threadInsertPositive({ constrainHeight: 4 }))))
const threadInsertsNegative = fourWayMirror(
  threadInsertTs.map((t) => translate(t, threadInsertNegative())))

const top =
  subtract(
    union(plate(), screwsPositive, threadInsertsPositive),
    union(screwsNegative, threadInsertsNegative))

const main = () => {
  return top
}

module.exports = { main, screwConnect, top }

