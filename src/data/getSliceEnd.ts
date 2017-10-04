import { IChartOptions } from "../chart/interfaces";
import { dateSliceEnd } from "./dateUtils";

export default function getSliceEnd(
  start: Date | number,
  options: IChartOptions,
) {
  const isNumber = typeof start === "number";
  return isNumber ?
    (start as number) + options.numericAggregation :
    dateSliceEnd((start as Date), options.dateAggregation);
}
