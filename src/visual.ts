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
    const _ = (<any>window)._;

    function coalesceDate(d: PrimitiveValue): Date {
        return (d instanceof Date) ? d : new Date(d);
    }

    export class Visual implements IVisual {
        private target: HTMLElement;
        private host: IVisualHost;
        private svgNode: SVGSVGElement;
        private settings: VisualSettings;
        private selectionManager: ISelectionManager;
        private scrollOffset: number = 0;
        
        constructor(options: VisualConstructorOptions) {
            this.target = options.element;
            this.host = options.host;
            this.selectionManager = this.host.createSelectionManager();
            this.svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.target.appendChild(this.svgNode);
            this.updateSvgDimensions();
        }

        public update(options: VisualUpdateOptions) {
            try {
                const dataView = _.get(options, 'dataViews[0]');
                if (dataView) {
                    console.log('Visual Update', options, this.selectionManager.getSelectionIds());
                    this.settings = Visual.parseSettings(dataView);                    
                    this.updateSvgDimensions();                    
                    this.render(dataView);
                }
            } catch (err) {
                console.error('Error Updating Visual', err);
            }
        }

        private render(dv: DataView) {
            const data = this.convertDataView(dv);
            const selections = this.unpackSelections(dv);
            render({
                ...this.settings.rendering,
                element: this.svgNode, 
                data, 
                selections, 
                scrollOffset: this.scrollOffset,
                onClick: (index, ctrlPressed) => this.handleCategoryClick(index, ctrlPressed, dv),
                onScroll: (offset) => this.handleScroll(offset, dv),                
            });
        }

        private handleCategoryClick(categoryIndex: number, multiselect: boolean, dv: DataView) {            
            const selectionId = this.host.createSelectionIdBuilder()
                .withCategory(_.get(dv, 'categorical.categories[0]', []), categoryIndex)
                .createSelectionId();
            this.selectionManager.select(selectionId, multiselect);            
            this.render(dv);            
        }

        private handleScroll(offset: number, dv: DataView) {
            this.scrollOffset = Math.max(0, this.scrollOffset + offset);
            this.render(dv);
        }

        private unpackSelections(dv: DataView) {
            const selection = this.selectionManager.getSelectionIds();            
            const category = _.get(dv, 'categorical.categories[0]');
            
            if (!category) {
                return [];
            }

            const selectedCategories: string[] = [];
            selection.forEach(s => {
                try {
                    const selectorData = (<any>s).selector.data[0].expr;
                    if (_.isEqual(selectorData.left.source, (<any>category).source.expr.source)) {
                        selectedCategories.push(selectorData.right.value);
                    }
                } catch (err) {
                    console.log("Error Processing Selection", s, err);
                }
            });

            return selectedCategories.map(s => category.values.indexOf(s));
        }

        private updateSvgDimensions() {
            const dimensions = this.target.getBoundingClientRect();
            this.svgNode.setAttributeNS(null, 'width', `${dimensions.width}`);
            this.svgNode.setAttributeNS(null, 'height', `${dimensions.height}`);
        }

        private convertDataView(dataView: DataView): GanttData {
            const categories = _.get(dataView, 'categorical.categories[0].values', [])
            .map((t, index) => ({
                id: index,
                name: (t || '').toString(),
            }));

            const timeSeries: essex.visuals.gantt.CategoryData[] = [];
            dataView.categorical.values.forEach(topLevelValue => {
                const date = coalesceDate(topLevelValue.source.groupName);
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