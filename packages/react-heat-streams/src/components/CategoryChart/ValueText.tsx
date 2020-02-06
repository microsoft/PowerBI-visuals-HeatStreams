/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useRef, useEffect, useMemo } from 'react'

export interface IValueTextProps {
	text: string
	height: number
	x: number
	y: number
	color: string
	width: number
}

const SANE_MIN_WIDTH = 20
const SIDE_PADS = 4
const FONT_SIZE = 8

export const ValueText: React.FC<IValueTextProps> = memo(
	({ text, height, x, y, color, width }) => {
		const textElement = useRef<SVGTextElement>(null)
		const fontSize = useFontSize(height)
		const pad = usePad(height, fontSize)
		useMeasuredText(textElement.current, text, color, width)
		return (
			<text
				ref={textElement}
				className="value-text"
				fontSize={`${fontSize}px`}
				x={x + width - 2}
				y={y - pad}
				fill={'transparent'}
			>
				{text}
			</text>
		)
	},
)
ValueText.displayName = 'ValueText'

function useFontSize(height: number): number {
	return useMemo(() => (height > 10 ? FONT_SIZE : height - 4), [height])
}

function usePad(height: number, fontSize: number): number {
	return useMemo(() => (height - fontSize) / 2, [height, fontSize])
}

function useMeasuredText(
	textElement: SVGTextElement | null,
	text: string,
	color: string,
	width: number,
): void {
	useEffect(
		function remeasure() {
			if (!textElement) {
				return
			}
			const box = textElement.getBBox()
			const spaceNeeded = box.width + SIDE_PADS

			if (width > SANE_MIN_WIDTH) {
				textElement.setAttribute('fill', color)
				const textContent = width >= spaceNeeded ? text : '…'
				textElement.textContent = textContent
			} else {
				textElement.setAttribute('fill', 'transparent')
			}
		},
		[textElement, text, color, width],
	)
}
