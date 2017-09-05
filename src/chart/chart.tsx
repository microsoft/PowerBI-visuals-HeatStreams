import * as d3 from "d3";
import { createElement, render } from "d3-jsx";
import { dateSliceEnd } from "../data/dateUtils";
import Colorizer from "./colorizer";
import { Categories } from "./components";

import {
    ICategory,
    IChartOptions,
    IndexedCategory,
    SelectionChangedHandler,
    XDomain,
} from "./interfaces";

export default class Chart {
    public scrollPosition: number = 0;
    private optionsInternal: IChartOptions;
    private categoryTextRebinder: any;
    private categoryChartRebinder: any;
    private svgSelection: any;
    private colorizer: Colorizer;
    private selectionChangedHandler: SelectionChangedHandler;
    private renderedScale: { width: number, height: number };
    private refs: any;

    public set options(value: IChartOptions) {
        this.optionsInternal = value;
        this.colorizer = new Colorizer(
            value,
            this.valueMin,
            this.valueMid,
            this.valueMax,
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
        return (valueMin !== null && valueMin !== undefined) ? valueMin : this.options.data.valueDomain[0];
    }

    private get valueMax(): number {
        const valueMax = this.options.valueMax;
        return (valueMax !== null && valueMax !== undefined) ? valueMax : this.options.data.valueDomain[1];
    }

    private get valueMid() {
        const scoreSplit = this.options.scoreSplit;
        return (scoreSplit !== null && scoreSplit !== undefined) ? scoreSplit : (this.valueMax + this.valueMin) / 2;
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

    private get categoryOffsetStart(): number {
        const { rowHeight, data } = this;
        let categoryOffsetStart = Math.floor(this.scrollPosition / rowHeight);
        if (data.categories.length < categoryOffsetStart) {
            categoryOffsetStart = data.categories.length - this.maxCategories;
        }
        return categoryOffsetStart;
    }

    private get categoriesInView(): ICategory[] {
        const { data, categoryOffsetStart, maxCategories } = this;
        return data.categories.slice(categoryOffsetStart, categoryOffsetStart + maxCategories);
    }

    private get selections() {
        return this.options.selections;
    }

    private set selections(value) {
        this.options.selections = value;
    }

    private get numTicks() {
        return this.options.numTicks;
    }

    private get showValues() {
        return this.options.showValues;
    }

    private get showCategories() {
        return this.options.showCategories;
    }

    private get zoomLevel() {
        return this.options.zoomLevel;
    }

    public onSelectionChanged(handler: SelectionChangedHandler) {
        this.selectionChangedHandler = handler;
    }

    public render() {
        const {
            axisOffset,
            categoriesInView,
            highlightColor,
            rowHeight,
            width,
            height,
            element,
            data,
            rowGap,
        } = this;
        const isCategorySelected = (name: string) => !!this.selections[name];
        // 1 px vertical pad on top and bottom of text
        const categoryTextY = (d: IndexedCategory) =>
            (rowHeight * d.index) +
            (rowGap ? d.index : 0) +
            rowHeight - 1;

        const xScale = this.getXScale(data.positionDomain);
        const sliceWidth = this.sliceWidth(xScale);

        this.renderedScale = { width, height };
        element.innerHTML = "";

        /*
            * The zoom object allows the chart to be panned horizontally
            */
        const zoom = d3.zoom()
            .scaleExtent([1, 1])
            .on("zoom", () => {
                const max = this.width - (xScale(data.positionDomain[1]));
                const actual = d3.event.transform.x;
                const target = Math.min(0, Math.max(max, actual));
                const translate = `translate(${target})`;
                d3.select("g.time-axis").attr("transform", translate);
                d3.selectAll("g.category-chart").attr("transform", translate);
            });

        categoriesInView.forEach((c: IndexedCategory, idx) => c.index = idx);
        this.refs = render(d3.select(element),
            <svg
                call={zoom}
                selectionRef={(e: any) => this.svgSelection = e}
                height={height} width={width}
                on={{
                    "click": this.onClick.bind(this),
                    "wheel.scroll": this.onScroll.bind(this),
                }}
            >
                <Categories
                    axisOffset={axisOffset}
                    categoryValues={data.categoryValues}
                    xScale={xScale}
                    colorizer={(value: number) => this.colorizer.color(value).toString()}
                    categories={categoriesInView}
                    chartPercent={this.chartPercent}
                    textPercent={this.textPercent}
                    isCategorySelected={isCategorySelected}
                    rowHeight={rowHeight}
                    height={height}
                    highlightColor={highlightColor}
                    categoryTextY={categoryTextY}
                    width={width}
                    rebindText={(r: any) => this.categoryTextRebinder = r}
                    rebindChart={(r: any) => this.categoryChartRebinder = r}
                    rowGap={rowGap}
                    sliceWidth={sliceWidth}
                    numTicks={this.numTicks}
                    showValues={this.showValues}
                    showCategories={this.showCategories}
                />
            </svg>,
        );
    }

    private sliceWidth(xScale: (input: number | Date) => number): number {
        const { dateAggregation, numericAggregation } = this.options;
        const start = this.data.positionDomain[0];
        const isNumber = typeof start === "number";
        const end = isNumber ?
            (start as number) + numericAggregation :
            dateSliceEnd((start as Date), dateAggregation);
        return xScale(end) - xScale(start);
    }

    private rerender() {
        const {
            categoriesInView: categories,
        } = this;
        categories.forEach((c: IndexedCategory, idx) => c.index = idx);
        this.categoryChartRebinder((sel: any) => sel.data(categories, (d: ICategory) => d.name));
        this.categoryTextRebinder((sel: any) => sel.data(categories, (d: ICategory) => d.name));
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

    private getXScale(domain: XDomain): any {
        const rangeStart = this.showCategories ? this.width * this.textPercent : 0;
        const range = [rangeStart, this.width * this.zoomLevel];
        const isNumberDomain = typeof domain[0] === "number";
        if (isNumberDomain) {
            return d3.scaleLinear().domain(domain).range(range);
        } else {
            return d3.scaleTime().domain(domain).range(range);
        }
    }
}
