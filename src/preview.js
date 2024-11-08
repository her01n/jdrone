const { subtract, union } = require('@jscad/modeling').booleans
const { mirrorX, mirrorY, mirrorZ, rotate, rotateX, rotateY, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

// TODO
// - rotate the top so the rx is visible?
// - rotate rx

arm = require('./arm')
core = require('./core')
longLeg = require('./long-leg')
longLegD = require('./long-leg-d')
rx = require('./rx')
top = require('./top')

const d = 8

const armRadius = core.armRadius

const legT = Math.tan(longLeg.angle)*longLeg.height +
  (8 - 10*Math.sqrt(2)/2)*Math.sin(longLeg.angle)
const leg = translate([0, legT, -longLeg.height - d],
  rotateX(Math.PI/2 + longLeg.angle, longLegD.longLegD))
  
const topAngle = Math.PI/6;
const topZ = core.height + d + core.width/2*Math.sin(topAngle)

preview = union(
  core.core,
  translate([armRadius, armRadius], rotateZ(-Math.PI/4, translateX(d, arm.arm))),
  translate([-armRadius, armRadius], rotateZ(Math.PI/4, translateX(-d, arm.arm))),
  translate([armRadius, -armRadius], rotateZ(-3*Math.PI/4, translateX(-d, arm.arm))),
  translate([-armRadius, -armRadius], rotateZ(3*Math.PI/4, translateX(d, arm.arm))),
  translate([core.width/2, core.length/2], rotateZ(-Math.PI/4, leg)),
  translate([-core.width/2, core.length/2], rotateZ(Math.PI/4, leg)),
  translate([core.width/2, -core.length/2], rotateZ(-3*Math.PI/4, leg)),
  translate([-core.width/2, -core.length/2], rotateZ(3*Math.PI/4, leg)),
  translate([0, 30, 4.1 + d], rotateZ(Math.PI, rx.rx)),
  translate([0, 0, topZ], rotateY(-topAngle, top.top)))

const main = () => {
  return preview
}

module.exports = { preview, main }
 
