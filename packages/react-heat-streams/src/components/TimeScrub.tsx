import * as React from 'react'
import { IScaler } from '../interfaces'

export interface ITimeScrubProps {
	data: Array<number | Date>
	xScale: IScaler
	height: number
	color: string
}

const TimeScrub: React.StatelessComponent<ITimeScrubProps> = ({
	data,
	xScale,
	height,
	color,
}) => {
	const isScrubValid = data !== null && data.length === 2
	return isScrubValid ? (
		<rect
			className="time-scrub"
			width={xScale(data[1]) - xScale(data[0])}
			height={height}
			x={xScale(data[0])}
			y={0}
			stroke={color}
		/>
	) : null
}

export default TimeScrub
