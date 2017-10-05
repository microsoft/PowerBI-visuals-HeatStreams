import { createAction } from 'redux-actions'

export const SCRUB = 'SCRUB'
export const SCRUB_CLEAR = 'SCRUB_CLEAR'
export const SELECT_CATEGORY = 'SELECT_CATEGORY'
export const SELECT_MULTI_CATEGORY = 'SELECT_MULTI_CATEGORY'
export const CATEGORY_SELECTION_CLEAR = 'CATEGORY_SELECTION_CLEAR'

export const scrub = createAction<Array<Date | number>>(SCRUB)
export const scrubClear = createAction<void>(SCRUB_CLEAR)
