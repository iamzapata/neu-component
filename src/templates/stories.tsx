// COMPONENT_NAME_.stories.js|jsx

import React from 'react'

import { COMPONENT_NAME_ } from './COMPONENT_NAME_.component'

export default {
  title: 'Components/COMPONENT_NAME_',
  component: COMPONENT_NAME_,
}

export const Basic = () => <COMPONENT_NAME_ />

export const WithProp = () => <COMPONENT_NAME_ FOO="value" />
