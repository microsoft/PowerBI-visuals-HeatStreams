module essex.visuals.gantt {
    const d3: any = window['d3'];
    type SelectionChangedHandler = (category: number, multiselect: boolean) => void;
    import dateSliceEnd = essex.visuals.gantt.dataconvert.dateSliceEnd;

    export class GanttChart {
        public scrollPosition: number = 0;
        private optionsInternal: GanttOptions;
        private categoryRebinder: any;
        private svgSelection: any;
        private colorizer: Colorizer;
        private selectionChangedHandler: SelectionChangedHandler;
        private renderedScale: {width: number, height: number};

        public set options(value: GanttOptions) {
            this.optionsInternal = value;
            this.colorizer = new Colorizer(
                value, 
                this.valueMin, 
                this.valueMax, 
                this.options.isDivergent,
                this.options.isLogScale,
            );
        }

        public get options() {
            return this.optionsInternal;
        }

        private get element() {
            return this.options.element;
        }

        private get width(): number {
            return this.options.element.getBoundingClientRect().width;
        }

        private get height(): number {
            return this.options.element.getBoundingClientRect().height;
        }

        private get valueMin(): number {
            const valueMin = this.options.valueMin;
            return (valueMin !== null && valueMin != undefined) ? valueMin : this.options.data.valueDomain[0];
        }

        private get valueMax(): number {
            const valueMax = this.options.valueMax;
            return (valueMax !== null && valueMax != undefined) ? valueMax : this.options.data.valueDomain[1];
        }

        private get rowHeight(): number {
            return this.options.rowHeight;
        }

        private get axisHeight(): number {
            return this.options.axisHeight;
        }

        private get textPercent(): number {
            return Math.max(0, Math.min(100, this.options.categoryTextPercent)) / 100;
        }

        private get chartPercent(): number {
            return 1 - this.textPercent;
        }

        private get fontSize(): number {
            return +this.options.fontSize;
        }

        private get data() {
            return this.options.data;
        }

        private get rowGap() {
            return this.options.rowGap;
        }

        private get highlightColor() {
            return this.options.highlightColor;
        }

        private get axisOffset(): number {
            const { axisHeight, data, height, rowHeight } = this;
            return Math.min(height - axisHeight, data.categories.length * rowHeight + axisHeight);
        }

        private get maxCategories(): number {
            const { axisHeight, height, rowGap, rowHeight } = this;
            const gap = rowGap ? 1 : 0;
            return Math.floor((height - axisHeight) / (rowHeight + gap));
        }

        private get categoryTextYPad(): number {
            const { rowHeight, fontSize } = this;
            return rowHeight > fontSize ? Math.floor((rowHeight - fontSize) / 2) : 0;
        }

        private get categoryOffsetStart(): number {
            const { rowHeight, data } = this;
            let categoryOffsetStart = Math.floor(this.scrollPosition / rowHeight);
            if (data.categories.length < categoryOffsetStart) {
                categoryOffsetStart = data.categories.length - this.maxCategories;
            }
            return categoryOffsetStart;
        }

        private get categoriesInView(): Category[] {
            const { data, categoryOffsetStart, maxCategories } = this;
            return data.categories.slice(categoryOffsetStart, categoryOffsetStart + maxCategories);
        }

        private get selections() {
            return this.options.selections;
        }

        private set selections(value) {
            this.options.selections = value;
        }

        public onSelectionChanged(handler: SelectionChangedHandler) {
            this.selectionChangedHandler = handler;
        }

        public render() {
            const {
                axisOffset,
                categoriesInView,
                categoryTextYPad,
                fontSize,
                highlightColor,
                rowHeight,
                width, 
                height,
                element,
                data,
                rowGap,
            } = this;
            const isCategorySelected = (name: string) => !!this.selections[name];
            const categoryTextY = (d: IndexedCategory) => (rowHeight * d.index) + (rowGap ? d.index : 0) + fontSize + categoryTextYPad;
            const xScale = this.getXScale(data.positionDomain);
            const sliceWidth = this.sliceWidth(xScale);
            
            this.renderedScale = {width, height};
            element.innerHTML = "";

            d3.jsx.render(d3.select(element),
                <svg
                    selectionRef={(e: any) => this.svgSelection = e}
                    height={height} width={width}
                    on={{
                        'click': this.onClick.bind(this),
                        'wheel.scroll': this.onScroll.bind(this),
                    }}
                >
                    <g class="category-list">
                        <TimeAxis axisOffset={axisOffset} xScale={xScale} />
                        <Categories
                            categoryValues={data.categoryValues}
                            xScale={xScale}
                            colorizer={(value: number) => this.colorizer.color(value).toString()}
                            categories={categoriesInView}
                            chartPercent={this.chartPercent}
                            textPercent={this.textPercent}
                            isCategorySelected={isCategorySelected}
                            rowHeight={rowHeight}
                            highlightColor={highlightColor}
                            fontSize={fontSize}
                            categoryTextY={categoryTextY}
                            width={width}
                            rebind={(r: any) => this.categoryRebinder = r}
                            rowGap={rowGap}
                            sliceWidth={sliceWidth}
                        />
                    </g>
                </svg>,
            );
        }

        private sliceWidth(xScale: (input: number | Date) => number): number {
            const start = this.data.positionDomain[0];
            const { dateAggregation } = this.options;
            const end = (typeof start === 'number') ? (start as number) + 1 : dateSliceEnd(start, dateAggregation);
            return xScale(end) - xScale(start);
        }

        private rerender() {
            const { categoriesInView } = this;
            this.categoryRebinder((sel: any) => sel.data(categoriesInView, (d: Category) => d.name));
        }

        private get isFullRenderRequired() {
            const { width, height, renderedScale } = this;
            return width !== renderedScale.width || height !== renderedScale.height;
        }

        private onScroll() {
            this.scrollPosition += d3.event.deltaY;
            this.scrollPosition = Math.max(0, this.scrollPosition);
            this.rerender();
        }

        private onClick() {
            const pos = d3.mouse(this.svgSelection.node());
            const ctrl = d3.event.ctrlKey;
            const gap = this.rowGap ? 1 : 0;
            const category = this.categoriesInView[Math.floor(pos[1] / (this.rowHeight + gap))];
            if (category) {
                const { id: catIndex } = category;
                this.selectionChangedHandler(catIndex, ctrl);
            }
        }

        private getXScale(domain: GanttXDomain): d3.ScaleTime<number, number> {
            const range = [this.width * this.textPercent, this.width];
            if (this.options.positionDomainType === 'date') {
                return d3.scaleTime().domain(domain).range(range);
            } else {
                return d3.scaleLinear().domain(domain).range(range);
            }
        }
    }
}