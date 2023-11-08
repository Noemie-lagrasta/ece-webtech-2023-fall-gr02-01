import React, { useState } from 'react';
import Layout from '../components/Layout.js'

function Click() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <Layout>
        <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
            Click me
        </button>
        </div>
    </Layout>
  );
}

export default Click;