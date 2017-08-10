import DivergingScaler from  "../src/chart/DivergingScaler";
import * as d3 from 'd3';

describe("The diverging value scaler", () => {
    it("exists", () => {
        const scaler = new DivergingScaler(
            d3, 0, 500, 1000, false,
        );
        expect(scaler).toBeTruthy();
    });

    it("can scale values linearly", () => {
        const scaler = new DivergingScaler(
            d3, 0, 500, 1000, false,
        );
        expect(scaler.scale(1000)).toBe(1.0);
        expect(scaler.scale(750)).toBeCloseTo(0.75);
        expect(scaler.scale(500)).toBeCloseTo(0.5);
        expect(scaler.scale(250)).toBeCloseTo(0.25);
        expect(scaler.scale(0)).toBeCloseTo(0);
    });

    it("can scale values logarithmically", () => {
        const scaler = new DivergingScaler(
            d3, 0, 500, 1000, true,
        );
        expect(scaler.scale(1000)).toBe(1.0);
        expect(scaler.scale(750)).toBeGreaterThan(0.75);
        expect(scaler.scale(750)).toBeLessThan(1.0);
        expect(scaler.scale(500)).toBeCloseTo(0.5);
        expect(scaler.scale(250)).toBeLessThan(0.25);
        expect(scaler.scale(250)).toBeGreaterThan(0);
        expect(scaler.scale(0)).toBeCloseTo(0);

        const diffUpper = 1 - scaler.scale(750);
        const diffLower = scaler.scale(250);
        expect(diffUpper).toBeCloseTo(diffLower);
    });

    it("can scale values linearly around an asymettric split-point", () => {
        const scaler = new DivergingScaler(
            d3, 0, 750, 1000, false,
        );
        expect(scaler.scale(1000)).toBe(1.0);
        expect(scaler.scale(750)).toBeCloseTo(0.5);
        expect(scaler.scale(375)).toBeCloseTo(0.25);
        expect(scaler.scale(187.5)).toBeCloseTo(0.125);
        expect(scaler.scale(0)).toBeCloseTo(0);
    });

    it("can scale values logarithmically around an asymettric split-point", () => {
        const scaler = new DivergingScaler(
            d3, 0, 750, 1000, true,
        );
        expect(scaler.scale(1000)).toBe(1.0);
        expect(scaler.scale(750)).toBeCloseTo(0.5);
        expect(scaler.scale(375)).toBeLessThan(scaler.scale(750));
        expect(scaler.scale(187.5)).toBeLessThan(scaler.scale(375));
        expect(scaler.scale(0)).toBeCloseTo(0);
    });
});