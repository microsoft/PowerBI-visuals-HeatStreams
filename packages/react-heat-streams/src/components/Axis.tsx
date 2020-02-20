/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo } from 'react'
import { TimeDomain } from '../interfaces'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { Axis, axisPropsFromTickScale, BOTTOM } = require('react-d3-axis')

export interface ITimeAxisProps {
	x: number
	width: number
	height: number
	xPan: number
	offset: number
	numTicks: number
	timeScrub?: TimeDomain
	xScale: (input: number | Date) => number
}

const styles: Record<string, React.CSSProperties> = {
	grouping: {
		pointerEvents: 'all',
	},
	axis: {
		orient: BOTTOM,
	} as any,
}

export const TimeAxis: React.FC<ITimeAxisProps> = memo(
	({ xPan, offset, xScale, timeScrub, height, numTicks = 10 }) => {
		const axisScrub =
			timeScrub == null || timeScrub.length !== 2 ? null : (
				<AxisScrub height={height} timeScrub={timeScrub} xScale={xScale} />
			)
		return (
			<g transform={`translate(${xPan}, ${offset})`} style={styles.grouping}>
				{axisScrub}
				<Axis
					{...axisPropsFromTickScale(xScale, numTicks)}
					style={styles.axis}
				/>
			</g>
		)
	},
)
TimeAxis.displayName = 'TimeAxis'

interface AxisScrubProps {
	height: number
	timeScrub: TimeDomain
	xScale: any
}
const AxisScrub: React.FC<AxisScrubProps> = memo(
	({ height, timeScrub, xScale }) => (
		<rect
			className="axis-scrub-extent"
			height={height}
			x={xScale(timeScrub[0])}
			width={xScale(timeScrub[1]) - xScale(timeScrub[0])}
		/>
	),
)
AxisScrub.displayName = 'AxisScrub'
