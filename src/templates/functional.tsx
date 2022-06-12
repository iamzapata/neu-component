import React from 'react'
import styles from './COMPONENT_NAME_.module.scss'

interface COMPONENT_NAME_Props {
  FOO?: string
}

const COMPONENT_NAME_ = ({ FOO }: COMPONENT_NAME_Props) => (
  <div className={styles.COMPONENT_NAME_}>{FOO}</div>
)

export { COMPONENT_NAME_ }
