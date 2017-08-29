/**
 * The domain of normalized values. Avoid zero so that log-scaling situations won't explode.
 */
const MIN = 0.000001;
const MID = 0.5;
const MAX = 1;

namespace essex.visuals.heatStreams {
    export class DivergingScaler {
        private valueSanitizerPos: d3.ScaleLinear<number, number>;
        private valueSanitizerNeg: d3.ScaleLinear<number, number>;
        private logScalerPos: d3.ScaleLogarithmic<number, number>;
        private logScalerNeg: d3.ScaleLogarithmic<number, number>;
        private linearScalerPos: d3.ScaleLinear<number, number>;
        private linearScalerNeg: d3.ScaleLinear<number, number>;

        constructor(
            d3: any,
            valueMin,
            private valueMid: number,
            valueMax,
            private isLogScaled: boolean,
        ) {
            // Sanitizes incoming positive values onto a range of 0-1
            this.valueSanitizerPos = d3.scaleLinear().domain([valueMid, valueMax]).range([MIN, MAX]).clamp(true);
            // Sanitizes incoming negative values to a range of 0-1 (lowest value correstponds to 1)
            this.valueSanitizerNeg = d3.scaleLinear().domain([valueMin, valueMid]).range([MAX, MIN]).clamp(true);

            // Log scales sanitized values onto a domain from 0-1
            this.logScalerPos = d3.scaleLog().domain([MIN, MAX]).range([MID, MAX]);
            this.logScalerNeg = d3.scaleLog().domain([MIN, MAX]).range([MID, MIN]);

            // Linearly scales sanitized values ont a domain from 0-1.
            this.linearScalerPos = d3.scaleLinear().domain([MIN, MAX]).range([MID, MAX]);
            this.linearScalerNeg = d3.scaleLinear().domain([MIN, MAX]).range([MID, MIN]);
        }

        public scale(value: number) {
            if (value === null) {
                return value;
            }
            const isPos = value > this.valueMid;
            return isPos ?
                this.scalePos(value) :
                this.scaleNeg(value);
        }

        private scalePos(value: number) {
            const sanitized = this.valueSanitizerPos(value);
            return this.isLogScaled ?
                this.logScalerPos(sanitized) :
                this.linearScalerPos(sanitized);
        }

        private scaleNeg(value: number) {
            const sanitized = this.valueSanitizerNeg(value);
            return this.isLogScaled ?
                this.logScalerNeg(sanitized) :
                this.linearScalerNeg(sanitized);
        }
    }
}
