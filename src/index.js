import React, { Component } from "react";
import {Motion, spring} from "react-motion";
import TourButton from "./tour-button";
import TourButtonContainer from "./tour-button-container";
import Arrow from "./arrow";
import positions from "./helpers/position-helpers";
import * as viewBoxHelpers from "./helpers/viewbox-helpers";
import scrollToPosition from "./helpers/scroll-to-position";

export default class ReactUserTour extends Component {

	constructor(props) {
		super(props);
		this.prevPos = {
			top: 0,
			left: 0
		};
		this.getStepPosition = this.getStepPosition.bind(this);

    this.styles = {
      height: 150,
      width: 350,
      position: "absolute",
      zIndex: 9999,
      backgroundColor: "#fff",
      color: "#494949",
      boxShadow: "0 6px 8px 0 rgba(0, 0, 0, 0.24)",
      ...this.props.style,
    }

    this.state = {
      position: {
        top: 0,
        left: 0,
      },
      currentTourStep: {}
    }
	}

  componentWillMount() {
    const currentTourStep = this.props.steps.filter(step => step.step === this.props.step)[0];

    let tourHeight = this.props.style.height || this.styles.height;
    let tourWidth = this.props.style.width || this.styles.width;

    this.setState({
      currentTourStep,
    }, () => {
      this.setCurrentPosition(tourWidth, tourHeight);
    });
  }

