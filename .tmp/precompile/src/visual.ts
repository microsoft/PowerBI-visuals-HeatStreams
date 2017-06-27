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
module powerbi.extensibility.visual.gantt74779FE5319F4655BE62C4C5FD0ABFB1  {
    "use strict";
    import render = essex.visuals.gantt.render;

    const __FAKE_DATA__ = {
        "categories": [
            { "id": 1, "name": "pokemon" },
            { "id": 2, "name": "cod" },
            { "id": 3, "name": "lol" },
            { "id": 4, "name": "masseffect" },
            { "id": 5, "name": "finalfantasy" }
        ],
        "timeSeries": [
            { "category": 1, "date": "2017-01-01", "value": 0.7441 },
            { "category": 1, "date": "2017-01-02", "value": 0.7441 },
            { "category": 1, "date": "2017-01-03", "value": 0.7441 },
            { "category": 1, "date": "2017-01-04", "value": 0.7441 },
            { "category": 1, "date": "2017-01-09", "value": 0.102 },
            { "category": 1, "date": "2017-01-10", "value": 0.102 },
            { "category": 1, "date": "2017-01-11", "value": 0.102 },
            { "category": 1, "date": "2017-01-12", "value": 0.102 },
            { "category": 1, "date": "2017-01-13", "value": 0.9214 },
            { "category": 1, "date": "2017-01-14", "value": 0.8871 },
            { "category": 1, "date": "2017-01-15", "value": 0.1829 },
            { "category": 1, "date": "2017-01-16", "value": 0.4761 },
            { "category": 1, "date": "2017-01-17", "value": 0.9982 },
            { "category": 1, "date": "2017-01-26", "value": 0.5801 },
            { "category": 1, "date": "2017-01-27", "value": 0.5293 },
            { "category": 1, "date": "2017-01-28", "value": 0.131 },
            { "category": 1, "date": "2017-01-29", "value": 0.5616 },
            { "category": 1, "date": "2017-01-30", "value": 0.6696 },
            { "category": 2, "date": "2017-01-01", "value": 0.5707 },
            { "category": 2, "date": "2017-01-02", "value": 0.4719 },
            { "category": 2, "date": "2017-01-03", "value": 0.6764 },
            { "category": 2, "date": "2017-01-04", "value": 0.2597 },
            { "category": 2, "date": "2017-01-05", "value": 0.0537 },
            { "category": 2, "date": "2017-01-06", "value": 0.0537 },
            { "category": 2, "date": "2017-01-07", "value": 0.0537 },
            { "category": 2, "date": "2017-01-08", "value": 0.0537 },
            { "category": 2, "date": "2017-01-09", "value": 0.3902 },
            { "category": 2, "date": "2017-01-10", "value": 0.7196 },
            { "category": 2, "date": "2017-01-11", "value": 0.8767 },
            { "category": 2, "date": "2017-01-12", "value": 0.7693 },
            { "category": 2, "date": "2017-01-13", "value": 0.372 },
            { "category": 2, "date": "2017-01-14", "value": 0.8299 },
            { "category": 2, "date": "2017-01-15", "value": 0.9072 },
            { "category": 2, "date": "2017-01-16", "value": 0.2038 },
            { "category": 2, "date": "2017-01-22", "value": 0.3556 },
            { "category": 2, "date": "2017-01-23", "value": 0.9256 },
            { "category": 2, "date": "2017-01-24", "value": 0.477 },
            { "category": 2, "date": "2017-01-25", "value": 0.5558 },
            { "category": 2, "date": "2017-01-26", "value": 0.8019 },
            { "category": 2, "date": "2017-01-27", "value": 0.8144 },
            { "category": 2, "date": "2017-01-28", "value": 0.7526 },
            { "category": 2, "date": "2017-01-29", "value": 0.2413 },
            { "category": 2, "date": "2017-01-30", "value": 0.4996 },
            { "category": 3, "date": "2017-01-01", "value": 0.3831 },
            { "category": 3, "date": "2017-01-02", "value": 0.1176 },
            { "category": 3, "date": "2017-01-03", "value": 0.4955 },
            { "category": 3, "date": "2017-01-04", "value": 0.8817 },
            { "category": 3, "date": "2017-01-05", "value": 0.3054 },
            { "category": 3, "date": "2017-01-06", "value": 0.9292 },
            { "category": 3, "date": "2017-01-07", "value": 0.8643 },
            { "category": 3, "date": "2017-01-08", "value": 0.8166 },
            { "category": 3, "date": "2017-01-09", "value": 0.3792 },
            { "category": 3, "date": "2017-01-10", "value": 0.6942 },
            { "category": 3, "date": "2017-01-11", "value": 0.381 },
            { "category": 3, "date": "2017-01-12", "value": 0.6477 },
            { "category": 3, "date": "2017-01-13", "value": 0.4825 },
            { "category": 3, "date": "2017-01-14", "value": 0.389 },
            { "category": 3, "date": "2017-01-15", "value": 0.389 },
            { "category": 3, "date": "2017-01-16", "value": 0.389 },
            { "category": 3, "date": "2017-01-20", "value": 0.389 },
            { "category": 3, "date": "2017-01-21", "value": 0.9835 },
            { "category": 3, "date": "2017-01-22", "value": 0.9835 },
            { "category": 3, "date": "2017-01-23", "value": 0.3606 },
            { "category": 3, "date": "2017-01-27", "value": 0.9055 },
            { "category": 3, "date": "2017-01-28", "value": 0.0865 },
            { "category": 3, "date": "2017-01-29", "value": 0.3952 },
            { "category": 3, "date": "2017-01-30", "value": 0.906 },
            { "category": 4, "date": "2017-01-01", "value": 0.4827 },
            { "category": 4, "date": "2017-01-05", "value": 0.698 },
            { "category": 4, "date": "2017-01-06", "value": 0.0337 },
            { "category": 4, "date": "2017-01-07", "value": 0.8845 },
            { "category": 4, "date": "2017-01-08", "value": 0.7698 },
            { "category": 4, "date": "2017-01-09", "value": 0.9766 },
            { "category": 4, "date": "2017-01-10", "value": 0.4415 },
            { "category": 4, "date": "2017-01-11", "value": 0.2214 },
            { "category": 4, "date": "2017-01-12", "value": 0.089 },
            { "category": 4, "date": "2017-01-13", "value": 0.6025 },
            { "category": 4, "date": "2017-01-14", "value": 0.0074 },
            { "category": 4, "date": "2017-01-15", "value": 0.4142 },
            { "category": 4, "date": "2017-01-16", "value": 0.8097 },
            { "category": 4, "date": "2017-01-17", "value": 0.7383 },
            { "category": 4, "date": "2017-01-18", "value": 0.1267 },
            { "category": 4, "date": "2017-01-19", "value": 0.9599 },
            { "category": 4, "date": "2017-01-20", "value": 0.883 },
            { "category": 4, "date": "2017-01-21", "value": 0.4154 },
            { "category": 4, "date": "2017-01-22", "value": 0.2843 },
            { "category": 4, "date": "2017-01-23", "value": 0.4434 },
            { "category": 4, "date": "2017-01-24", "value": 0.3024 },
            { "category": 4, "date": "2017-01-25", "value": 0.1161 },
            { "category": 4, "date": "2017-01-26", "value": 0.8317 },
            { "category": 4, "date": "2017-01-27", "value": 0.7555 },
            { "category": 4, "date": "2017-01-28", "value": 0.2972 },
            { "category": 4, "date": "2017-01-29", "value": 0.9963 },
            { "category": 4, "date": "2017-01-30", "value": 0.2397 },
            { "category": 5, "date": "2017-01-01", "value": 0.0577 },
            { "category": 5, "date": "2017-01-02", "value": 0.6311 },
            { "category": 5, "date": "2017-01-03", "value": 0.6412 },
            { "category": 5, "date": "2017-01-04", "value": 0.0669 },
            { "category": 5, "date": "2017-01-05", "value": 0.1403 },
            { "category": 5, "date": "2017-01-06", "value": 0.6337 },
            { "category": 5, "date": "2017-01-07", "value": 0.9432 },
            { "category": 5, "date": "2017-01-08", "value": 0.4762 },
            { "category": 5, "date": "2017-01-09", "value": 0.1805 },
            { "category": 5, "date": "2017-01-10", "value": 0.223 },
            { "category": 5, "date": "2017-01-11", "value": 0.7628 },
            { "category": 5, "date": "2017-01-12", "value": 0.4666 },
            { "category": 5, "date": "2017-01-13", "value": 0.6436 },
            { "category": 5, "date": "2017-01-14", "value": 0.7465 },
            { "category": 5, "date": "2017-01-15", "value": 0.8153 },
            { "category": 5, "date": "2017-01-16", "value": 0.2185 },
            { "category": 5, "date": "2017-01-17", "value": 0.3412 },
            { "category": 5, "date": "2017-01-18", "value": 0.7576 },
            { "category": 5, "date": "2017-01-19", "value": 0.8348 },
            { "category": 5, "date": "2017-01-20", "value": 0.3743 },
            { "category": 5, "date": "2017-01-21", "value": 0.8554 },
            { "category": 5, "date": "2017-01-22", "value": 0.87 },
            { "category": 5, "date": "2017-01-23", "value": 0.7194 },
            { "category": 5, "date": "2017-01-24", "value": 0.8603 },
            { "category": 5, "date": "2017-01-25", "value": 0.0875 },
            { "category": 5, "date": "2017-01-26", "value": 0.2616 },
            { "category": 5, "date": "2017-01-27", "value": 0.6609 },
            { "category": 5, "date": "2017-01-28", "value": 0.5456 },
            { "category": 5, "date": "2017-01-29", "value": 0.9064 },
            { "category": 5, "date": "2017-01-30", "value": 0.7197 }
        ]
    };

    export class Visual implements IVisual {
        private target: HTMLElement;
        private svgNode: SVGSVGElement;
        private updateCount: number;
        private settings: VisualSettings;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.updateCount = 0;
        }

        public update(options: VisualUpdateOptions) {
            try {
                this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                console.log('Visual update', options);
                const { width, height } = this.target.getBoundingClientRect();

                this.target.innerHTML = "";

                // Create the SVG Node we'll render into
                this.svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                this.svgNode.setAttributeNS(null, 'width', `${width}`);
                this.svgNode.setAttributeNS(null, 'height', `${height}`);
                this.target.appendChild(this.svgNode);

                render(this.svgNode, __FAKE_DATA__);
            } catch (err) {
                console.log('Error Updating Visual', err);
            }
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}