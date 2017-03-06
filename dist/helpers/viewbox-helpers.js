"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isElementBelowViewBox = exports.isElementBelowViewBox = function isElementBelowViewBox(viewBoxHeight, top) {
  return viewBoxHeight - top < 0;
};
var isElementAboveViewBox = exports.isElementAboveViewBox = function isElementAboveViewBox(bottom) {
  return bottom < 0;
};
var shouldPositionLeft = exports.shouldPositionLeft = function shouldPositionLeft(viewBoxWidth, left) {
  return viewBoxWidth - left < viewBoxWidth / 2;
};
var shouldPositionAbove = exports.shouldPositionAbove = function shouldPositionAbove(viewBoxHeight, bottom) {
  return viewBoxHeight - bottom < 100;
};
var shouldPositionBelow = exports.shouldPositionBelow = function shouldPositionBelow(top) {
  return top < 50;
};