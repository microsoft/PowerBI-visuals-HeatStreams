import { color, hsl } from 'd3-color'
import * as React from 'react'
import {
	ICategory,
	IColorizer,
	IScaler,
	IValueSlice,
	XDomain,
} from '../../interfaces'
import printValue from '../printValue'
import CategoryView from './CategoryView'
import ValueRun from './ValueRun'
import ValueText from './ValueText'

export interface ICategoryChartProps {
	category: ICategory
	categoryData: IValueSlice[]
	colorizer: IColorizer
	xScale: IScaler
	rowHeight: number
	showValues: boolean
	width: number
	highlightColor: string
	selected: boolean
	y: number
	sliceWidth: number
	xPan: number
	xDomain: XDomain
}

const CategoryChart: React.StatelessComponent<ICategoryChartProps> = ({
	category,
	categoryData,
	colorizer,
	xScale,
	rowHeight,
	showValues,
	width,
	highlightColor,
	selected,
	y,
	sliceWidth,
	xPan,
	xDomain,
}) => {
	const categoryChart = categoryData.map(cd => {
		const cellColor = colorizer(cd.value)
		const textColor = hsl(color(cellColor)).l > 0.5 ? '#000' : '#fff'
		const text = printValue(cd.value)
		const start = xPan + Math.max(xScale(xDomain[0]), xScale(cd.start))
		const end = xPan + xScale(cd.end)
		const currentSliceWidth = end - start

		return [
			<ValueRun
				key={`cdv:${cd.start}`}
				color={cellColor}
				height={rowHeight}
				title={text}
				width={currentSliceWidth}
				x={start}
				y={y}
			/>,
			showValues ? (
				<ValueText
					key={`cdt:${cd.start}`}
					height={rowHeight}
					text={text}
					width={currentSliceWidth}
					color={textColor}
					x={start}
					y={y + rowHeight}
				/>
			) : null,
		]
	})
	return (
		<g className="category-chart">
			<CategoryView
				selected={selected}
				highlightColor={highlightColor}
				width={width}
				height={rowHeight}
				y={y}
			/>
			{categoryChart}
		</g>
	)
}

export default CategoryChart
