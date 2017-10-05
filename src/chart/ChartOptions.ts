// tslint:disable  no-var-requires
import {
	Colorizer,
	DivergingScaler,
	isDivergingColorScheme,
	LinearScaler,
} from '@essex/d3-coloring-scales'
import DataViewConverter from '../data/DataViewConverter'
import VisualSettings from '../settings/VisualSettings'
import {
	ICategory,
	IChartData,
	IChartOptions,
	IVisualDataOptions,
	IVisualRenderingOptions,
} from './interfaces'
const get = require('lodash/get')

export default class ChartOptions implements IChartOptions {
	public dataOptions: IVisualDataOptions
	public renderOptions: IVisualRenderingOptions
	public data: IChartData
	public selections: { [key: string]: ICategory }
	public timeScrub: Array<Date | number>
	public colorizer: Colorizer
	public dataView: powerbi.DataView

	constructor(
		private converter: DataViewConverter,
		public element: HTMLElement,
	) {}

	public loadDataView(dataView: powerbi.DataView, settings: VisualSettings) {
		this.dataView = dataView
		this.dataOptions = settings.data
		this.renderOptions = settings.rendering
		this.selections = this.converter.unpackSelectedCategories(dataView)
		this.timeScrub = this.converter.unpackDomainScrub(dataView)
		this.data = this.converter.convertDataView(dataView, settings.data)

		const { colorScheme } = this.renderOptions
		const { isLogScale } = this.dataOptions
		const { valueMin, valueMax, valueMid } = this
		const scaler = isDivergingColorScheme(colorScheme)
			? new DivergingScaler(valueMin, valueMid, valueMax, isLogScale)
			: new LinearScaler(valueMin, valueMax, isLogScale)

		this.colorizer = new Colorizer(scaler, colorScheme)
	}

	public get width(): number {
		return this.element.getBoundingClientRect().width
	}

	public get height(): number {
		return this.element.getBoundingClientRect().height
	}

	public get valueMin(): number {
		const valueMin = this.dataOptions.valueMin
		return valueMin !== null && valueMin !== undefined
			? valueMin
			: this.data.valueDomain[0]
	}

	public get valueMax(): number {
		const valueMax = this.dataOptions.valueMax
		return valueMax !== null && valueMax !== undefined
			? valueMax
			: this.data.valueDomain[1]
	}

	public get valueMid() {
		const scoreSplit = this.dataOptions.scoreSplit
		return scoreSplit !== null && scoreSplit !== undefined
			? scoreSplit
			: (this.valueMax + this.valueMin) / 2
	}
}
