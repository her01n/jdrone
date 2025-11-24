const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { hullRing } = require('./hulls')
const { xx, yy, fourWayMirror } = require('./symmetries')
const { frame, frameThreadPositive, frameThreadNegative, length, width } = require('./frame')
const { threadInsertPositive, threadInsertNegative } = require('./thread-insert')

const topThickness = 2.4

const framePositive = frame({ thickness: topThickness })

const frameThreadTs = [[width/2, 10], [width/2, 20]]
const frameThreadsPositive = xx(yy(frameThreadTs.map((t) => translate(t, frameThreadPositive))))
const frameThreadsNegative = xx(yy(frameThreadTs.map((t) => translate(t, frameThreadNegative))))

const screwsNegative = xx(yy(translate([width/2, length/2], cylinder({ radius: 3.4/2, height: 99 }))))

const topPositive = union(framePositive, frameThreadsPositive)
const topNegative = union(frameThreadsNegative, screwsNegative)

const top = subtract(topPositive, topNegative)

const main = () => {
  return top
}

module.exports = { main, top, topPositive, topNegative, topThickness }

