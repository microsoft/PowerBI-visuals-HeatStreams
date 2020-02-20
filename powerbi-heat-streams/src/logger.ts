/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export enum LogLevel {
	NONE = 0,
	ERROR = 1,
	INFO = 2,
	DEBUG = 3,
}

function getLogLevel(): number {
	if ((window as any)['logLevel'] === undefined) {
		return LogLevel.ERROR
	} else {
		return (window as any)['logLevel']
	}
}

export function setLevel(level: LogLevel): void {
	console.log('Set Log Level to ', level)
	;(window as any)['logLevel'] = level
}

export function info(message: string, ...args: any[]): void {
	if (getLogLevel() >= LogLevel.INFO) {
		console.log(message, ...args)
	}
}

export function debug(message: string, ...args: any[]): void {
	if (getLogLevel() >= LogLevel.DEBUG) {
		console.debug(message, ...args)
	}
}

export function error(message: string, ...args: any[]): void {
	if (getLogLevel() >= LogLevel.ERROR) {
		console.error(message, ...args)
	}
}
