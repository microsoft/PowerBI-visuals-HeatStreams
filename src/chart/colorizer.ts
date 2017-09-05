import * as d3 from "d3";
import * as scaleChromatic from "d3-scale-chromatic";
import DivergingScaler from "./DivergingScaler";
import { IChartOptions } from "./interfaces";
import LinearScaler from "./LinearScaler";

/**
 * The domain of normalized values. Avoid zero so that log-scaling situations won't explode.
 */
const DIVERGING_SCHEMES = {
    BrBG: true,
    PRGn: true,
    PiYG: true,
    PuOr: true,
    RdBu: true,
    RdGy: true,
    RdYlBu: true,
    RdYlGn: true,
    Spectral: true,
};

const CATEGORICAL = {
    Accent: true,
    Dark2: true,
    Paired: true,
    Pastel1: true,
    Pastel2: true,
    Set1: true,
    Set2: true,
    Set3: true,
};

// NOTE: The coloring uses the "Diverging" HCL Pattern described here
// http://hclwizard.org:64230/hclwizard/
export default class Colorizer {
    private scaler: any;
    private colorScale: any;

    constructor(
        private options: IChartOptions,
        valueMin,
        valueMid,
        valueMax,
    ) {
        const isLogScaled = options.isLogScale;
        const { colorScheme } = this.options;

        // Set up the value scalers
        this.scaler = this.isDiverging ?
            new DivergingScaler(d3, valueMin, valueMid, valueMax, isLogScaled) :
            new LinearScaler(d3, valueMin, valueMax, isLogScaled);

        // Set up the color scale
        if (CATEGORICAL[colorScheme]) {
            const interpolator = `scheme${colorScheme}`;
            this.colorScale = d3.scaleOrdinal(scaleChromatic[interpolator]);
        } else {
            const interpolator = `interpolate${colorScheme}`;
            this.colorScale = d3.scaleSequential(scaleChromatic[interpolator]);
        }
    }

    private get isDiverging() {
        return DIVERGING_SCHEMES[this.options.colorScheme];
    }

    public color(value: number) {
        const scaled = this.scaler.scale(value);
        return this.colorScale(scaled);
    }
}
