"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TourButton = function TourButton(props) {
	return _react2.default.createElement(
		"div",
		_extends({ style: props.style, onClick: props.onClick }, props),
		props.children
	);
};

TourButton.defaultProps = {
	style: {
		"width": 50,
		"height": 30,
		"backgroundColor": "#cbd1d4",
		"color": "#494949",
		"fontWeight": 700,
		"display": "inline-block",
		"textAlign": "center",
		"paddingTop": "5px",
		"cursor": "pointer",
		"float": "right",
		"marginRight": 10
	},
	onClick: function onClick() {}
};

exports.default = TourButton;