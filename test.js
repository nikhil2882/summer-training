const calculateArea = require("area-of-square");
const calculateAreaRectangle = require("./utils/area/rectangle");

const area1 = calculateArea(5);
const area2 = calculateArea(9);
const area3 = calculateAreaRectangle(5, 9);
console.log(area1, area2, area3);
