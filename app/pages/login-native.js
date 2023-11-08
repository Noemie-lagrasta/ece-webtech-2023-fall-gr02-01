import {useContext} from 'react';
import Context from '../components/UserContext.js'
import Layout from '@/components/Layout.js';

const LoggedOut = () => {
  const {login} = useContext(Context)
  return (
    <Layout>
        <div>
        <button onClick={()=>{ login('guest') }}>Login</button>
        </div>
    </Layout>
   
  )
}

const LoggedIn = () => {
  const {user, logout} = useContext(Context)
  return (
    <Layout>
        <div>
            Welcome {user}!
            <div>
                <button onClick={()=>{ logout() }}>Logout</button>
            </div>
        </div>
    </Layout>
    
  )
}

export default () => {
  const {user} = useContext(Context)
  return (
    <div>
      {user ? <LoggedIn /> : <LoggedOut />}
    </div>
  )
}