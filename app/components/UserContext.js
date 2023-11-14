import {createContext, useState, useEffect} from 'react'

const Context = createContext()

export default Context

export const ContextProvider = ({
  children
}) => {
  const [user, setUser] = useState(null)
  const fetchData = async () => {
    const response = await fetch('/api/profile')
    return await response.json()
  }
  useEffect(() => {
    const fetchProfile = async () => {
      const user = await fetchData()
      setUser(user)
    }
    fetchProfile()
  }, [])

  return (
    <Context.Provider
      value={{
        user: user,
        login: async () => {
          const user = await fetchData()
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