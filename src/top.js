const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { hullRing } = require('./hulls')
const { app, corner, plate } = require('./plate')
const { xx, yy, fourWayMirror } = require('./symmetries')

const frameThickness = 2.4
const screwPositive = cylinder({ radius: 4, height: frameThickness, center: [0, 0, frameThickness/2] })
const screwConnect = screwPositive
const screwNegative = cylinder({ radius: 3.2 / 2, height: 20 })

const screwsPositive = 
  union([app, corner].map((t) => fourWayMirror(translate(t, screwPositive))))
const screwsNegative = 
  union([app, corner].map((t) => fourWayMirror(translate(t, screwNegative))))

const bottom = plate({ frameHeight: frameThickness })

const stripLength = 22
const stripWall = 2.4

const stripY = stripLength/2 + stripWall;

const stripPositive = xx(union(
  cuboid({
    size: [5, 2*stripY, stripWall],
    center: [corner[0] + 4 + 5/2, 0, stripWall/2] }),
  yy(cylinder({ radius: 5/2, height: stripWall, center: [corner[0] + 4 + 5/2, stripY, stripWall/2] })),
  subtract(
    cuboid({
      size: [5/2, stripLength + 2*stripWall + 2*5, stripWall],
      center: [corner[0] + 4 + 5/4, 0, stripWall/2] }),
    yy(cylinder({ radius: 5/2, height: stripWall, center: [corner[0] + 4 + 5/2, stripY + 5, stripWall/2] })))))

const stripNegative = xx(cuboid({
  size: [5, stripLength, stripWall],
  center: [corner[0] + 4 - 2.4 + 5/2, 0, stripWall/2] }))

const top =
  subtract(
    union(bottom, screwsPositive, stripPositive),
    union(screwsNegative, stripNegative))

const main = () => {
  return top
}

module.exports = { main, screwConnect, top }

