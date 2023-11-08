import { useState } from 'react'
import Layout from '../components/Layout.js'

const MyForm = function() {
  const [data, setData] = useState({})
  const onSubmit = function(e) {
    e.preventDefault()
    console.log(data)
  }
  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <h2>User name</h2>
        <div>
          <input
            type="text"
            name="my_input"
            value={data.my_value}
            onChange={e => setData({...data, ...{my_input: e.target.value}})}
          />
        </div>
        <h2>Password</h2>
        <div>
          <input
            type="text"
            name="my_input"
            value={data.my_value}
            onChange={e => setData({...data, ...{my_input: e.target.value}})}
          />
        </div>
        <div>
          <button>
            Submit
          </button>
        </div>
      </form>
    </Layout>
  )
}

export default MyForm;