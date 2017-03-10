"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactMotion = require("react-motion");

var _tourButton = require("./tour-button");

var _tourButton2 = _interopRequireDefault(_tourButton);

var _tourButtonContainer = require("./tour-button-container");

var _tourButtonContainer2 = _interopRequireDefault(_tourButtonContainer);

var _arrow = require("./arrow");

var _arrow2 = _interopRequireDefault(_arrow);

var _positionHelpers = require("./helpers/position-helpers");

var _positionHelpers2 = _interopRequireDefault(_positionHelpers);

var _viewboxHelpers = require("./helpers/viewbox-helpers");

var viewBoxHelpers = _interopRequireWildcard(_viewboxHelpers);

var _scrollToPosition = require("./helpers/scroll-to-position");

var _scrollToPosition2 = _interopRequireDefault(_scrollToPosition);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactUserTour = function (_Component) {
	_inherits(ReactUserTour, _Component);

	function ReactUserTour(props) {
		_classCallCheck(this, ReactUserTour);

		var _this = _possibleConstructorReturn(this, (ReactUserTour.__proto__ || Object.getPrototypeOf(ReactUserTour)).call(this, props));

		_this.prevPos = {
			top: 0,
			left: 0
		};
		_this.getStepPosition = _this.getStepPosition.bind(_this);

		_this.styles = _extends({
			height: 150,
			width: 350,
			position: "absolute",
			zIndex: 9999,
			backgroundColor: "#fff",
			color: "#494949",
			boxShadow: "0 6px 8px 0 rgba(0, 0, 0, 0.24)"
		}, _this.props.style);

		_this.state = {
			position: {
				top: 0,
				left: 0
			},
			currentTourStep: {}
		};
		return _this;
	}

	_createClass(ReactUserTour, [{
		key: "componentWillMount",
		value: function componentWillMount() {
			var _this2 = this;

			var currentTourStep = this.props.steps.filter(function (step) {
				return step.step === _this2.props.step;
			})[0];

			var tourHeight = this.props.style.height || this.styles.height;
			var tourWidth = this.props.style.width || this.styles.width;

			this.setState({
				currentTourStep: currentTourStep
			}, function () {
				_this2.setCurrentPosition(tourWidth, tourHeight);
			});
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var currentTourStep = nextProps.steps.filter(function (step) {
				return step.step === nextProps.step;
			})[0];
			this.setState({
				currentTourStep: currentTourStep
			});
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate(prevProps, prevState) {
			var tourBox = document.querySelector(".tour-box");

			var tourHeight = this.styles.height;
			var tourWidth = this.styles.width;

			console.debug(tourWidth, tourHeight, "before");
			if (tourBox) {
				tourHeight = this.styles.height === "auto" ? document.querySelector(".tour-box").getBoundingClientRect().height : this.styles.height;
				tourWidth = this.styles.width === "auto" ? document.querySelector(".tour-box").getBoundingClientRect().width : this.styles.width;
			}
			console.debug(tourWidth, tourHeight, "after");
			this.setCurrentPosition(tourWidth, tourHeight);
		}
	}, {
		key: "shouldComponentUpdate",
		value: function shouldComponentUpdate(nextProps) {
			if (!this.props.active && !nextProps.active) {
				return false;
			}
			return this.props.step !== nextProps.step || this.props.active !== nextProps.active;
		}
	}, {
		key: "setCurrentPosition",
		value: function setCurrentPosition(w, h) {
			var _this3 = this;

			var _state = this.state,
			    currentTourStep = _state.currentTourStep,
			    position = _state.position;


			var newPosition = this.getStepPosition(currentTourStep.selector, w, h, currentTourStep.position, currentTourStep.margin, currentTourStep.horizontalOffset, currentTourStep.verticalOffset);

			if (position.top !== newPosition.top || position.left !== newPosition.left) {
				// console.debug("setting new position:", newPosition)
				this.setState({
					position: newPosition
				}, function () {
					_this3.forceUpdate();
				});
			}
		}
	}, {
		key: "getStepPosition",
		value: function getStepPosition(selector, tourElWidth, tourElHeight, overridePos) {
			var margin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 25;
			var horizontalOffset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
			var verticalOffset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

			var windowHeight = window.innerHeight;
			var windowWidth = window.innerWidth;
			var el = document.querySelector(selector);
			if (el) {
				var _position = el ? el.getBoundingClientRect() : {};
				var isElementBelowViewBox = viewBoxHelpers.isElementBelowViewBox(windowHeight, _position.top);
				var isElementAboveViewBox = viewBoxHelpers.isElementBelowViewBox(_position.bottom);
				if (isElementBelowViewBox) {
					_position = (0, _scrollToPosition2.default)(el, _position.bottom);
				} else if (isElementAboveViewBox) {
					_position = (0, _scrollToPosition2.default)(el, window.pageYOffset + _position.top);
				}
				var shouldPositionLeft = viewBoxHelpers.shouldPositionLeft(windowWidth, _position.left);
				var shouldPositionAbove = viewBoxHelpers.shouldPositionAbove(windowHeight, _position.bottom);
				var shouldPositionBelow = viewBoxHelpers.shouldPositionBelow(_position.top);
				var elPos = void 0;
				if (overridePos && _positionHelpers2.default[overridePos]) {
					elPos = _positionHelpers2.default[overridePos]({
						position: _position,
						tourElWidth: tourElWidth,
						tourElHeight: tourElHeight,
						arrowSize: this.props.arrowSize,
						offsetHeight: el.offsetHeight,
						margin: margin
					});
				} else if (shouldPositionLeft && !shouldPositionAbove && !shouldPositionBelow) {
					elPos = _positionHelpers2.default.left({
						position: _position,
						tourElWidth: tourElWidth,
						margin: margin
					});
				} else if (shouldPositionAbove) {
					elPos = shouldPositionLeft ? _positionHelpers2.default.topLeft({
						position: _position,
						tourElWidth: tourElWidth,
						tourElHeight: tourElHeight,
						arrowSize: this.props.arrowSize,
						margin: margin
					}) : _positionHelpers2.default.top({
						position: _position,
						tourElHeight: tourElHeight,
						arrowSize: this.props.arrowSize,
						margin: margin
					});
				} else if (shouldPositionBelow) {
					elPos = shouldPositionLeft ? _positionHelpers2.default.bottomLeft({
						position: _position,
						tourElWidth: tourElWidth,
						arrowSize: this.props.arrowSize,
						offsetHeight: el.offsetHeight,
						margin: margin
					}) : _positionHelpers2.default.bottom({
						position: _position,
						arrowSize: this.props.arrowSize,
						offsetHeight: el.offsetHeight,
						margin: margin
					});
				} else {
					elPos = _positionHelpers2.default.right({
						position: _position,
						margin: margin
					});
				}

				elPos.left += horizontalOffset;
				elPos.top += verticalOffset;

				this.prevPos = elPos;
				return elPos;
			} else {
				return this.prevPos;
			}
		}
	}, {
		key: "getCustomArrow",
		value: function getCustomArrow(position) {
			return typeof this.props.arrow === "function" ? this.props.arrow({
				position: position.positioned,
				width: this.styles.width,
				height: this.styles.height,
				size: this.props.arrowSize,
				color: this.props.arrowColor
			}) : this.props.arrow;
		}
	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			if (!this.props.active || !this.state.currentTourStep) {
				return null;
			}

			var tourBox = document.querySelector(".tour-box");

			var tourHeight = this.styles.height;
			var tourWidth = this.styles.width;

			if (tourBox) {
				tourHeight = this.styles.height === "auto" ? document.querySelector(".tour-box").getBoundingClientRect().height : this.styles.height;
				tourWidth = this.styles.width === "auto" ? document.querySelector(".tour-box").getBoundingClientRect().width : this.styles.width;
			}

			var arrow = this.props.arrow ? this.getCustomArrow(position) : _react2.default.createElement(_arrow2.default, {
				position: this.state.position.positioned,
				width: tourWidth,
				height: tourHeight,
				size: this.props.arrowSize,
				color: this.props.arrowColor
			});

			var extraButtonProps = this.props.buttonStyle ? { style: this.props.buttonStyle } : {};

			var nextButton = this.props.step !== this.props.steps.length ? _react2.default.createElement(
				_tourButton2.default,
				_extends({
					onClick: function onClick() {
						return _this4.props.onNext(_this4.props.step + 1);
					},
					onTouchTap: function onTouchTap() {
						return _this4.props.onNext(_this4.props.step + 1);
					}
				}, extraButtonProps, {
					className: "react-user-tour-next-button" }),
				this.props.nextButtonText
			) : "";

			var backButton = this.props.step !== 1 ? _react2.default.createElement(
				_tourButton2.default,
				_extends({
					onClick: function onClick() {
						return _this4.props.onBack(_this4.props.step - 1);
					},
					onTouchTap: function onTouchTap() {
						return _this4.props.onBack(_this4.props.step - 1);
					}
				}, extraButtonProps, {
					className: "react-user-tour-back-button" }),
				this.props.backButtonText
			) : "";

			var doneButton = this.props.step === this.props.steps.length ? _react2.default.createElement(
				_tourButton2.default,
				_extends({
					onClick: this.props.onCancel,
					onTouchTap: this.props.onCancel
				}, extraButtonProps, {
					className: "react-user-tour-done-button" }),
				this.props.doneButtonText
			) : "";

			var tourButtonContainer = !this.props.hideButtons ? _react2.default.createElement(
				_tourButtonContainer2.default,
				{ style: this.props.buttonContainerStyle },
				nextButton,
				doneButton,
				backButton
			) : "";

			var xStyle = {
				"float": "right",
				"cursor": "pointer",
				"paddingRight": 10,
				"paddingTop": 10
			};

			var closeButton = !this.props.hideClose ? _react2.default.createElement(
				"span",
				{ className: "react-user-tour-close",
					style: xStyle,
					onClick: this.props.onCancel,
					onTouchTap: this.props.onCancel },
				this.props.closeButtonText
			) : "";

			return _react2.default.createElement(
				"div",
				{ className: "react-user-tour-container", style: this.props.containerStyle },
				_react2.default.createElement(
					_reactMotion.Motion,
					{ style: { x: (0, _reactMotion.spring)(this.state.position.left), y: (0, _reactMotion.spring)(this.state.position.top) } },
					function (_ref) {
						var x = _ref.x,
						    y = _ref.y;
						return _react2.default.createElement(
							"div",
							{
								className: "tour-box",
								style: _extends({}, _this4.styles, _this4.props.style, {
									transform: "translate3d(" + x + "px, " + y + "px, 0)"
								})
							},
							arrow,
							closeButton,
							_this4.state.currentTourStep.title,
							_this4.state.currentTourStep.body,
							tourButtonContainer
						);
					}
				)
			);
		}
	}]);

	return ReactUserTour;
}(_react.Component);

exports.default = ReactUserTour;


ReactUserTour.defaultProps = {
	style: {
		height: 150,
		width: 350,
		position: "absolute",
		zIndex: 9999,
		backgroundColor: "#fff",
		color: "#494949",
		boxShadow: "0 6px 8px 0 rgba(0, 0, 0, 0.24)"
	},
	containerStyle: {},
	onCancel: function onCancel() {},
	onNext: function onNext() {},
	onBack: function onBack() {},
	nextButtonText: "Next",
	backButtonText: "Back",
	doneButtonText: "Done",
	closeButtonText: "Close",
	buttonContainerStyle: {
		position: "absolute",
		bottom: 10,
		right: 0
	},
	hideButtons: false,
	hideClose: false,
	arrowColor: "#fff",
	arrowSize: 15
};