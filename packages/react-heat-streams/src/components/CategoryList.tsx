/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { memo, useCallback } from 'react'
import {
	ICategory,
	ICategoryValueMap,
	IColorizer,
	IScaler,
	Scrub,
	XDomain,
	TimeDomain,
} from '../types'
import { TimeAxis as Axis } from './Axis'
import { Backboard } from './Backboard'
import { CategoryChartList } from './CategoryChartList'
import { CategoryNameList } from './CategoryNameList'
import { Overlay } from './Overlay'
import { TimeScrub } from './TimeScrub'

export interface ICategoryListProps {
	axisHeight: number
	width: number
	height: number
	axisOffset: number
	textPercent: number
	showCategories: boolean
	categories: ICategory[]
	categoryValues: ICategoryValueMap
	textColor: string
	rowHeight: number
	highlightColor: string
	numAxisTicks: number
	xDomain: XDomain
	categoryY: (index: number) => number
	colorizer: IColorizer
	xScale: IScaler
	showValues: boolean
	isCategorySelected: (category: ICategory) => boolean
	sliceWidth: number
	onClickCategory: (category: ICategory, ctrlKey: boolean) => void
	onClick: (x: number, y: number, ctrlKey: boolean) => void
	onScrub: (bounds: Scrub) => void
	onScroll: (deltaX: number, deltaY: number) => void
	onClear: () => void
	xPan: number
	timeScrub?: TimeDomain
}

export const CategoryList: React.FC<ICategoryListProps> = memo(
	function CategoryList({
		axisHeight,
		width,
		height,
		axisOffset,
		textPercent,
		showCategories,
		categories,
		categoryValues,
		rowHeight,
		highlightColor,
		categoryY,
		colorizer,
		xScale,
		showValues,
		isCategorySelected,
		sliceWidth,
		onClick,
		onClickCategory,
		onClear,
		xPan,
		timeScrub,
		numAxisTicks,
		xDomain,
		textColor,
		onScroll,
		onScrub,
	}) {
		const onWheel = useCallback(
			(evt: React.WheelEvent<SVGGElement>): void =>
				onScroll(evt.deltaX, evt.deltaY),
			[onScroll],
		)

		const onDragOverlay = useCallback(
			(bounds: TimeDomain): void => onScrub(bounds),
			[onScrub],
		)
		return (
			<g className="category-list" onWheel={onWheel}>
				{showCategories ? (
					<CategoryNameList
						categories={categories}
						width={width * textPercent}
						rowHeight={rowHeight}
						textColor={textColor}
						categoryY={categoryY}
						isCategorySelected={isCategorySelected}
						onClickCategory={onClickCategory}
						onClear={onClear}
					/>
				) : null}
				<Backboard
					width={width - textPercent * width}
					x={textPercent * width}
					height={height}
					onClick={onClear}
				/>
				<CategoryChartList
					categories={categories}
					categoryValues={categoryValues}
					xScale={xScale}
					colorizer={colorizer}
					rowHeight={rowHeight}
					showValues={showValues}
					width={width}
					highlightColor={highlightColor}
					isCategorySelected={isCategorySelected}
					categoryY={categoryY}
					sliceWidth={sliceWidth}
					xPan={xPan}
					xDomain={xDomain}
				/>
				<TimeScrub
					data={timeScrub}
					xScale={xScale}
					height={axisOffset}
					color={highlightColor}
				/>
				<Axis
					x={width * textPercent}
					xPan={xPan}
					offset={axisOffset}
					xScale={xScale}
					timeScrub={timeScrub}
					height={axisHeight}
					width={width - width * textPercent}
					numTicks={numAxisTicks}
					textColor={textColor}
				/>
				<Overlay
					width={width - textPercent * width}
					x={textPercent * width}
					height={axisOffset + axisHeight}
					xScale={xScale}
					onDrag={onDragOverlay}
					timeScrub={timeScrub}
					highlightColor={highlightColor}
					onClick={onClick}
				/>
			</g>
		)
	},
)
