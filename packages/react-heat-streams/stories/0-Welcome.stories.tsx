/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as React from 'react'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'

export default {
	title: 'Welcome',
	component: Welcome,
}

export const ToStorybook = () => <Welcome showApp={linkTo('Button')} />

ToStorybook.story = {
	name: 'to Storybook',
}
