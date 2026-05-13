const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateY, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { doubleBellyPositive, doubleBellyNegative, doubleBellyConnect } = require('./belly')
const { goproPositive, goproNegative, goproConnect, cameraNegative } = require('./gopro')
const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { xx, yy } = require('./symmetries')

const goproY = 14 + 12

const bellyGopro = subtract(
  union(
    doubleBellyPositive(),
    translateY(goproY, goproPositive),
    hull(
      doubleBellyConnect(),
      translateY(goproY, goproConnect))),
  union(
    doubleBellyNegative(),
    translateY(goproY, goproNegative),
    translateY(goproY, cameraNegative(0, Math.PI/2))))
   
const main = () => {
  return bellyGopro
}

module.exports = { bellyGopro, main } 

