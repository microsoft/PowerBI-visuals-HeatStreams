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

const styles: { [key: string]: React.CSSProperties } = {
	grouping: {
		pointerEvents: 'all',
	},
	axis: {
		orient: BOTTOM,
	} as any,
}

const AxisScrub = ({ height, timeScrub, xScale }) => (
	<rect
		className="axis-scrub-extent"
		height={height}
		x={xScale(timeScrub[0])}
		width={xScale(timeScrub[1]) - xScale(timeScrub[0])}
	/>
)

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
	const axisScrub = isScrubValid ? (
		<AxisScrub height={height} timeScrub={timeScrub} xScale={xScale} />
	) : null
	return (
		<g transform={`translate(${xPan}, ${offset})`} style={styles.grouping}>
			{axisScrub}
			<Axis {...axisPropsFromTickScale(xScale, numTicks)} style={styles.axis} />
		</g>
	)
}

export default TimeAxis
