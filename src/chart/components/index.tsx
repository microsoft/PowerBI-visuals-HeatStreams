import { scaleLinear, scaleTime } from 'd3-scale'
import * as React from 'react'
import getSliceEnd from '../../data/getSliceEnd'
import {
	ICategory,
	IChartOptions,
	IColorizer,
	IScaler,
	XDomain,
} from '../interfaces'
import CategoryList from './CategoryList'

export interface IHeatStreamsState {
	scrollPosition: number
	panPosition: number
}

export interface IHeatStreamsChartProps {
	width: number
	height: number
	options: IChartOptions
	colorizer: IColorizer
	onClearSelection: () => void
	onClickCategory: (category: ICategory, ctrl: boolean) => void
	onScrub: (bounds: Array<Date | number>) => void
}

export default class HeatStreamsChart extends React.Component<
	IHeatStreamsChartProps,
	IHeatStreamsState
> {
	constructor(...args) {
		super(...args)
		this.state = {
			panPosition: 0,
			scrollPosition: 0,
		}
	}

	public render() {
		const {
			axisOffset,
			axisHeight,
			categoriesInView,
			highlightColor,
			rowHeight,
			width,
			height,
			data,
			showValues,
			rowGap,
		} = this
		const { colorizer } = this.props
		const categoryY = (index: number) =>
			rowHeight * index + (rowGap ? index : 0)
		const xScale = this.getXScale(data.positionDomain)
		const sliceWidth = this.sliceWidth(xScale)
		const isCategorySelected = (cat: ICategory) => !!this.selections[cat.name]
		return (
			<svg height={height} width={width}>
				<CategoryList
					height={height}
					width={width}
					axisHeight={axisHeight}
					axisOffset={axisOffset}
					categoryY={categoryY}
					categories={categoriesInView}
					categoryValues={data.categoryValues}
					textPercent={this.textPercent}
					showCategories={this.showCategories}
					rowHeight={rowHeight}
					highlightColor={highlightColor}
					showValues={showValues}
					colorizer={colorizer}
					xScale={xScale}
					isCategorySelected={isCategorySelected}
					sliceWidth={sliceWidth}
					onClickCategory={this.props.onClickCategory}
					onClick={(x, y, ctrlKey) => this.onClick(x, y, ctrlKey)}
					onScroll={(deltaX, deltaY) => this.onScroll(deltaX, deltaY)}
					onScrub={this.props.onScrub}
					xPan={this.state.panPosition}
					timeScrub={this.timeScrub}
					onClear={this.props.onClearSelection}
				/>
			</svg>
		)
	}

	private onClick(x: number, y: number, ctrlKey: boolean) {
		if (this.timeScrub) {
			this.props.onClearSelection()
		} else {
			const gap = this.rowGap ? 1 : 0
			const category = this.categoriesInView[
				Math.floor(y / (this.rowHeight + gap))
			]
			if (category) {
				this.props.onClickCategory(category, ctrlKey)
			} else {
				this.props.onClearSelection()
			}
		}
	}

	private get timeScrub() {
		return this.options.timeScrub
	}

	private get options() {
		return this.props.options
	}

	private get width(): number {
		return this.props.width
	}

	private get height(): number {
		return this.props.height
	}

	private get valueMin(): number {
		const valueMin = this.options.dataOptions.valueMin
		return valueMin !== null && valueMin !== undefined
			? valueMin
			: this.options.data.valueDomain[0]
	}

	private get valueMax(): number {
		const valueMax = this.options.dataOptions.valueMax
		return valueMax !== null && valueMax !== undefined
			? valueMax
			: this.options.data.valueDomain[1]
	}

	private get valueMid() {
		const scoreSplit = this.options.dataOptions.scoreSplit
		return scoreSplit !== null && scoreSplit !== undefined
			? scoreSplit
			: (this.valueMax + this.valueMin) / 2
	}

	private get rowHeight(): number {
		return this.options.renderOptions.rowHeight
	}

	private get axisHeight(): number {
		return this.options.renderOptions.axisHeight
	}

	private get textPercent(): number {
		return (
			Math.max(
				0,
				Math.min(100, this.options.renderOptions.categoryTextPercent),
			) / 100
		)
	}

	private get chartPercent(): number {
		return 1 - this.textPercent
	}

	private get data() {
		return this.options.data
	}

	private get rowGap() {
		return this.options.renderOptions.rowGap
	}

	private get highlightColor() {
		return this.options.renderOptions.highlightColor
	}

	private get axisOffset(): number {
		const { axisHeight, data, height, rowHeight } = this
		return Math.min(
			height - axisHeight,
			data.categories.length * rowHeight + axisHeight,
		)
	}

	private get maxCategories(): number {
		const { axisHeight, height, rowGap, rowHeight } = this
		const gap = rowGap ? 1 : 0
		return Math.floor((height - axisHeight) / (rowHeight + gap))
	}

	private get categoryOffsetStart(): number {
		const { rowHeight, data } = this
		let categoryOffsetStart = Math.floor(this.state.scrollPosition / rowHeight)
		if (data.categories.length < categoryOffsetStart) {
			categoryOffsetStart = data.categories.length - this.maxCategories
		}
		return categoryOffsetStart
	}

	private get categoriesInView(): ICategory[] {
		const { data, categoryOffsetStart, maxCategories } = this
		return data.categories.slice(
			categoryOffsetStart,
			categoryOffsetStart + maxCategories,
		)
	}

	private get selections() {
		return this.options.selections
	}

	private set selections(value) {
		this.options.selections = value
	}

	private get numTicks() {
		return this.options.renderOptions.numTicks
	}

	private get showValues() {
		return this.options.renderOptions.showValues
	}

	private get showCategories() {
		return this.options.renderOptions.showCategories
	}

	private get zoomLevel() {
		return this.options.renderOptions.zoomLevel
	}

	private onScroll(deltaX, deltaY) {
		const panPosition =
			this.zoomLevel === 1 ? 0 : Math.min(0, this.state.panPosition - deltaX)
		const scrollPosition = Math.max(0, this.state.scrollPosition + deltaY)
		this.setState({ panPosition, scrollPosition })
	}

	private getXScale(domain: XDomain): any {
		const rangeStart = this.showCategories ? this.width * this.textPercent : 0
		const range = [rangeStart, this.width * this.zoomLevel]
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
		const start = this.data.positionDomain[0]
		const end = getSliceEnd(start, this.options)
		return xScale(end) - xScale(start)
	}
}
