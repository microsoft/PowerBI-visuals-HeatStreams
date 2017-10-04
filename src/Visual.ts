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
// tslint:disable no-var-requires no-console
"use strict";
import "d3";
import "d3-interpolate";
import "d3-scale-chromatic";
import * as models from "powerbi-models";

import Chart from "./chart";
import DataViewConverter from "./data/DataViewConverter";
import VisualSettings from "./settings/VisualSettings";

const get = require("lodash/get");

// Polyfill for IE11
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Number.isInteger =
  Number.isInteger ||
  ((value: any) => (typeof value === "number" && isFinite(value) && Math.floor(value) === value));

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

        const dateScrubStart = get(dv, "metadata.objects.data.filter.whereItems[0].condition.left.right.arg.value");
        const dateScrubEnd = get(dv, "metadata.objects.data.filter.whereItems[0].condition.right.right.arg.value");
        const options = {
            ...this.settings.rendering,
            ...this.settings.data,
            data,
            element,
            scrollOffset,
            selections,
            timeScrub: dateScrubStart && dateScrubEnd ? [
              dateScrubStart,
              dateScrubEnd,
            ] : null,
        };
        this.chart.options = options;
        this.chart.onSelectionChanged((idx: number, multi: boolean) =>
          this.handleCategoryClick(idx, multi, dv));
        this.chart.onSelectionCleared(() =>
          this.handleClearSelection(dv));
        this.chart.onScrub((bounds) => this.handleScrub(bounds, dv));
        this.chart.render();
    }

    private async handleClearSelection(dv: powerbi.DataView) {
      await this.selectionManager.clear();
      this.host.applyJsonFilter(null, "data", "filter");
      this.render(dv);
    }

    private getFilterBetweenDates(column: any, start: Date | number, end: Date | number) {
      const target: models.IFilterColumnTarget = {
        column: (column as any).ref,
        table: (column as any).source.entity,
      };
      const filterVal = (v) => (typeof v === "number" ? v : v.toJSON());
      return new models.AdvancedFilter(
          target,
          "And",
          { operator: "GreaterThan", value: filterVal(start) },
          { operator: "LessThan",  value: filterVal(end) },
      );
    }

    private handleScrub(bounds: Array<Date | number>, dv: powerbi.DataView) {
        if (bounds === null || bounds === undefined) {
            this.host.applyJsonFilter(null, "data", "filter");
            return;
        }
        const column = dv.metadata.columns[1].identityExprs[0];
        const filter = this.getFilterBetweenDates(column, bounds[0], bounds[1]);
        this.host.applyJsonFilter(filter, "data", "filter");
    }

    private handleCategoryClick(categoryIndex: number, multiselect: boolean, dv: powerbi.DataView) {
        const selectionId = this.host.createSelectionIdBuilder()
          .withCategory(get(dv, "categorical.categories[0]", []), categoryIndex)
          .createSelectionId();
        this.selectionManager.select(selectionId, multiselect);
        this.render(dv);
    }
}
