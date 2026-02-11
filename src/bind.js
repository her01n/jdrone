const { subtract, union } = require('@jscad/modeling').booleans
const { hull } = require('@jscad/modeling').hulls
const { cuboid, cylinder } = require('@jscad/modeling').primitives

const { xx } = require("./symmetries.js")

const screwDiameter = 3.2
const screwWidth = 6
const height = 4
const clear = 2
const width = 8

const bind = (size) => {
  return subtract(
    hull(
      xx(
        cylinder({
          radius: width/2,
          height: height,
          center: [size/2, 0, height/2] }))),
    union(
      xx(
        cylinder({
          radius: screwDiameter/2,
          height: height,
          center: [size/2, 0, height/2] })),
      cuboid({
        size: [size - screwWidth, width, clear],
        center: [0, 0, height - clear/2] })));
}

module.exports = { bind }

