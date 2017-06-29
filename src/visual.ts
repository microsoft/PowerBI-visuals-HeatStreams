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
module powerbi.extensibility.visual {
    "use strict";
    import render = essex.visuals.gantt.render;
    import GanttData = essex.visuals.gantt.GanttData;

    export class Visual implements IVisual {
        private target: HTMLElement;
        private host: IVisualHost;
        private svgNode: SVGSVGElement;
        private updateCount: number;
        private settings: VisualSettings;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.host = options.host;
            this.updateCount = 0;
        }

        public update(options: VisualUpdateOptions) {
            try {
                const dataView = options && options.dataViews && options.dataViews[0];
                console.log('Visual Update', options.type, options, dataView);
                this.settings = Visual.parseSettings(dataView);

                if (dataView) {
                    const { width, height } = this.target.getBoundingClientRect();
                    this.target.innerHTML = "";

                    // Create the SVG Node we'll render into
                    this.svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    this.svgNode.setAttributeNS(null, 'width', `${width}`);
                    this.svgNode.setAttributeNS(null, 'height', `${height}`);
                    this.target.appendChild(this.svgNode);
                    render(this.svgNode, this.convertDataView(options.dataViews[0]), this.settings.rendering);
                }
            } catch (err) {
                console.log('Error Updating Visual', err);
            }
        }

        private convertDataView(dataView: DataView): GanttData {
            const categories = dataView.categorical.categories[0].values.map((t, index) => ({
                id: index,
                name: t.toString(),
            }));

            const timeSeries: essex.visuals.gantt.CategoryData[] = [];
            dataView.categorical.values.forEach(topLevelValue => {
                const date = topLevelValue.source.groupName as Date;
                topLevelValue.values.forEach((nestedValue, index) => {
                    if (nestedValue !== null && nestedValue !== 0) {
                        timeSeries.push({
                            category: index,
                            date,
                            value: +nestedValue,
                        });
                    }
                });
            });
            return {
                categories,
                timeSeries,
            };
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}