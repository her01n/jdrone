const { intersect, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder, sphere } = require('@jscad/modeling').primitives
const { translate, translateX } = require('@jscad/modeling').transforms

const draw = (size, shape) => {
  const R = size/2;
  const r = size/10;
  const a = size/4;
  const b = size/3;
  return union(
    hull(
      translate([0, R - r], shape),
      translate([a, R - b], shape)),
    hull(
      translate([0, R - r], shape),
      translate([-a, R - b], shape)),
    hull(
      translate([0, -R + r], shape),
      translate([0, R - r], shape)))
}

const arrow = (size) => {
  const r = size/10;
  return intersect(
    draw(size, sphere({radius: r})),
    cuboid({size: [size, size, r/2], center: [0, 0, r/4]}))
}

const arrowCut = (size, height) => {
  const r = size/10;
  return draw(size, cylinder({radius: r, height: height, center: [0, 0, height/2]}))
}  

const main = () => {
  return union(arrow(20), translateX(20, arrow_cut(20, 1)))
}

module.exports = { main, arrow, arrowCut }

