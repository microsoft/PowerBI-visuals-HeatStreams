import * as React from 'react'
import {
	ICategory,
	ICategoryValueMap,
	IColorizer,
	IScaler,
} from '../interfaces'
import Axis from './Axis'
import Backboard from './Backboard'
import CategoryChartList from './CategoryChartList'
import CategoryNameList from './CategoryNameList'
import Overlay from './Overlay'
import TimeScrub from './TimeScrub'

export interface ICategoryListProps {
	width: number
	height: number
	axisOffset: number
	textPercent: string
	showCategories: boolean
	categories: ICategory[]
	categoryValues: ICategoryValueMap
	rowHeight: number
	highlightColor: number
	categoryY: (index: number) => number
	colorizer: IColorizer
	xScale: IScaler
	showValues: boolean
	isCategorySelected: (category: ICategory) => boolean
	sliceWidth: number
	onClickCategory: (category: ICategory, ctrlKey: boolean) => void
	onClick: (x: number, y: number, ctrlKey: boolean) => void
	onScrub: (bounds: Array<Date | number>) => void
	onScroll: (deltaY: number) => void
	onClear: () => void
}

const CategoryList = ({
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
}) => (
	<g
		className="category-list"
		onWheel={evt => onScroll(evt.deltaX, evt.deltaY)}
	>
		<Backboard
			width={width - textPercent * width}
			x={textPercent * width}
			height={height}
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
			height={height - axisOffset}
			width={width - width * textPercent}
		/>
		<Overlay
			width={width - textPercent * width}
			x={textPercent * width}
			height={height}
			xScale={xScale}
			onDrag={bounds => onScrub(bounds)}
			timeScrub={timeScrub}
			highlightColor={highlightColor}
			onClick={onClick}
		/>
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
	</g>
)

export default CategoryList
