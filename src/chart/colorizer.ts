module essex.visuals.gantt {
    const d3: any = window['d3'];
    const VALUE_DOMAIN = [0.1, 1000];
    const DIVERGENT_VALUE_DOMAIN = [0.1, 500, 1000];
    
    // NOTE: The coloring uses the "Diverging" HCL Pattern described here
    // http://hclwizard.org:64230/hclwizard/
    export class Colorizer {
        private minHcl: d3.HCLColor;
        private maxHcl: d3.HCLColor;
        private valueScale: d3.ScaleLinear<number, number>;
        private chroma: d3.ScaleLinear<number, number>;
        private luminance: d3.ScaleLinear<number, number>;

        private get valueMid(): number {
            return (this.valueMax + this.valueMin) / 2;
        }

        private get chromaMin() {
            return this.options.chromaMin;
        }

        private get chromaMax() {
            return this.options.chromaMax;
        }

        private get luminanceMin() {
            return this.options.luminanceMin;
        }

        private get luminanceMax() {
            return this.options.luminanceMax;
        }

        private getChromaScale() {
            const { isDivergent, chromaMin, chromaMax } = this;
            const domain = isDivergent ? DIVERGENT_VALUE_DOMAIN : VALUE_DOMAIN;
            const range = isDivergent ? [chromaMax, chromaMin, chromaMax] : [chromaMin, chromaMax];
            return ((this.isLogScaled ? d3.scaleLog() : d3.scaleLinear())
                .domain(domain)
                .range(range)
                .clamp(true));
        }

        private getLuminanceScale() {
            const { isDivergent, luminanceMin, luminanceMax } = this;
            const domain = isDivergent ? DIVERGENT_VALUE_DOMAIN : VALUE_DOMAIN;
            const range = isDivergent ? [luminanceMin, luminanceMax, luminanceMin] : [luminanceMax, luminanceMin];
            return ((this.isLogScaled ? d3.scaleLog() : d3.scaleLinear())
                .domain(domain)
                .range(range)
                .clamp(true));
        }

        constructor(
            private options: VisualRenderingOptions, 
            private valueMin, 
            private valueMax, 
            private isDivergent,
            private isLogScaled,
        ) {
            const {
                negativeColor,
                positiveColor,
            } = this.options;
            this.minHcl = d3.hcl(negativeColor);
            this.maxHcl = d3.hcl(positiveColor);
            this.chroma = this.getChromaScale();
            this.luminance = this.getLuminanceScale();
            this.valueScale = d3.scaleLinear().domain([valueMin, valueMax]).range([0.1, 1000]).clamp(true);
        }

        public color(value: number): d3.HCLColor {
            const sanitized = this.valueScale(value);
            const h = this.hue(sanitized);
            const c = this.chroma(sanitized);
            const l = this.luminance(sanitized);
            return d3.hcl(h, c, l);
        }

        private hue(value: number) {
            if (!this.isDivergent) {
                return this.maxHcl.h;
            } else {
                return value < this.valueMid ? this.minHcl.h : this.maxHcl.h;
            }
        }
    }
}
