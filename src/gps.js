const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateY, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { fourWayMirror, fourWayRotate, xx, yy } = require('./symmetries')

const frameScrewsPositive = union(
  hull(yy(cylinder({ center: [0, 10, 2], radius: 4, height: 4 }))),
  cuboid({ center: [-4, 0, 2], size: [8, 20, 4] }));
const frameScrewsNegative = 
  yy(cylinder({ center: [0, 10, 2], radius: 3.2 / 2, height: 4 }));

const boardZ = 30
const boardX = 4
const thickness = 3;

const stem = hullChain(
  cuboid({ center: [-4 + thickness/2, 0, 2], size: [thickness, 12, 4] }),
  cuboid({ center: [boardX + thickness/2, 0, boardZ - thickness/2], size: [thickness, 12, thickness] }));

const screwsA = 31
const screwsB = 21

const boardScrewsPositive = union(
  yy(cylinder({ center: [boardX + 4, screwsA / 2, boardZ - 2], radius: 4.5, height: 4 })),
  yy(cylinder({ center: [boardX + 4 + screwsB, screwsA / 2, boardZ - 2], radius: 4.5, height: 4})));

const boardScrewsNegative = union(
  yy(cylinder({ center: [boardX + 4, screwsA / 2, boardZ - 2], radius: 5 / 2, height: 4 })),
  yy(cylinder({ center: [boardX + 4 + screwsB, screwsA / 2, boardZ - 2], radius: 5 / 2, height: 4 })));

const knot = cylinder({ center: [0, 0, boardZ - 2], radius: 2, height: 4 });

const board = union(
  cuboid({ center: [boardX, 0, boardZ - 2], size: [12, 30, 4] }),
  yy(hullChain(
    translate([boardX + 4, 15, 0], knot),
    translate([boardX + 4 + 10, 10, 0], knot),
    translate([boardX + 4 + 20, 15, 0], knot))),
  hull(yy(translate([boardX + 4 + 10, 10, 0], knot))));
  

const gpsStem = intersect(
  rotateY(-Math.PI/2 - Math.sin((boardX + 4) / (boardZ - 4)),
    subtract(
      union(frameScrewsPositive, stem, board, boardScrewsPositive),
      union(frameScrewsNegative, boardScrewsNegative))),
  cuboid({ center: [0, 0, 50 - 4], size: [99, 99, 100] }));

const main = () => {
  return gpsStem
}

module.exports = { gpsStem, main }

