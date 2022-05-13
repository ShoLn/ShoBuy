import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('component should be in AuthContextProvider component!')
  }

  return context
}

