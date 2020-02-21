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
import { ChartColorizer } from './ChartColorizer'

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

		const chartColorizer = new ChartColorizer(settings, this._data)
		this._colorizer = chartColorizer.colorizer
		this.loadSelections()
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
	public loadSelections(): void {
		this._selections = this.converter.unpackSelectedCategories()
	}

	public get width(): number {
		return this.element.getBoundingClientRect().width
	}

	public get height(): number {
		return this.element.getBoundingClientRect().height
	}
}
