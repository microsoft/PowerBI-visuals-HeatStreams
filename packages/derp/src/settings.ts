/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { dataViewObjectsParser } from 'powerbi-visuals-utils-dataviewutils'
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser

export class VisualSettings extends DataViewObjectsParser {
	public dataPoint: DataPointSettings = new DataPointSettings()
}

export class DataPointSettings {
	// Default color
	public defaultColor = ''
	// Show all
	public showAllDataPoints = true
	// Fill
	public fill = ''
	// Color saturation
	public fillRule = ''
	// Text Size
	public fontSize = 12
}
