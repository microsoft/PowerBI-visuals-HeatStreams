import * as redux from 'redux'
import { createLogger } from 'redux-logger'
import reducer from './reducer'

// eslint-disable-next-line no-underscore-dangle
const createStore = redux.compose(redux.applyMiddleware(createLogger({})))(
	redux.createStore,
)

const store = createStore(reducer)

export default store
