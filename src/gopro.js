const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateY, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { printCylinder, printCylinderCut } = require('./print-cylinder')
const { xx } = require('./symmetries')

const finRadius = 15 / 2

const fin = (x, width, radius) =>
  rotateZ(Math.PI/2, translate([0, x, finRadius], printCylinder(radius, width)))
const finCut = (x, width, radius) =>
  rotateZ(Math.PI/2, translate([0, x, finRadius], printCylinderCut(radius, width)))
  
const cameraWidth = 3.4
const cameraRadius = finRadius + 0.6
const goproWidth = 4 + 3 + 3 + 3 + 4
const goproPositive = hull(
  fin(-goproWidth/2, goproWidth, finRadius),
  fin(3/2 + 3, 7, 5))
const goproNegative = union(
  xx(fin(-3 - cameraWidth/2, cameraWidth, cameraRadius)),
  finCut(-20, 40, 5.2 / 2),
  finCut(3/2 + 3, 7, 4),
  finCut(3/2 + 3 + 7, 20, 5),
  finCut(-20, 20 - goproWidth/2, 6))
const goproConnect = cuboid({ size: [goproWidth, 6, finRadius], center: [0, 0, finRadius / 2 ] })
const cameraFin = rotateY(Math.PI/2, cylinder({ radius: cameraRadius, height: cameraWidth, center: [0, 0, 3 / 2] }))
const cameraNegative = (a, b) => xx(
  translateX(3/2,
    hull(
      translateZ(finRadius, cameraFin),
      translate([0, Math.sin(a)*20, finRadius + Math.cos(a)*20], cameraFin),
      translate([0, Math.sin(b)*20, finRadius + Math.cos(b)*20], cameraFin))))

const screwThickness = 2

const screwConnect = cylinder({ radius: 4, height: screwThickness, center: [0, 0, screwThickness/2] })
const screwNegative = union(
  cylinder({ radius: 3.2 / 2, height: 8 }),
  cylinder({ radius: 7.2 / 2, height: 20, center: [0, 0, screwThickness + 10] }))

const a = 40
screwTs = [[a/2, 0], [-a/2, 0]]
const goproT = [0, 0, 2]
const connect = cuboid({ size: [14, 12, 7], center: [0, 0, 3.5] })

const gopro = subtract(
  union(
    translate(goproT, goproPositive),
    hull(
      connect,
      union(screwTs.map((t) => { return translate(t, screwConnect) })))),
  union(
    translate(goproT, goproNegative),
    translate(goproT, cameraNegative(-Math.PI/4, Math.PI/4)),
    union(screwTs.map((t) => { return translate(t, screwNegative) }))))
   
const main = () => {
  return gopro
}

module.exports = { gopro, cameraNegative, goproPositive, goproConnect, goproNegative, goproPositive, main } 

