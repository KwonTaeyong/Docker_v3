// frontend-customer1/src/CreateFrontend.jsx
import React, { useState } from 'react'

export default function CreateFrontend() {
  const [name, setName] = useState('')
  const [port, setPort] = useState('')
  const [response, setResponse] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/create-frontend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ containerName: name, port }),
    })
    const data = await res.json()
    setResponse(data)
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">새 프론트 컨테이너 생성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">고객 이름</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="예: customer3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">포트 번호</label>
          <input
            type="text"
            value={port}
            onChange={e => setPort(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="예: 3003"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          생성 요청
        </button>
      </form>

      {response && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
