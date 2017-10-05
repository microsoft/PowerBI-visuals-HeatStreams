import { SCRUB, SCRUB_CLEAR } from '../actions'

export type ScrubState = Array<number | Date>

export default function reduce(state = null, action) {
	if (action.type === SCRUB) {
		return action.payload
	} else if (action.type === SCRUB_CLEAR) {
		return null
	}
	return state
}
