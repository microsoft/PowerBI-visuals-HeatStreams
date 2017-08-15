/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
namespace essex.visuals.heatStreams.dataconvert {
    "use strict";
    import DateAggregation = essex.visuals.heatStreams.DateAggregation;

    export function addHours(date: Date, num: number): Date {
        const result = new Date(date);
        result.setUTCHours(result.getUTCHours() + num);
        return result;
    }

    export function addDays(date: Date, num: number): Date {
        const result = new Date(date);
        result.setUTCDate(result.getUTCDate() + num);
        return result;
    }

    export function addMonths(date: Date, num: number): Date {
        const result = new Date(date);
        result.setUTCMonth(result.getUTCMonth() + num);
        return result;
    }

    export function addYears(date: Date, num: number): Date {
        const result = new Date(date);
        result.setUTCFullYear(result.getUTCFullYear() + num);
        return result;
    }

    export function dateSliceEnd(start: Date, dateAggregation: DateAggregation): Date {
        if (dateAggregation === "hours") {
            return addHours(start, 1);
        } else if (dateAggregation === "days") {
            return addDays(start, 1);
        } else if (dateAggregation === "months") {
            return addMonths(start, 1);
        } else if (dateAggregation === "years") {
            return addYears(start, 1);
        } else {
            throw new Error("unknown aggregation: " + dateAggregation);
        }
    }
}
