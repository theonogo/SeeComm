import { useEffect, useState } from 'react'
import './App.css'
import api from './api'
import LogoutButton from './components/LogoutButton'
import UploadForm from './components/UploadForm'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/hello/')
      .then((res : { data: { message: string } }) => {
        setMessage(res.data.message)
      })
  }, [])

  return (
    <>
      <div>
        <h1>{message}</h1>
        <UploadForm />
        <LogoutButton />
      </div>
    </>
  )
}

export default App
