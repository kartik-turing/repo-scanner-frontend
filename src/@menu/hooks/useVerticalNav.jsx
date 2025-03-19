// React Imports
import { useContext } from 'react'

// Context Imports
import VerticalNavContext from '../contexts/verticalNavContext'

const useVerticalNav = () => {
  // Hooks
  const context = useContext(VerticalNavContext)

  if (context === undefined) {
    //TODO: set better error message
    throw new Error('VerticalNav Component is required!')
  }
  console.log('vertical Comp', context)
  return context
}

export default useVerticalNav
