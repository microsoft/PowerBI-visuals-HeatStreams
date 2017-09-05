/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// tslint:disable no-var-requires
"use strict";
import "d3";
import "d3-interpolate";
import "d3-scale-chromatic";

import Chart from "./chart/chart";
import DataViewConverter from "./data/DataViewConverter";
import VisualSettings from "./settings/VisualSettings";

const get = require("lodash/get");

export class Visual implements powerbi.extensibility.IVisual {
    private static parseSettings(dataView: powerbi.DataView): VisualSettings {
        return VisualSettings.parse(dataView) as VisualSettings;
    }

    private target: HTMLElement;
    private host: powerbi.extensibility.visual.IVisualHost;
    private settings: VisualSettings;
    private selectionManager: powerbi.extensibility.ISelectionManager;
    private converter: DataViewConverter;
    private scrollOffset: number = 0;
    private chart: Chart;

    constructor(options: powerbi.extensibility.visual.VisualConstructorOptions) {
        this.target = options.element;
        this.host = options.host;
        this.selectionManager = this.host.createSelectionManager();
        this.chart = new Chart();
        this.converter = new DataViewConverter(
            this.selectionManager,
        );
    }

    public update(options: powerbi.extensibility.VisualUpdateOptions) {
        try {
            const dataView = get(options, "dataViews[0]");
            if (dataView) {
                console.log("Visual Update", options, this.selectionManager.getSelectionIds());
                this.settings = Visual.parseSettings(dataView);
                this.render(dataView);
            }
        } catch (err) {
            console.error("Error Updating Visual", err);
        }
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to
     * select which of the objects and properties you want to expose to the users in the property pane.
     */
    public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions)
    : powerbi.VisualObjectInstance[] | powerbi.VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }

    private render(dv: powerbi.DataView) {
        const { scrollOffset, target: element } = this;
        const data = this.converter.convertDataView(dv, this.settings.data);
        const selections = this.converter.unpackSelectedCategories(dv);
        const options = {
            ...this.settings.rendering,
            ...this.settings.data,
            data,
            element,
            scrollOffset,
            selections,
        };

        this.chart.options = options;
        this.chart.onSelectionChanged(
            (catIndex: number, multi: boolean) => this.handleCategoryClick(catIndex, multi, dv),
        );
        this.chart.render();
    }

    private handleCategoryClick(categoryIndex: number, multiselect: boolean, dv: powerbi.DataView) {
        const selectionId = this.host.createSelectionIdBuilder()
            .withCategory(get(dv, "categorical.categories[0]", []), categoryIndex)
            .createSelectionId();
        this.selectionManager.select(selectionId, multiselect);
        this.render(dv);
    }
}
