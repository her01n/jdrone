const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { arrowCut } = require('./arrow')
const { hullRing } = require('./hulls')
const { plate } = require('./plate')

const length = 80
const width = 60

const screwThickness = 2.4
const screwPositive = cylinder({ radius: 4, height: screwThickness, center: [0, 0, screwThickness/2] })
const screwConnect = cylinder({ radius: 3, height: screwThickness, center: [0, 0, screwThickness/2] })
const screwNegative = cylinder({ radius: 3.2 / 2, height: 20 })

const screwsTs = [[width/2, length/2], [-width/2, length/2], [-width/2, -length/2], [width/2, -length/2]]
const screwsPositive = 
  union(
    screwsTs.map((t) => { return translate(t, screwPositive) }),
    hullRing(screwsTs.map((t) => { return translate(t, screwConnect) })))
const screwsNegative = 
  union(screwsTs.map((t) => { return translate(t, screwNegative) }))

const bottom = plate(length, width)

const top =
  subtract(
    union(bottom, screwsPositive),
    union(screwsNegative))

const main = () => {
  return top
}

module.exports = { main, top }

