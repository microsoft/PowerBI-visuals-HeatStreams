import * as redux from 'redux'
import scrub from './scrub'
import { ScrubState } from './scrub'
import selectedCategories from './selectedCategories'
import { SelectedCategoriesState } from './selectedCategories'

export interface IState {
	scrub: ScrubState
	selectedCategories: SelectedCategoriesState
}
const reducerStack = redux.combineReducers({
	scrub,
	selectedCategories,
})

export default reducerStack
