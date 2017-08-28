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
            const { colorScheme } = this.options;

            // Set up the value scalers
            this.scaler = this.isDiverging ?
                new DivergingScaler(d3, valueMin, valueMid, valueMax, isLogScaled) :
                new LinearScaler(d3, valueMin, valueMax, isLogScaled);

            // Set up the color scale
            if (CATEGORICAL[colorScheme]) {
                this.colorScale = d3.scaleOrdinal(d3[`scheme${colorScheme}`]);
            } else {
                this.colorScale = d3.scaleSequential(d3[`interpolate${colorScheme}`]);
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
}
