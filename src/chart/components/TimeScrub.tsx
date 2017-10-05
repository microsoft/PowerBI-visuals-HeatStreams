import * as React from 'react'

const TimeScrub = ({ data, xScale, height, color }) =>
	data === null ? null : (
		<rect
			width={xScale(data[1]) - xScale(data[0])}
			height={height}
			x={xScale(data[0])}
			y={0}
			fill="none"
			stroke={color}
			strokeWidth={1}
		/>
	)

export default TimeScrub
