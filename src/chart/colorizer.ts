module essex.visuals.heatStreams {
    const d3: any = window['d3'];
    /**
     * The domain of normalized values. Avoid zero so that log-scaling situations won't explode.
     */
    const VALUE_DOMAIN = [0.0001, 1];

    // NOTE: The coloring uses the "Diverging" HCL Pattern described here
    // http://hclwizard.org:64230/hclwizard/
    export class Colorizer {
        private valueSanitizer: d3.ScaleLinear<number, number>;
        private logScaler: d3.ScaleLogarithmic<number, number>;
        private colorScale: d3.ScaleSequential<string>;
        private valueMid: number;

        constructor(
            options: VisualRenderingOptions,
            private valueMin: number,
            private valueMax: number,
            private isLogScaled: boolean,
        ) {
            this.valueMid = (this.valueMax + this.valueMin) / 2;
            this.valueSanitizer = d3.scaleLinear().domain([valueMin, valueMax]).range(VALUE_DOMAIN).clamp(true);
            this.logScaler = d3.scaleLog().domain(VALUE_DOMAIN).range(VALUE_DOMAIN);

            const colorInterpolator = d3[`interpolate${options.colorScheme}`];
            this.colorScale = d3.scaleSequential(colorInterpolator);
        }

        private sanitize(value: number) {
            let result = this.valueSanitizer(value);
            return this.isLogScaled ? this.logScaler(result) : result;
        }

        public color(value: number) {
            const v = this.sanitize(value);
            const color = this.colorScale(v);
            return color;
        }
    }
}
