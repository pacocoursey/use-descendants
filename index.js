import * as React from 'react'

const DescendantContext = React.createContext({})
const randomId = () => Math.random().toString(36).substr(2, 9)

export const Descendants = (props) => {
  // On every re-render of children, reset the count
  props.value.reset()

  return (
    <DescendantContext.Provider value={props.value}>
      {props.children}
    </DescendantContext.Provider>
  )
}

export const useDescendants = () => {
  const indexCounter = React.useRef(0)
  const map = React.useRef()
  if (!map.current) map.current = {}

  const reset = () => {
    indexCounter.current = 0
    map.current = {}
  }

  const get = (id, props) => {
    if (!map.current[id]) map.current[id] = { index: indexCounter.current++ }
    map.current[id].props = props
    return map.current[id].index
  }

  // Do NOT memoize context value, so that we bypass React.memo on any children
  // We NEED them to re-render, in case stable children were re-ordered
  // (this creates a new object every render, so children reading the context MUST re-render)
  return { get, map, reset }
}

/**
 * Return index of the current item within its parent's list
 * @param {any} props - Props that will be exposed to the parent list
 */
export function useDescendant(props) {
  const context = React.useContext(DescendantContext)
  const descendantId = React.useRef()
  if (!descendantId.current) descendantId.current = randomId()
  return context?.get(descendantId.current, props)
}
