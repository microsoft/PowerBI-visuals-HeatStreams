// tslint:disable no-var-requires
import * as d3 from "d3";
import {
    createElement,
    Enter,
    Exit,
    Grouping,
    Select,
    Update,
} from "d3-jsx";
import {
    ICategory,
    ICategoryValueMap,
    IndexedCategory,
    IValueSlice,
} from "./interfaces";

const capitalize = require("lodash/capitalize");

const SLICE_WIDTH_WITH_TEXT_MIN_WIDTH = 35;

// Polyfill for IE11
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Number.isInteger =
    Number.isInteger ||
    ((value: any) => (typeof value === "number" && isFinite(value) && Math.floor(value) === value));

function printValue(v: number): string {
    if (v === null || v === undefined) {
        return "";
    }
    return Number.isInteger(v) ? `${v}` : v.toFixed(2);
}

export interface ITimeAxisProps {
    axisOffset: number;
    numTicks: number;
    xScale: d3.ScaleTime<number, number>;
}
/**
 * The Time Axis Component
 */
export const TimeAxis = ({ axisOffset, xScale, numTicks }: ITimeAxisProps) => {
    const axis = d3.axisBottom(xScale);
    axis.ticks(numTicks);
    return (
        <g class="time-axis" selectionRef="timeAxis">
            <g class="time-axis-point"
                transform={`translate(0, ${axisOffset})`}
                call={axis}
            />
        </g>
    );
};

export interface IValueProps {
    xScale: d3.ScaleTime<number, number>;
    rowHeight: number;
    colorizer: (value: number) => string;
    rowGap: boolean;
    sliceWidth: number;
}

export interface IValuesProps extends IValueProps {
    categoryValues: ICategoryValueMap;
    showValues: boolean;
}

export const ValueRun = (props) => {
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

export const ValueText = (props: IValuesProps) => {
    const {
        categoryValues,
        xScale,
        rowHeight,
        rowGap,
        sliceWidth,
    } = props;

    const fontSize = rowHeight - 4;
    const renderProps = {
        "font-size": `${fontSize}px`,
        "x": (d: IValueSlice) => xScale(d.start) + 2,
        "y": (d: IValueSlice, i: number, e: any) => {
            const catIndex = e[i].parentNode.__data__.index;
            return (rowHeight * catIndex) + fontSize + (rowGap ? catIndex : 0);
        },
    };

    return (
        <Select all
            selector="text.value-text"
            data={(d: IndexedCategory) => categoryValues[d.id].filter((v) => {
                return sliceWidth > SLICE_WIDTH_WITH_TEXT_MIN_WIDTH;
            })}
        >
            <Enter
                append="text"
                class="value-text"
                {...renderProps}
                text={(d) => printValue(d.value)}
            />
            <Update
                {...renderProps}
                text={(d) => printValue(d.value)}
            />
            <Exit remove />
        </Select>
    );
};

export const Values = (props: IValuesProps) => {
    const { showValues } = props;
    const children = [,
    ];
    if (showValues) {
        children.push(<ValueText {...props} />);
    }

    if (showValues) {
        return (
            <Grouping children={children}>
                <ValueRun {...props} />
                <ValueText {...props} />
            </Grouping>
        );
    } else {
        return (
            <Grouping children={children}>
                <ValueRun {...props} />
            </Grouping>
        );
    }
};

export const CategoryView = ({
    rowHeight,
    highlightColor,
    width,
    isCategorySelected,
    rowGap,
}: ICategoryProps) => {
    const renderProps = {
        "data-cat": (d: IndexedCategory) => d.name,
        "stroke-width": (d: IndexedCategory) => isCategorySelected(d.name) ? 1 : 0,
        "y": (d: IndexedCategory) => rowHeight * d.index + (rowGap ? d.index : 0),
    };
    return (
        <Select all selector="rect.category-view" data={(d: ICategory) => [d]}>
            <Enter
                append="rect"
                class="category-view"
                fill="none"
                height={rowHeight}
                shape-rendering="geometricPrecision"
                stroke={highlightColor}
                width={width - 2}
                x={1}
                z-index={1}
                {...renderProps}
            />
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
    rebindText: any;
    rebindChart: any;
    rowGap: boolean;
}

export interface ICategoriesProps extends ICategoryProps, IValuesProps {
    categories: ICategory[];
    axisOffset: number;
    height: number;
    numTicks: number;
    showCategories: boolean;
}

export const CategoryCharts = (props: ICategoriesProps) => {
    const content = (
        <Grouping>
            <Values {...props } />
            <CategoryView {...props} />
        </Grouping>
    );
    return (
        <Grouping>
            <Select
                all
                selector="g.category-chart"
                data={props.categories}
                data-key={(d: ICategory) => d.name}
                rebind={props.rebindChart}
            >
                <Enter>
                    <g class="category-chart" selectionRef="categoryChart">
                        {content}
                    </g>
                </Enter>
                <Update>
                    {content}
                </Update>
                <Exit remove />
            </Select>
        </Grouping>
    );
};

export const CategoryTexts = (props: ICategoriesProps) => {
    const {
        rowHeight,
        categoryTextY,
        isCategorySelected,
        showCategories,
    } = props;

    const updateProps = {
        "font-weight": (d: IndexedCategory) => isCategorySelected(d.name) ? "bold" : "normal",
        "text": (d: ICategory) => d.name,
        "y": categoryTextY,
    };
    const titleContent = (d: ICategory) => {
        return Object
            .keys(d.metadata)
            .reduce((prev, current) => `${prev}\n${capitalize(current)}: ${printValue(d.metadata[current])}`, "");
    };
    return (
        <Grouping>
            <Select
                all
                selector="text.category-text"
                data={props.categories}
                data-key={(d: ICategory) => d.name}
                rebind={props.rebindText}
            >
                <Enter>
                    <text class="category-text"
                        fill="black"
                        font-size={`${rowHeight - 2}px`}
                        x={2}
                        {...updateProps}
                    >
                        <title>{showCategories ? titleContent : ""}</title>
                    </text>
                </Enter>
                <Update {...updateProps} />
                <Exit remove />
            </Select>
        </Grouping>
    );
};

export const Categories = (props: ICategoriesProps) => (
    <g class="category-list" selectionRef="categoryList">
        <g class="category-charts">
            <CategoryCharts {...props} />
        </g>
        <TimeAxis {...props} />
        { props.showCategories ? (
            <g>
                <rect
                    class="occluder"
                    width={props.width * props.textPercent}
                    height="100%"
                    fill="white"
                />
                <g class="category-texts">
                    <CategoryTexts {...props} />
                </g>
            </g>
        ) : (<g></g>)
        }
    </g>
);
