import { useEffect, useState } from 'react'
import './App.css'
import api from './api'

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
      </div>
    </>
  )
}

export default App
