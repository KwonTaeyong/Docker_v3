// frontend-customer1/src/App.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [response, setResponse] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    setResponse(data)

    if (res.ok && data.success) {
      navigate('/create') // 성공 시 이동
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">React + Caddy + Backend</h1>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border px-3 py-2 mr-2"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border px-3 py-2 mr-2"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        로그인
      </button>

      {response && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  )
}
