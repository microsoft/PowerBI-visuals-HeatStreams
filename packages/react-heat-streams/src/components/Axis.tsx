import * as React from 'react'
const { Axis, axisPropsFromTickScale, BOTTOM } = require('react-d3-axis') // tslint:disable-line no-var-requires

export interface ITimeAxisProps {
	x: number
	width: number
	height: number
	xPan: number
	offset: number
	numTicks: number
	timeScrub: Array<number | Date>
	xScale: (input: number | Date) => number
}
const TimeAxis: React.StatelessComponent<ITimeAxisProps> = ({
	xPan,
	offset,
	xScale,
	width,
	x,
	timeScrub,
	height,
	numTicks = 10,
}) => {
	const isScrubValid = timeScrub !== null && timeScrub.length === 2
	return (
		<g
			transform={`translate(${xPan}, ${offset})`}
			style={{ pointerEvents: 'all' }}
		>
			{isScrubValid ? (
				<rect
					className="axis-scrub-extent"
					height={height}
					x={xScale(timeScrub[0])}
					width={xScale(timeScrub[1]) - xScale(timeScrub[0])}
				/>
			) : null}
			<Axis
				{...axisPropsFromTickScale(xScale, numTicks)}
				style={{ orient: BOTTOM }}
			/>
		</g>
	)
}

export default TimeAxis
