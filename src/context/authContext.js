import { createContext, useReducer, useEffect } from 'react'
import React from 'react'
import { auth, db } from '../firebase/config'

export const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    case 'AUTH_IS_READY':
      return { ...state, user: action.payload, authIsReady: true }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  // create global state of auth
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false
  })

  // update auth state while first render
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        dispatch({ type: 'AUTH_IS_READY', payload: user })
      } else {
        db.collection('members')
          .doc(user.uid)
          .get()
          .then((doc) => {
            dispatch({ type: 'AUTH_IS_READY', payload: doc.data() })
          })
      }
      unsub()
    })
  }, [])

  console.log('!!!!', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
