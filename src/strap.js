const { subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorZ, rotate, rotateZ, translate, translateY, translateZ } = require('@jscad/modeling').transforms

const { xx } = require('./symmetries')

strap = xx(
  union(
    subtract(
      cylinder({ radius: 5, height: 3, center: [0, 0, 0] }),
      cylinder({ radius: 4, height: 3, center: [0, 0, 0] }),
      cuboid({ size: [10, 10, 3], center: [0, 5, 0] })),
    cuboid({ size: [1, 1 + 2 + 2 + 1, 3], center: [(1 + 8)/2, 3, 0] }),
    cuboid({ size: [3, 1, 3], center: [8/2 - 1/2, 1 + 2 + 2 + 0.5, 0] }),
    subtract(
      cuboid({ size: [0.8, 2, 3], center: [2.5 - 0.1, 5, 0] }),
      translate([2, 4, 0], rotateZ(Math.PI/4, cuboid({ size: [0.8, 0.8, 3] }))))));

brim = cuboid({ size: [10, 2, 0.1], center: [0, 6 + 2/2, 0.1/2 - 3/2] });

const main = () => {
  return union(strap, brim);
}

module.exports = { main, strap }

