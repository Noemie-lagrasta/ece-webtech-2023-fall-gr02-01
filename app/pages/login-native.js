import React, {useContext} from 'react';
import Context from '../components/UserContext.js'
import Layout from '@/components/Layout.js';


const LoggedOut = () => {
  const {login} = useContext(Context)
  return (
    <Layout>
        <div>
        <button onClick={()=>{login() }}>Login</button>
        </div>
    </Layout>
   
  )
}

const LoggedIn = () => {
  const {user, logout} = useContext(Context)
  return (
    <Layout>
        <div>
            Welcome {user.username}!
            <div>
                <button onClick={()=>{ logout() }}>Logout</button>
            </div>
        </div>
    </Layout>
    
  )
}

function LoginNative(){
  const {user} = useContext(Context)
  return (
    
    <div>
      {user ? <LoggedIn /> : <LoggedOut />}
    </div>
  )
}
export default LoginNative;