import React, { PureComponent } from 'react'
import styles from './COMPONENT_NAME_.module.scss'

interface COMPONENT_NAME_Props {
  FOO: string
}

interface COMPONENT_NAME_State {
  BAR: number
}

class COMPONENT_NAME_ extends PureComponent<
  COMPONENT_NAME_Props,
  COMPONENT_NAME_State
> {
  state: COMPONENT_NAME_State = {
    BAR: 0,
  }

  render() {
    return <div className={styles.COMPONENT_NAME_} />
  }
}

export default COMPONENT_NAME_
