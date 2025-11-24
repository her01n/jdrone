const { subtract, union } = require('@jscad/modeling').booleans
const { mirrorX, mirrorY, mirrorZ, rotate, rotateX, rotateY, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { fourWayMirror } = require('./symmetries')

arm = require('./arm')
core = require('./core')
const { length, width } = require('./frame')
longLeg = require('./long-leg')
longLegD = require('./long-leg-d')
rx = require('./rx')
top = require('./top')

const d = 8

const legT = Math.tan(longLeg.angle)*longLeg.height +
  (8 - 10*Math.sqrt(2)/2)*Math.sin(longLeg.angle)
const leg = translate([0, legT, -longLeg.height - d],
  rotateX(Math.PI/2 + longLeg.angle, longLegD.longLegD))
  
const topAngle = Math.PI/6;
const topZ = core.height + d + width/2*Math.sin(topAngle)

preview = union(
  core.core,
  fourWayMirror(
    translate(core.armT, rotateZ(core.armAlpha - Math.PI/2, translateX(d, arm.arm)))),
  translate([width/2, length/2], rotateZ(-Math.PI/4, leg)),
  translate([-width/2, length/2], rotateZ(Math.PI/4, leg)),
  translate([width/2, -length/2], rotateZ(-3*Math.PI/4, leg)),
  translate([-width/2, -length/2], rotateZ(3*Math.PI/4, leg)),
  translate([0, length/2, 4 + d], rx.rx),
  translate([0, 0, topZ], rotateY(-topAngle, top.top)))

const main = () => {
  return preview
}

module.exports = { preview, main }
 
