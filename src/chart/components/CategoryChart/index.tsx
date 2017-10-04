import * as React from "react";
import {
  ICategory,
  IColorizer,
  IScaler,
  IValueSlice,
} from "../../interfaces";
import printValue from "../printValue";
import CategoryView from "./CategoryView";
import ValueRun from "./ValueRun";
import ValueText from "./ValueText";

export interface ICategoryChartProps {
  category: ICategory;
  categoryData: IValueSlice[];
  colorizer: IColorizer;
  xScale: IScaler;
  rowHeight: number;
  showValues: boolean;
  width: number;
  highlightColor: string;
  selected: boolean;
  y: number;
  sliceWidth: number;
}

const CategoryChart = ({
  category,
  categoryData,
  colorizer,
  xScale,
  rowHeight,
  showValues,
  width,
  highlightColor,
  selected,
  y,
  sliceWidth,
}: ICategoryChartProps) => (
  <g className="category-chart">
    <CategoryView
      selected={selected}
      highlightColor={highlightColor}
      width={width}
      height={rowHeight}
      y={y}
    />
    {
      categoryData.map((cd) => [
        <ValueRun
          key={`cdv:${cd.start}`}
          color={colorizer(cd.value)}
          height={rowHeight}
          title={printValue(cd.value)}
          width={sliceWidth}
          x={xScale(cd.start)}
          y={y}
          value={cd.value}
        />,
        (showValues ? <ValueText
          key={`cdt:${cd.start}`}
          rowHeight={rowHeight}
          text={printValue(cd.value)}
          x={xScale(cd.start) + 2}
          y={y}
        /> : null),
      ])
    }
  </g>
);

export default CategoryChart;
