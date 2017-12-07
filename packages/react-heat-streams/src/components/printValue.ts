// tslint:disable-next-line no-var-requires
const isInteger = require('is-integer')

export default function printValue(v: number): string {
	if (v === null || v === undefined) {
		return ''
	}
	return isInteger(v) ? `${v}` : v.toFixed(2)
}
