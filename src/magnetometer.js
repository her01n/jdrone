const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { hull, hullChain } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { mirrorX, mirrorY, mirrorZ, rotate, rotateZ, translate, translateX, translateY, translateZ } = require('@jscad/modeling').transforms

const { yy } = require('./symmetries')
const { threadInsertNegative, threadInsertPositive } = require('./thread-insert')

const frameScrewsPositive = yy(cylinder({ radius: 3, height: 4, center: [0, 20, 2] }));
const frameScrewsNegative = yy(cylinder({ radius: 3.2 / 2, height: 4, center: [0, 20, 2] }));

const magnetScrewsParams = { height: 4, outerDiameter: 3.6, screwDiameter: 2.5 };
const magnetScrewsPositive = yy(translateY(10, threadInsertPositive(magnetScrewsParams)));
const magnetScrewsNegative = yy(translateY(10, threadInsertNegative(magnetScrewsParams)));

const connect = cuboid({ center: [0, 0, 2], size: [4, 40, 4] });

const magnet = subtract(
  union(frameScrewsPositive, magnetScrewsPositive, connect),
  union(frameScrewsNegative, magnetScrewsNegative));

const main = () => { return magnet; };

module.exports = { main, magnet }

