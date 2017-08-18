namespace essex.visuals.heatStreams {
    const d3: any = (window as any).d3;
    const { Select, Enter, Exit, Update, Grouping } = d3.jsx;

    function printValue(v: number): string {
        if (v === null || v === undefined) {
            return "";
        }
        return Number.isInteger(v) ? `${v}` : v.toFixed(2);
    }

    export interface IndexedCategory extends ICategory {
        index: number;
    }
    export interface IndexedValueSlice extends IValueSlice {
        catIndex: number;
    }

    export interface ITimeAxisProps {
        axisOffset: number;
        xScale: d3.ScaleTime<number, number>;
    }
    /**
     * The Time Axis Component
     */
    export const TimeAxis = ({ axisOffset, xScale }: ITimeAxisProps) => (
        <g
            transform={`translate(0, ${axisOffset})`}
            call={d3.axisBottom(xScale)}
        />
    );

    export interface IValueProps {
        xScale: d3.ScaleTime<number, number>;
        rowHeight: number;
        colorizer: (value: number) => string;
        rowGap: boolean;
        sliceWidth: number;
    }

    export interface IValuesProps extends IValueProps {
        categoryValues: ICategoryValueMap;
    }

    export const Values = (props: IValuesProps) => {
        const {
            categoryValues,
            colorizer,
            xScale,
            rowHeight,
            rowGap,
        } = props;

        const renderProps = {
            "data-value": (d: IValueSlice) => d.value,
            "fill": (d: IValueSlice) => colorizer(d.value),
            "height": rowHeight,
            "shape-rendering": "crispEdges",
            "stroke": "none",
            "width": props.sliceWidth,
            "x": (d: IValueSlice) => xScale(d.start),
            "y": (d: IValueSlice, i: number, e: any) => {
                const catIndex = e[i].parentNode.__data__.index;
                return rowHeight * catIndex + (rowGap ? catIndex : 0);
            },
        };
        return (
            <Select all selector="rect.value-run" data={(d: IndexedCategory) => categoryValues[d.id]}>
                <Enter append="rect" class="value-run" {...renderProps}>
                    <title>{(d) => printValue(d.value)}</title>
                </Enter>
                <Update {...renderProps}>
                    <title>{(d) => printValue(d.value)}</title>
                </Update>
                <Exit remove />
            </Select>
        );
    };

    export interface ICategoryTextProps {
        isCategorySelected: boolean;
        categoryTextY: (d: IndexedCategory) => number;
    }

    export const CategoryText = ({
        isCategorySelected,
        categoryTextY,
        rowHeight,
    }: ICategoryProps) => {
        const renderProps = {
            "font-size": `${rowHeight - 2}px`,
            "font-weight": (d: IndexedCategory) => isCategorySelected(d.name) ? "bold" : "normal",
            "text": (d: ICategory) => d.name,
            "x": 2,
            "y": categoryTextY,
        };
        return (
            <Select all selector="text.category-text" data={(d: ICategory) => [d]}>
                <Enter append="text" class="category-text" fill="black" {...renderProps} />
                <Update {...renderProps} />
                <Exit remove />
            </Select>
        );
    };

    export const CategoryView = ({
        rowHeight,
        highlightColor,
        width,
        isCategorySelected,
        rowGap,
    }: ICategoryProps) => {
        const renderProps = {
            "height": rowHeight,
            "shape-rendering": "geometricPrecision",
            "stroke": highlightColor,
            "stroke-width": (d: IndexedCategory) => isCategorySelected(d.name) ? 1 : 0,
            "width": width - 2,
            "x": 1,
            "y": (d: IndexedCategory) => rowHeight * d.index + (rowGap ? d.index : 0),
            "z-index": 1,
        };
        return (
            <Select all selector="rect.category-view" data={(d: ICategory) => [d]}>
                <Enter append="rect" class="category-view" fill="none" {...renderProps} />
                <Update {...renderProps} />
                <Exit remove />
            </Select>
        );
    };

    export const CategoryChart = ({
        rowHeight,
        width,
        chartPercent,
        textPercent,
        rowGap,
    }: ICategoryProps) => {
        const renderProps = {
            height: rowHeight,
            width: Math.floor(width * chartPercent),
            x: width * textPercent,
            y: (d: IndexedCategory) => rowHeight * d.index + (rowGap ? d.index : 0),
        };
        return (
            <Select all selector="rect.category-chart" data={(d: ICategory) => [d]}>
                <Enter append="rect" class="category-chart" fill="none" {...renderProps} />
                <Update {...renderProps} />
                <Exit remove />
            </Select>
        );
    };

    export interface ICategoryProps {
        xScale: d3.ScaleTime<number, number>;
        rowHeight: number;
        width: number;
        highlightColor: string;
        chartPercent: number;
        textPercent: number;
        colorizer: (value: number) => string;
        categoryValues: ICategoryValueMap;
        isCategorySelected: (category: string) => boolean;
        categoryTextY: (d: ICategory, index: number) => number;
        rebind: any;
        rowGap: boolean;
    }

    export interface ICategoriesProps extends ICategoryProps {
        categories: ICategory[];
    }

    export const Categories = (props: ICategoriesProps) => {
        const chartContent = (
            <Grouping>
                <CategoryText {...props} />
                <CategoryChart {...props} />
                <Values {...props} />
                <CategoryView {...props} />
            </Grouping>
        );
        return (
            <Grouping>
                <Select
                    all
                    selector=".category"
                    selectionRef="categories"
                    data={props.categories}
                    data-key={(d: ICategory) => d.name}
                    rebind={props.rebind}
                >
                    <Enter>
                        <g
                            selectionRef="categoryGroup"
                            class="category"
                            each={(d: IndexedCategory, i: number) => d.index = i}>
                            {chartContent}
                        </g>
                    </Enter>
                    <Update each={(d: IndexedCategory, i: number) => d.index = i}>
                        {chartContent}
                    </Update>
                    <Exit remove />
                </Select>
            </Grouping>
        );
    };
}
