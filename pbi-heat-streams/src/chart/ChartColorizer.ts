/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Colorizer,
	DivergingScaler,
	isDivergingColorScheme,
	LinearScaler,
	Scaler,
} from '@essex/d3-coloring-scales'
import { IChartOptions, IChartData } from './types'
import { VisualSettings } from '../settings/VisualSettings'

/**
 * Wraps our color scaling utilities to add invertability
 */
export class ChartColorizer {
	private _colorizer: Colorizer
	private _scaler: Scaler
	private _essexColorizer: Colorizer
	private _options: VisualSettings
	private _data: IChartData

	public constructor(options: VisualSettings, data: IChartData) {
		this._options = options
		this._data = data
		const { isLogScale } = options.data
		const { colorScheme } = options.rendering

		this._scaler = isDivergingColorScheme(colorScheme)
			? new DivergingScaler(
					this.valueMin,
					this.valueMid,
					this.valueMax,
					isLogScale,
			  )
			: new LinearScaler(this.valueMin, this.valueMax, isLogScale)

		this._essexColorizer = new Colorizer(this._scaler, colorScheme)
	}

	public get colorizer(): Colorizer {
		return <any>this
	}

	public color(value: number) {
		let scaled = this._scaler.scale(value)
		if (this._options.rendering.reverseColorScheme) {
			scaled = 1 - scaled
		}
		return this.colorScale(scaled)
	}

	/**
	 * HAKK: invertability should probably be baked into the essex colorizer
	 */
	private get colorScale() {
		return (<any>this._essexColorizer).colorScale
	}

	public get valueMin(): number {
		const valueMin = this._options.data.valueMin
		return valueMin !== null && valueMin !== undefined
			? valueMin
			: this._data.valueDomain[0]
	}

	public get valueMax(): number {
		const valueMax = this._options.data.valueMax
		return valueMax !== null && valueMax !== undefined
			? valueMax
			: this._data.valueDomain[1]
	}

	public get valueMid(): number {
		const scoreSplit = this._options.data.scoreSplit
		return scoreSplit !== null && scoreSplit !== undefined
			? scoreSplit
			: (this.valueMax + this.valueMin) / 2
	}
}
