/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable import/no-webpack-loader-syntax */
import {
	IVisualDataOptions,
	IVisualRenderingOptions,
} from '../chart/interfaces'
import { VisualDataOptionsImpl } from './VisualDataOptionsImpl'
import { VisualRenderingOptionsImpl } from './VisualRenderingOptionsImpl'
import { dataViewObjectsParser } from 'powerbi-visuals-utils-dataviewutils'
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser

export class VisualSettings extends DataViewObjectsParser {
	public rendering: IVisualRenderingOptions = new VisualRenderingOptionsImpl()
	public data: IVisualDataOptions = new VisualDataOptionsImpl()
}
