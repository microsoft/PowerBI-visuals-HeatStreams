import * as React from 'react'
const { Axis, axisPropsFromTickScale, BOTTOM } = require('react-d3-axis') // tslint:disable-line no-var-requires

const TimeAxis = ({ xPan, offset, height, xScale, width, x, timeScrub }) => (
	<g
		transform={`translate(${xPan}, ${offset})`}
		style={{ pointerEvents: 'all' }}
	>
		<rect
			className="overlay"
			pointerEvents="all"
			cursor="crosshair"
			width={width}
			x={x}
			height={height}
			fill="transparent"
		/>
		{timeScrub ? (
			<rect
				className="extent"
				height="100%"
				fill="rgba(155, 155, 155, 155)"
				x={xScale(timeScrub[0])}
				width={xScale(timeScrub[1]) - xScale(timeScrub[0])}
			/>
		) : null}
		<Axis {...axisPropsFromTickScale(xScale, 10)} style={{ orient: BOTTOM }} />
	</g>
)

export default TimeAxis
