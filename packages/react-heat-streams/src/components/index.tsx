/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { scaleLinear, scaleTime } from 'd3-scale'
import * as React from 'react'
import {
	DateAggregation,
	ICategory,
	ICategorySelectionMap,
	ICategoryValueMap,
	IColorizer,
	IScaler,
	Scrub,
	XDomain,
	TimeDomain,
} from '../interfaces'
import { getSliceEnd } from '../utils'
import CategoryList from './CategoryList'

export interface IHeatStreamsState {
	scrollPosition: number
	panPosition: number
}

export interface IHeatStreamsChartProps {
	width: number
	height: number
	textPercent: number
	rowHeight: number
	axisHeight: number
	numTicks: number
	zoomLevel: number
	xDomain: XDomain
	highlightColor: string
	showCategories: boolean
	rowGap: boolean
	showValues: boolean
	timeScrub: TimeDomain
	colorizer: IColorizer
	categories: ICategory[]
	categoryValues: ICategoryValueMap
	selections: ICategorySelectionMap
	numericAggregation?: number
	dateAggregation?: DateAggregation
	onClearSelection: () => void
	onClickCategory: (category: ICategory, ctrl: boolean) => void
	onScrub: (bounds: Scrub) => void
}

export default class HeatStreamsChart extends React.PureComponent<
	IHeatStreamsChartProps,
	IHeatStreamsState
> {
	constructor(props: IHeatStreamsChartProps) {
		super(props)
		this.state = {
			panPosition: 0,
			scrollPosition: 0,
		}
	}

	public render(): JSX.Element {
		const { axisOffset, categoriesInView } = this
		const {
			colorizer,
			timeScrub,
			width,
			height,
			textPercent,
			showCategories,
			showValues,
			rowHeight,
			axisHeight,
			highlightColor,
			rowGap,
			categoryValues,
			selections,
			numTicks,
			xDomain,
		} = this.props
		const xScale = this.getXScale(xDomain)
		const sliceWidth = this.sliceWidth(xScale)
		const categoryY = (index: number): number =>
			rowHeight * index + (rowGap ? index : 0)
		const isCategorySelected = (cat: ICategory): boolean =>
			!!selections[cat.name]
		const categoryTextWidth = width * textPercent
		const chartWidth = width - categoryTextWidth

		return (
			<svg height={height} width={width}>
				<defs>
					<clipPath id="clip-chart">
						<rect
							x={categoryTextWidth}
							y="0"
							width={chartWidth}
							height={height}
						/>
					</clipPath>
					<clipPath id="clip-category-text">
						<rect x="0" y="0" width={categoryTextWidth} height={height} />
					</clipPath>
				</defs>
				<CategoryList
					height={height}
					width={width}
					axisHeight={axisHeight}
					axisOffset={axisOffset}
					categoryY={categoryY}
					categories={categoriesInView}
					categoryValues={categoryValues}
					textPercent={textPercent}
					showCategories={showCategories}
					rowHeight={rowHeight}
					highlightColor={highlightColor}
					showValues={showValues}
					colorizer={colorizer}
					xScale={xScale}
					xDomain={xDomain}
					numAxisTicks={numTicks}
					isCategorySelected={isCategorySelected}
					sliceWidth={sliceWidth}
					onClickCategory={this.props.onClickCategory}
					onClick={this.onClick}
					onScroll={this.onScroll}
					onScrub={this.props.onScrub}
					xPan={this.state.panPosition}
					timeScrub={timeScrub}
					onClear={this.props.onClearSelection}
				/>
			</svg>
		)
	}

	private onClick = (x: number, y: number, ctrlKey: boolean): void => {
		const { rowGap, timeScrub, rowHeight } = this.props
		if (timeScrub) {
			this.props.onClearSelection()
		} else {
			const gap = rowGap ? 1 : 0
			const category = this.categoriesInView[Math.floor(y / (rowHeight + gap))]
			if (category) {
				this.props.onClickCategory(category, ctrlKey)
			} else {
				this.props.onClearSelection()
			}
		}
	}

	private get axisOffset(): number {
		const { axisHeight, categories, height, rowHeight } = this.props
		return Math.min(
			height - axisHeight,
			categories.length * rowHeight + axisHeight,
		)
	}

	private get maxCategories(): number {
		const { axisHeight, height, rowGap, rowHeight } = this.props
		const gap = rowGap ? 1 : 0
		return Math.floor((height - axisHeight) / (rowHeight + gap))
	}

	private get categoryOffsetStart(): number {
		const { rowHeight, categories } = this.props
		let categoryOffsetStart = Math.floor(this.state.scrollPosition / rowHeight)
		if (categories.length < categoryOffsetStart) {
			categoryOffsetStart = categories.length - this.maxCategories
		}
		return categoryOffsetStart
	}

	private get categoriesInView(): ICategory[] {
		const { categories } = this.props
		const { categoryOffsetStart, maxCategories } = this
		return categories.slice(
			categoryOffsetStart,
			categoryOffsetStart + maxCategories,
		)
	}

	private onScroll = (deltaX: number, deltaY: number): void => {
		const panPosition =
			this.props.zoomLevel === 1
				? 0
				: Math.min(0, this.state.panPosition - deltaX)
		const scrollPosition = Math.max(0, this.state.scrollPosition + deltaY)
		this.setState({ panPosition, scrollPosition })
	}

	private getXScale(domain: XDomain): any {
		const { showCategories, width, textPercent, zoomLevel } = this.props
		const rangeStart = showCategories ? width * textPercent : 0
		const range = [rangeStart, width * zoomLevel]
		const isNumberDomain = typeof domain[0] === 'number'
		if (isNumberDomain) {
			return scaleLinear()
				.domain(domain)
				.range(range)
		} else {
			return scaleTime()
				.domain(domain)
				.range(range)
		}
	}

	private sliceWidth(xScale: IScaler): number {
		const start = this.props.xDomain[0]
		const end = getSliceEnd(
			start,
			this.props.numericAggregation,
			this.props.dateAggregation,
		)
		return xScale(end) - xScale(start)
	}
}