  componentWillReceiveProps(nextProps) {
    const currentTourStep = nextProps.steps.filter(step => step.step === nextProps.step)[0];
    this.setState({
      currentTourStep,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const tourBox = document.querySelector(".tour-box");

    let tourHeight = this.styles.height;
    let tourWidth = this.styles.width;

    console.debug(tourWidth, tourHeight, "before");
    if (tourBox) {
      tourHeight = this.styles.height === "auto" ? document.querySelector(".tour-box").getBoundingClientRect().height : this.styles.height;
      tourWidth = this.styles.width === "auto" ? document.querySelector(".tour-box").getBoundingClientRect().width : this.styles.width;
    }
    console.debug(tourWidth, tourHeight, "after");
    this.setCurrentPosition(tourWidth, tourHeight);
  }

	shouldComponentUpdate(nextProps) {
    if (!this.props.active && !nextProps.active) {
      return false;
    }
		return this.props.step !== nextProps.step || this.props.active !== nextProps.active;
	}

  setCurrentPosition(w, h) {
    const { currentTourStep, position } = this.state;

    const newPosition = this.getStepPosition(
    	currentTourStep.selector,
      w,
      h,
    	currentTourStep.position,
    	currentTourStep.margin,
    	currentTourStep.horizontalOffset,
    	currentTourStep.verticalOffset
    );

    if (position.top !== newPosition.top || position.left !== newPosition.left) {
      // console.debug("setting new position:", newPosition)
      this.setState({
        position: newPosition,
      }, () => {
        this.forceUpdate();
      });
    }
  }

	getStepPosition(
		selector,
		tourElWidth,
		tourElHeight,
		overridePos,
		margin = 25,
		horizontalOffset = 0,
		verticalOffset = 0
	) {
		const windowHeight = window.innerHeight;
		const windowWidth = window.innerWidth;
		const el = document.querySelector(selector);
		if (el) {
			let position = el ? el.getBoundingClientRect() : {};
			const isElementBelowViewBox = viewBoxHelpers.isElementBelowViewBox(windowHeight, position.top);
			const isElementAboveViewBox = viewBoxHelpers.isElementBelowViewBox(position.bottom);
			if (isElementBelowViewBox) {
				position = scrollToPosition(el, position.bottom);
			}
			else if (isElementAboveViewBox) {
				position = scrollToPosition(el, window.pageYOffset + position.top);
			}
			const shouldPositionLeft = viewBoxHelpers.shouldPositionLeft(windowWidth, position.left);
			const shouldPositionAbove = viewBoxHelpers.shouldPositionAbove(windowHeight, position.bottom);
			const shouldPositionBelow = viewBoxHelpers.shouldPositionBelow(position.top);
			let elPos;
			if (overridePos && positions[overridePos]) {
				elPos = positions[overridePos]({
					position,
					tourElWidth,
					tourElHeight,
					arrowSize: this.props.arrowSize,
					offsetHeight: el.offsetHeight,
					margin
				});
			}
			else if (shouldPositionLeft && !shouldPositionAbove && !shouldPositionBelow) {
				elPos = positions.left({
					position,
					tourElWidth,
					margin
				});
			}
			else if (shouldPositionAbove) {
				elPos = shouldPositionLeft ? positions.topLeft({
					position,
					tourElWidth,
					tourElHeight,
					arrowSize: this.props.arrowSize,
					margin
				}) :
				positions.top({
					position,
					tourElHeight,
					arrowSize: this.props.arrowSize,
					margin
				});
			}
			else if (shouldPositionBelow) {
				elPos = shouldPositionLeft ? positions.bottomLeft({
					position,
					tourElWidth,
					arrowSize: this.props.arrowSize,
					offsetHeight: el.offsetHeight,
					margin
				}) :
				positions.bottom({
					position,
					arrowSize: this.props.arrowSize,
					offsetHeight: el.offsetHeight,
					margin
				});
			}
			else {
				elPos = positions.right({
					position,
					margin
				});
			}

			elPos.left += horizontalOffset;
			elPos.top += verticalOffset;

			this.prevPos = elPos;
			return elPos;
		}
		else {
			return this.prevPos;
		}
	}

	getCustomArrow(position) {
		return (
			typeof this.props.arrow === "function"
			?
			this.props.arrow({
				position: position.positioned,
				width: this.styles.width,
				height: this.styles.height,
				size: this.props.arrowSize,
				color: this.props.arrowColor
			})
			:
			this.props.arrow
		);
	}

	render() {
		if (!this.props.active || !this.state.currentTourStep) {
			return null;
		}

    const tourBox = document.querySelector(".tour-box");

    let tourHeight = this.styles.height;
    let tourWidth = this.styles.width;

    if (tourBox) {
      tourHeight = this.styles.height === "auto" ? document.querySelector(".tour-box").getBoundingClientRect().height : this.styles.height;
      tourWidth = this.styles.width === "auto" ? document.querySelector(".tour-box").getBoundingClientRect().width : this.styles.width;
    }

		const arrow = (
			this.props.arrow
			?
			this.getCustomArrow(position)
			:
			<Arrow
				position={this.state.position.positioned}
				width={tourWidth}
				height={tourHeight}
				size={this.props.arrowSize}
				color={this.props.arrowColor}
			/>
		);

		const extraButtonProps = this.props.buttonStyle ? {style: this.props.buttonStyle} : {};

		const nextButton = (
			this.props.step !== this.props.steps.length ?
				<TourButton
					onClick={() => this.props.onNext(this.props.step + 1)}
					onTouchTap={() => this.props.onNext(this.props.step + 1)}
					{...extraButtonProps}
					className="react-user-tour-next-button">
						{this.props.nextButtonText}
				</TourButton> : ""
		);

		const backButton = (
			this.props.step !== 1 ?
				<TourButton
					onClick={() => this.props.onBack(this.props.step - 1)}
					onTouchTap={() => this.props.onBack(this.props.step - 1)}
					{...extraButtonProps}
					className="react-user-tour-back-button">
						{this.props.backButtonText}
				</TourButton> : ""
		);

		const doneButton = (
			this.props.step === this.props.steps.length ?
				<TourButton
					onClick={this.props.onCancel}
					onTouchTap={this.props.onCancel}
					{...extraButtonProps}
					className="react-user-tour-done-button">
						{this.props.doneButtonText}
				</TourButton> : ""
		);

		const tourButtonContainer = (
			!this.props.hideButtons ?
				<TourButtonContainer style={this.props.buttonContainerStyle}>
					{nextButton}
					{doneButton}
					{backButton}
				</TourButtonContainer> : ""
		);

		const xStyle = {
			"float": "right",
			"cursor": "pointer",
			"paddingRight": 10,
			"paddingTop": 10
		};

		const closeButton = (
			!this.props.hideClose ?
				<span className="react-user-tour-close"
					style={xStyle}
					onClick={this.props.onCancel}
					onTouchTap={this.props.onCancel}>
						{this.props.closeButtonText}
				</span> : ""
		);

		return (
			<div className="react-user-tour-container" style={this.props.containerStyle}>
				<Motion style={{x: spring(this.state.position.left), y: spring(this.state.position.top)}}>
					{({x, y}) =>

						<div
              className="tour-box"
              style={{
                ...this.styles,
                ...this.props.style,
                transform: `translate3d(${x}px, ${y}px, 0)`
              }}
            >
							{arrow}
							{closeButton}
							{this.state.currentTourStep.title}
							{this.state.currentTourStep.body}
							{tourButtonContainer}
						</div>
					}
				</Motion>
			</div>
		);
	}
}

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
	onCancel: () => {},
	onNext: () => {},
	onBack: () => {},
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
