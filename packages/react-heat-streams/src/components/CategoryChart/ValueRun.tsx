/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo } from 'react'

export interface IValueRunProps {
	x: number
	y: number
	width: number
	height: number
	color: string
	title: string
}
export const ValueRun: React.FC<IValueRunProps> = memo(
	({ x, y, width, height, color, title }) => (
		<rect
			className="value-run"
			fill={color}
			height={height}
			width={width}
			x={x}
			y={y}
		>
			<title>{title}</title>
		</rect>
	),
)
ValueRun.displayName = 'ValueRun'
