/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum LogLevel {
	NONE = 0,
	ERROR = 1,
	INFO = 2,
	DEBUG = 3,
}

function getLogLevel() {
	if (window['logLevel'] === undefined) {
		return LogLevel.ERROR
	} else {
		return window['logLevel']
	}
}

export function setLevel(level: LogLevel) {
	console.log('Set Log Level to ', level)
	window['logLevel'] = level
}

export function info(message: string, ...args) {
	if (getLogLevel() >= LogLevel.INFO) {
		console.log(message, ...args)
	}
}

export function debug(message: string, ...args) {
	if (getLogLevel() >= LogLevel.DEBUG) {
		console.debug(message, ...args)
	}
}

export function error(message: string, ...args) {
	if (getLogLevel() >= LogLevel.ERROR) {
		console.error(message, ...args)
	}
}
