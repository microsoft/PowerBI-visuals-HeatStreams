import * as React from 'react'
const { Axis, axisPropsFromTickScale, BOTTOM } = require('react-d3-axis') // tslint:disable-line no-var-requires

const TimeAxis = ({ xPan, offset, xScale, width, x, timeScrub, height }) => (
	<g
		transform={`translate(${xPan}, ${offset})`}
		style={{ pointerEvents: 'all' }}
	>
		{timeScrub ? (
			<rect
				className="axis-scrub-extent"
				height={height}
				x={xScale(timeScrub[0])}
				width={xScale(timeScrub[1]) - xScale(timeScrub[0])}
			/>
		) : null}
		<Axis {...axisPropsFromTickScale(xScale, 10)} style={{ orient: BOTTOM }} />
	</g>
)

export default TimeAxis
