/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'regenerator-runtime'
import powerbiVisualsApi from 'powerbi-visuals-api'
import { Chart } from './chart/Chart'
import { ChartOptions } from './chart/ChartOptions'
import { DataViewConverter } from './data/DataViewConverter'
import { Interactions } from './Interactions'
import { VisualSettings } from './settings/VisualSettings'
import * as logger from './logger'
import { TimeDomain } from 'react-heat-streams'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('react-heat-streams/style/heat-streams.css')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const get = require('lodash/get')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json')

export class Visual implements powerbiVisualsApi.extensibility.IVisual {
	private static parseSettings(
		dataView: powerbiVisualsApi.DataView,
	): VisualSettings {
		return <VisualSettings>VisualSettings.parse(dataView)
	}

	private settings: VisualSettings | undefined
	private chart: Chart
	private chartOptions: ChartOptions
	private interactions: Interactions
	private dataView: powerbiVisualsApi.DataView | undefined

	constructor(
		options: powerbiVisualsApi.extensibility.visual.VisualConstructorOptions,
	) {
		const target = options.element
		const host = options.host
		const selectionManager = host.createSelectionManager()
		const converter = new DataViewConverter(selectionManager)

		this.chartOptions = new ChartOptions(converter, target)
		this.chart = new Chart(this.chartOptions)
		this.interactions = new Interactions(host, selectionManager)
		this.interactions.onRestoreSelection(this.onRestoreSelection)
		;(<any>global)['setLogLevel'] = logger.setLevel
		// tslint:disable-next-line no-console
		console.log(
			`%c🔥🔥 HeatStreams ${packageJson.version}🔥🔥%c
    For debug information, set %cwindow.LogLevel%c to
      0 = NONE
      1 = ERROR (default value)
      2 = INFO
      3 = DEBUG
    (this may need to be done in the visual's Javascript context)

    Cheers from Microsoft Research! %cmsrvizsupport@microsoft.com%c
    `,
			'font-size: 20px; font-weight: 500; text-shadow: -1px -1px hsl(0,100%,50%)',
			'',
			'font-weight: bold;',
			'',
			'font-weight: bold',
			'',
		)
	}

	public update(
		options: powerbiVisualsApi.extensibility.visual.VisualUpdateOptions,
	): void {
		try {
			this.dataView = get(options, 'dataViews[0]')
			if (this.dataView) {
				this.settings = Visual.parseSettings(this.dataView)
				this.chartOptions.loadFromDataView(this.dataView, this.settings)
				this.render()
			}
		} catch (err) {
			logger.error('🐞Error Updating Heatstreams 🐞', err)
		}
	}

	/**
	 * This function gets called for each of the objects defined in the capabilities files and allows you to
	 * select which of the objects and properties you want to expose to the users in the property pane.
	 */
	public enumerateObjectInstances(
		options: powerbiVisualsApi.EnumerateVisualObjectInstancesOptions,
	):
		| powerbiVisualsApi.VisualObjectInstance[]
		| powerbiVisualsApi.VisualObjectInstanceEnumerationObject {
		return VisualSettings.enumerateObjectInstances(
			this.settings || VisualSettings.getDefault(),
			options,
		)
	}

	/**
	 * Handler for when selection should be restored from PowerBI
	 */
	private onRestoreSelection = (): void => {
		this.chartOptions.loadSelections(this.dataView!)
		this.render()
	}

	private render(): void {
		const { interactions } = this
		this.chart.onSelectionChanged((cat, multi) => {
			interactions.selectCategory(cat, multi, this.dataView!)
		})
		this.chart.onSelectionCleared(() => interactions.clearSelections())
		this.chart.onScrub(bounds =>
			interactions.scrub(<TimeDomain>bounds, this.dataView!),
		)
		logger.info('Render', this.chartOptions)
		this.chart.render()
	}
}
