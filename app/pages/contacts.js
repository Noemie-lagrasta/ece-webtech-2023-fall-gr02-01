import Head from 'next/head'
import Image from 'next/image'

import Layout from '../components/Layout.js'

export default function Page() {
  return (
    <Layout>
      <Head>
        <title>WebTech - contact us</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="wt-center">
      <div className="wt-welcome">
        CONTACT US
      </div>
      </main>
      <br/>
      <form className="wt-quest-general">
        <div className='wt-questionnaire2'>
        <label className="text-left"> 
            <span>First name</span><spacer/>
            <input type="text" name="firstname"className="wt-quest-label" placeholder='Eric' required />
          </label>
        </div>
        <br/>
        <div className='wt-questionnaire2'>
        <label className="text-left"> 
            <span>Last name</span>
            <input type="text" name="lastname" className="wt-quest-label" placeholder='Dupont' required />
          </label>
        </div>
        <br/>
        <div className='wt-questionnaire2'>
          <label className="text-left"> 
            <span>Email</span>
            <input type="email" name="email" className="wt-quest-label" placeholder='ericdupont@gmail.com' required/>
          </label>
        </div>

          <br/>
          <div className='wt-questionnaire2'>
          <label className="text-left"> 
            <span>Message</span>
            <textarea name="message" className="wt-quest-label" placeholder='Describe the situation ...' required/>
          </label>
        </div>
        <br/>
        <div className="wt-questionnaire">
          <input type="submit" value="SEND" className="wt-quest-send" />
        </div>
      </form>
    </Layout>
  )
}
