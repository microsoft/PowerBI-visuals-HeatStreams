export default function printValue(v: number): string {
	if (v === null || v === undefined) {
		return ''
	}
	return Number.isInteger(v) ? `${v}` : v.toFixed(2)
}
