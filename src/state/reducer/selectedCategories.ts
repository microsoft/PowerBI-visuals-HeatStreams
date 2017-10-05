import * as Actions from '../actions'

export type SelectedCategoriesState = string[]

export default function reduce(state = [], action) {
	const isCategory = t => t.id === action.payload.id
	const isNotCategory = t => t.id !== action.payload.id
	const isCategorySelected = action.payload && state.some(isCategory)

	if (action.type === Actions.SELECT_CATEGORY) {
		return isCategorySelected ? [] : [action.payload]
	} else if (action.type === Actions.SELECT_MULTI_CATEGORY) {
		return isCategorySelected ? state.filter(isNotCategory) : [action.payload]
	} else if (action.type === Actions.CATEGORY_SELECTION_CLEAR) {
		return []
	}
	return state
}
