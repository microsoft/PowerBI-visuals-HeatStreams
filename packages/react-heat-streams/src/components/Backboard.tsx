/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo } from 'react'

/* Having this in the background allows the top-level g element to catch scroll and click events */

export interface IBackboardProps {
	height: number
	width: number
	x: number
	onClick: () => void
}

export const Backboard: React.FC<IBackboardProps> = memo(
	({ height, width, x, onClick }) => (
		<rect
			className="backboard"
			x={x}
			height={height}
			width={width}
			onClick={onClick}
		/>
	),
)
Backboard.displayName = 'Backboard'
