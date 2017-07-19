module essex.visuals.gantt {
    const d3: any = window['d3'];
    const D3Components: any = window['D3Components'];

    const { Select, Enter, Exit, Update, Grouping } = D3Components;

    export interface IndexedCategory extends Category {
        index: number;
    }
    export interface IndexedValueSlice extends ValueSlice {
        catIndex: number;
    }

    export interface TimeAxisProps {
        axisOffset: number;
        xScale: d3.ScaleTime<number, number>;
    }
    /**
     * The Time Axis Component
     */
    export const TimeAxis = ({ axisOffset, xScale }: TimeAxisProps) => (
        <g
            transform={`translate(0, ${axisOffset})`}
            call={d3.axisBottom(xScale)}
        />
    );

    export interface ValueProps {
        xScale: d3.ScaleTime<number, number>;
        rowHeight: number;
        colorizer: (value: number) => string;
        rowGap: boolean;
    }

    export interface ValuesProps extends ValueProps {
        categoryValues: CategoryValueMap;
    }

    export const Values = (props: ValuesProps) => {
        const {
            categoryValues,
            colorizer,
            xScale,
            rowHeight,
            rowGap,
        } = props;

        const renderProps = {
            'data-value': (d: ValueSlice) => d.value,
            fill: (d: ValueSlice) => colorizer(d.value),
            'shape-rendering': "crispEdges",
            stroke: 'none',
            height: rowGap ? rowHeight - 1 : rowHeight,
            width: (d: ValueSlice) => xScale(d.end) - xScale(d.start),
            x: (d: ValueSlice) => xScale(d.start),
            y: (d: ValueSlice, i: number, e: any) => {
                const catIndex = e[i].parentNode.__data__.index;
                return rowHeight * catIndex;
            },
        };
        return (
            <Select all selector='rect.value-run' data={(d: IndexedCategory) => categoryValues[d.id]}>
                <Enter append="rect" class="value-run" {...renderProps}>
                    <title>{d => d.value.toFixed(2)}</title>
                </Enter>
                <Update {...renderProps}>
                    <title>{d => d.value.toFixed(2)}</title>
                </Update>
                <Exit remove />
            </Select>
        );
    };

    export interface CategoryTextProps {
        fontSize: number;
        isCategorySelected: boolean;
        categoryTextY: (d: IndexedCategory) => number;
    }

    export const CategoryText = ({
        fontSize,
        isCategorySelected,
        categoryTextY,
    }: CategoryProps) => {
        const renderProps = {
            'font-size': `${fontSize}px`,
            'font-weight': (d: IndexedCategory) => isCategorySelected(d.name) ? 'bold' : 'normal',
            'text': (d: Category) => d.name,
            'y': categoryTextY,
        };
        return (
            <Select all selector='text.category-text' data={(d: Category) => [d]}>
                <Enter append='text' class='category-text' fill='black' {...renderProps} />
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
    }: CategoryProps) => {
        const renderProps = {
            'height': rowHeight,
            'stroke': highlightColor,
            'stroke-width': (d: IndexedCategory) => isCategorySelected(d.name) ? 1 : 0,
            'width': width - 2, // reserve 2px for border select
            'y': (d: IndexedCategory) => rowHeight * d.index,
        };
        return (
            <Select all selector="rect.category-view" data={(d: Category) => [d]}>
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
    }: CategoryProps) => {
        const renderProps = {
            height: rowHeight,
            width: Math.floor(width * chartPercent) - 1,
            x: width * textPercent,
            y: (d: IndexedCategory) => rowHeight * d.index,
        };
        return (
            <Select all selector="rect.category-chart" data={(d: Category) => [d]}>
                <Enter append="rect" class="category-chart" fill='none' {...renderProps} />
                <Update {...renderProps} />
                <Exit remove />
            </Select>
        );
    };

    export interface CategoryProps {
        xScale: d3.ScaleTime<number, number>;
        rowHeight: number;
        width: number;
        fontSize: number;
        highlightColor: string;
        chartPercent: number;
        textPercent: number;
        colorizer: (value: number) => string;
        categoryValues: CategoryValueMap;
        isCategorySelected: (category: string) => boolean;
        categoryTextY: (d: Category, index: number) => number;
        rebind: any;
        rowGap: boolean;
    }

    export interface CategoriesProps extends CategoryProps {
        categories: Category[];
    }

    export const Categories = (props: CategoriesProps) => {
        const chartContent = (
            <Grouping>
                <CategoryView
                    rowHeight={props.rowHeight}
                    highlightColor={props.highlightColor}
                    width={props.width}
                    isCategorySelected={props.isCategorySelected}
                />
                <CategoryText
                    fontSize={props.fontSize}
                    isCategorySelected={props.isCategorySelected}
                    categoryTextY={props.categoryTextY}
                />
                <CategoryChart
                    rowHeight={props.rowHeight}
                    width={props.width}
                    chartPercent={props.chartPercent}
                    textPercent={props.textPercent}
                />
                <Values {...props} />
            </Grouping>
        );
        return (
            <Select
                all
                selector=".category"
                selectionRef="categories"
                data={props.categories}
                data-key={(d: Category) => d.name}
                rebind={props.rebind}
            >
                <Enter>
                    <g selectionRef="categoryGroup" class="category" each={(d: IndexedCategory, i: number) => d.index = i}>
                        {chartContent}
                    </g>
                </Enter>
                <Update each={(d: IndexedCategory, i: number) => d.index = i}>
                    {chartContent}
                </Update>
                <Exit remove />
            </Select>
        );
    };
}