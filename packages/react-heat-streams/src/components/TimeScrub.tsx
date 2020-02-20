/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo } from 'react'
import { IScaler } from '../types'

export interface ITimeScrubProps {
	data?: Array<number | Date>
	xScale: IScaler
	height: number
	color: string
}

export const TimeScrub: React.FC<ITimeScrubProps> = memo(function TimeScrub({
	data,
	xScale,
	height,
	color,
}) {
	if (!data || !data.length) {
		return null
	}
	return (
		<rect
			className="time-scrub"
			width={xScale(data[1]) - xScale(data[0])}
			height={height}
			x={xScale(data[0])}
			y={0}
			stroke={color}
		/>
	)
})
