import _ from 'lodash';
import React from 'react';
import d3Scale from 'd3-scale';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Axis from '../Axis';
import Button from '../../Button/Button';

export default React.createClass({
	getInitialState() {
		return {
			data: [
				{x: 1, y: 2},
				{x: 10, y: 15},
				{x: 5, y: 20},
				{x: 3, y: 5},
			],
			margin: {top: 10, right: 10, bottom: 50, left: 50},
			width: 600,
			height: 400,
		}
	},

	handleRandomize() {
		const randomLengthArray = _.times(_.random(5, 50));
		const data = _.map(randomLengthArray, () => {
			return {
				x: _.random(1, 250),
				y: _.random(1, 250),
			}
		});
		this.setState({ data });
	},

	render() {
		const {
			margin,
			width,
			height,
			data,
		} = this.state;

		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const x = d3Scale.scaleLinear()
			.domain([0, _.max(_.map(data, 'x'))])
			.range([0, innerWidth]);

		const y = d3Scale.scaleLinear()
			.domain([0, _.max(_.map(data, 'y'))])
			.range([innerHeight, 0]);

		/*
		const time = d3Scale.scaleTime()
			.domain([_.min(dateData), _.max(dateData)])
			.range([0, innerWidth]);
		*/

		return (
			<div>
				<Button
					onClick={this.handleRandomize}
					style={{ verticalAlign: 'top' }}
				>
					Randomize
				</Button>
				<svg
					width={width}
					height={height}
				>
					{/* Push the y axis to the right margin with a translate */}
					<g transform={`translate(${margin.left}, ${margin.top})`}>
						<Axis scale={y} orient='left' />
					</g>
					{/* Push the x axis to the bottom margin with a translate */}
					<g transform={`translate(${margin.left}, ${innerHeight + margin.top})`}>
						<Axis scale={x} />
					</g>
					{/* Scatter plot */}
					<ReactCSSTransitionGroup
						transitionName={'circles'}
						transitionEnterTimeout={300}
						transitionLeaveTimeout={300}
						component='g'
						transform={`translate(${margin.left}, ${margin.top})`}
					>
						{_.map(data, (d) =>
							<circle
								className={'circle'}
								key={`${d.x}|${d.y}`}
								cx={x(d.x)}
								cy={y(d.y)}
								r={4}
							/>
						)}
					</ReactCSSTransitionGroup>
				</svg>
				<pre style={{
					maxHeight: 200,
					overflow: 'auto',
					whiteSpace: 'normal',
				}}>
					{JSON.stringify(data)}
				</pre>
			</div>
		);
	}
});