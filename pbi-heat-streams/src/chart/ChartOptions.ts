/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import powerbiVisualsApi from 'powerbi-visuals-api'
import {
	Colorizer,
	DivergingScaler,
	isDivergingColorScheme,
	LinearScaler,
} from '@essex/d3-coloring-scales'
import { TimeDomain, ICategorySelectionMap } from 'react-heat-streams'
import { DataViewConverter } from '../data/DataViewConverter'
import { VisualSettings } from '../settings/VisualSettings'
import { IChartData, IChartOptions } from './types'
import { IVisualDataOptions, IVisualRenderingOptions } from '../settings/types'

export class ChartOptions implements IChartOptions {
	public _dataOptions: IVisualDataOptions | undefined
	public _renderOptions: IVisualRenderingOptions | undefined
	public _data: IChartData | undefined
	public _selections: ICategorySelectionMap | undefined
	public _timeScrub: TimeDomain | null | undefined
	public _colorizer: Colorizer | undefined

	constructor(
		private converter: DataViewConverter,
		public element: HTMLElement,
	) {} // tslint:disable-line no-empty

	public loadFromDataView(
		dataView: powerbiVisualsApi.DataView,
		settings: VisualSettings,
	): void {
		this._dataOptions = settings.data
		this._renderOptions = settings.rendering
		this._timeScrub = this.converter.unpackDomainScrub(dataView)
		this._data = this.converter.convertDataView(dataView, settings.data)
		const { colorScheme } = this.renderOptions
		const { isLogScale } = this.dataOptions
		let { valueMin, valueMax } = this

		// If the color mapping is reversed, reverse the scalar inputs
		if (this.renderOptions.reverseColorScheme) {
			const tmp = valueMin
			valueMin = valueMax
			valueMax = tmp
		}
		const scaler = isDivergingColorScheme(colorScheme)
			? new DivergingScaler(valueMin, this.valueMid, valueMax, isLogScale)
			: new LinearScaler(valueMin, valueMax, isLogScale)

		this._colorizer = new Colorizer(scaler, colorScheme)
		this.loadSelections(dataView)
	}

	public get timeScrub(): TimeDomain | null {
		return <TimeDomain | null>this._timeScrub
	}

	public get selections(): ICategorySelectionMap {
		return <ICategorySelectionMap>this._selections
	}

	public get data(): IChartData {
		return <IChartData>this._data
	}

	public get renderOptions(): IVisualRenderingOptions {
		return <IVisualRenderingOptions>this._renderOptions
	}

	public get dataOptions(): IVisualDataOptions {
		return <IVisualDataOptions>this._dataOptions
	}

	public get colorizer(): Colorizer {
		return <Colorizer>this._colorizer
	}

	/**
	 * Loads the selections from the given dataView
	 */
	public loadSelections(dataView: powerbiVisualsApi.DataView): void {
		this._selections = this.converter.unpackSelectedCategories()
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

	public get valueMid(): number {
		const scoreSplit = this.dataOptions.scoreSplit
		return scoreSplit !== null && scoreSplit !== undefined
			? scoreSplit
			: (this.valueMax + this.valueMin) / 2
	}
}
