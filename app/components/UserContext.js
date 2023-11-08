import {createContext, useState} from 'react'

const Context = createContext()

export default Context

export const ContextProvider = ({
  children
}) => {
  const [user, setUser] = useState(null)
  return (
    <Context.Provider
      value={{
        user: user,
        login: (user) => {
          setUser(user)
        },
        logout: () => {
          setUser(null)
        }
      }}
    >
      {children}
    </Context.Provider>
  )
}