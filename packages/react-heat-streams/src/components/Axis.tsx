/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo } from 'react'
import { TimeDomain } from '../types'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { Axis, axisPropsFromTickScale, BOTTOM } = require('react-d3-axis')

export interface ITimeAxisProps {
	x: number
	width: number
	height: number
	xPan: number
	offset: number
	numTicks: number
	textColor: string
	timeScrub?: TimeDomain
	xScale: (input: number | Date) => number
}

export const TimeAxis: React.FC<ITimeAxisProps> = memo(function TimeAxis({
	xPan,
	offset,
	xScale,
	timeScrub,
	height,
	textColor,
	numTicks = 10,
}) {
	const axisScrub =
		timeScrub == null || timeScrub.length !== 2 ? null : (
			<AxisScrub height={height} timeScrub={timeScrub} xScale={xScale} />
		)
	const axisStyle: any = React.useMemo(
		() => ({
			orient: BOTTOM,
			strokeColor: textColor,
		}),
		[textColor],
	)
	console.log('AXIS TC1', textColor)

	return (
		<g transform={`translate(${xPan}, ${offset})`} style={styles.grouping}>
			{axisScrub}
			<Axis {...axisPropsFromTickScale(xScale, numTicks)} style={axisStyle} />
		</g>
	)
})
TimeAxis.displayName = 'TimeAxis'

const styles: Record<string, React.CSSProperties> = {
	grouping: {
		pointerEvents: 'all',
	},
}

interface AxisScrubProps {
	height: number
	timeScrub: TimeDomain
	xScale: any
}
const AxisScrub: React.FC<AxisScrubProps> = memo(function AxisScrub({
	height,
	timeScrub,
	xScale,
}) {
	return (
		<rect
			className="axis-scrub-extent"
			height={height}
			x={xScale(timeScrub[0])}
			width={xScale(timeScrub[1]) - xScale(timeScrub[0])}
		/>
	)
})
