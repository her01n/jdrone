const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { hullRing } = require('./hulls')
const { plate } = require('./plate')
const { xx, yy } = require('./symmetries')

const length = 80
const width = 40

const frameThickness = 2.4
const screwConnect = cylinder({ radius: 4, height: frameThickness, center: [0, 0, frameThickness/2] })
const screwNegative = cylinder({ radius: 3.2 / 2, height: 20 })

const screwsTs = [[width/2, length/2], [-width/2, length/2], [-width/2, -length/2], [width/2, -length/2]]
const screwsPositive = 
  hullRing(screwsTs.map((t) => { return translate(t, screwConnect) }))
const screwsNegative = 
  union(screwsTs.map((t) => { return translate(t, screwNegative) }))

const bottom = plate(length, width)

const stripLength = 22
const stripWall = 2.4

const stripY = stripLength/2 + stripWall;

const stripPositive = xx(union(
  cuboid({
    size: [5, 2*stripY, stripWall],
    center: [width/2 + 4 + 5/2, 0, stripWall/2] }),
  yy(cylinder({ radius: 5/2, height: stripWall, center: [width/2 + 4 + 5/2, stripY, stripWall/2] })),
  subtract(
    cuboid({
      size: [5/2, stripLength + 2*stripWall + 2*5, stripWall],
      center: [width/2 + 4 + 5/4, 0, stripWall/2] }),
    yy(cylinder({ radius: 5/2, height: stripWall, center: [width/2 + 4 + 5/2, stripY + 5, stripWall/2] })))))

const stripNegative = xx(cuboid({
  size: [5, stripLength, stripWall],
  center: [width/2 + 4 - 2.4 + 5/2, 0, stripWall/2] }))

const top =
  subtract(
    union(bottom, screwsPositive, stripPositive),
    union(screwsNegative, stripNegative))

const main = () => {
  return top
}

module.exports = { main, top }

