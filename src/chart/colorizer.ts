namespace essex.visuals.heatStreams {
    const d3: any = (window as any).d3;

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

    // NOTE: The coloring uses the "Diverging" HCL Pattern described here
    // http://hclwizard.org:64230/hclwizard/
    export class Colorizer {
        private scaler: any;
        private colorScale: d3.ScaleSequential<string>;

        constructor(
            private options: IChartOptions,
            valueMin,
            valueMid,
            valueMax,
        ) {
            const isLogScaled = options.isLogScale;

            // Set up the value scalers
            this.scaler = this.isDiverging ?
                new DivergingScaler(d3, valueMin, valueMid, valueMax, isLogScaled) :
                new LinearScaler(d3, valueMin, valueMax, isLogScaled);

            // Set up the color scale
            const colorInterpolator = d3[`interpolate${this.options.colorScheme}`];
            this.colorScale = d3.scaleSequential(colorInterpolator);
        }

        private get isDiverging() {
            return DIVERGING_SCHEMES[this.options.colorScheme];
        }

        public color(value: number) {
            return this.colorScale(this.scaler.scale(value));
        }
    }
}
