import * as React from 'react'
import {
	ICategory,
	ICategoryValueMap,
	IColorizer,
	IScaler,
	Scrub,
} from '../interfaces'
import Axis from './Axis'
import Backboard from './Backboard'
import CategoryChartList from './CategoryChartList'
import CategoryNameList from './CategoryNameList'
import Overlay from './Overlay'
import TimeScrub from './TimeScrub'

export interface ICategoryListProps {
	axisHeight: number
	width: number
	height: number
	axisOffset: number
	textPercent: number
	showCategories: boolean
	categories: ICategory[]
	categoryValues: ICategoryValueMap
	rowHeight: number
	highlightColor: string
	numAxisTicks: number
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
	timeScrub: Array<number | Date>
}

const CategoryList: React.StatelessComponent<ICategoryListProps> = ({
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
	onScroll,
	onScrub,
	onClear,
	xPan,
	timeScrub,
	numAxisTicks,
}) => (
	<g
		className="category-list"
		onWheel={evt => onScroll(evt.deltaX, evt.deltaY)}
	>
		<CategoryNameList
			categories={categories}
			showCategories={showCategories}
			width={width * textPercent}
			rowHeight={rowHeight}
			categoryY={categoryY}
			isCategorySelected={isCategorySelected}
			onClickCategory={onClickCategory}
			onClear={onClear}
		/>
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
		/>
		<Overlay
			width={width - textPercent * width}
			x={textPercent * width}
			height={axisOffset + axisHeight}
			xScale={xScale}
			onDrag={bounds => onScrub(bounds)}
			timeScrub={timeScrub}
			highlightColor={highlightColor}
			onClick={onClick}
		/>
	</g>
)

export default CategoryList
