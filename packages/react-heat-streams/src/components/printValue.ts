/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export default function printValue(v: number): string {
	if (v === null || v === undefined) {
		return ''
	}
	return Number.isInteger(v) ? `${v}` : v.toFixed(2)
}
