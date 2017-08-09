module essex.visuals.heatStreams {
    const d3: any = window['d3'];
    const { Select, Enter, Exit, Update, Grouping } = d3.jsx;
    
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
        sliceWidth: number;
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
            height: rowHeight,
            width: props.sliceWidth,
            x: (d: ValueSlice) => xScale(d.start),
            y: (d: ValueSlice, i: number, e: any) => {
                const catIndex = e[i].parentNode.__data__.index;
                return rowHeight * catIndex + (rowGap ? catIndex : 0);
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
        isCategorySelected: boolean;
        categoryTextY: (d: IndexedCategory) => number;
    }

    export const CategoryText = ({
        isCategorySelected,
        categoryTextY,
        rowHeight,
    }: CategoryProps) => {
        const renderProps = {
            'font-size': `${rowHeight - 2}px`,
            'font-weight': (d: IndexedCategory) => isCategorySelected(d.name) ? 'bold' : 'normal',
            'text': (d: Category) => d.name,
            'x': 2,
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
        rowGap,
    }: CategoryProps) => {
        const renderProps = {
            'height': rowHeight,
            'shape-rendering': "geometricPrecision",
            'stroke': highlightColor,
            'stroke-width': (d: IndexedCategory) => isCategorySelected(d.name) ? 1 : 0,
            'width': width - 2,
            'x': 1,
            'y': (d: IndexedCategory) => rowHeight * d.index + (rowGap ? d.index : 0),
            'z-index': 1,
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
        rowGap,
    }: CategoryProps) => {
        const renderProps = {
            height: rowHeight,
            width: Math.floor(width * chartPercent),
            x: width * textPercent,
            y: (d: IndexedCategory) => rowHeight * d.index + (rowGap ? d.index : 0),
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
            </Grouping>
        );
    };
}