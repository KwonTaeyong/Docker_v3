const express = require('express')
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())



// ✅ 로그인 요청 핸들링 추가
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (username === 'admin' && password === 'password') {
    res.json({ success: true, message: '로그인 성공!' })
  } else {
    res.status(401).json({ success: false, message: '로그인 실패!' })
  }
})

// 요청 저장 디렉토리 생성
const requestsDir = path.join(__dirname, 'requests')
if (!fs.existsSync(requestsDir)) {
  fs.mkdirSync(requestsDir)
}

app.post('/api/create-frontend', (req, res) => {
  const { containerName, port } = req.body;
  console.log('📥 요청 받음:', containerName, port);

  if (!containerName || !port) {
    return res.status(400).json({ success: false, message: 'Missing containerName or port' });
  }

  const fs = require('fs');
  const path = require('path');

  const requestsDir = path.join(__dirname, 'requests');
  const requestPath = path.join(requestsDir, `${containerName}.json`);
  const requestData = JSON.stringify({ containerName, port }, null, 2);
  
  // 디렉터리 없으면 만들기
  if (!fs.existsSync(requestsDir)) {
    fs.mkdirSync(requestsDir);
    console.log('📁 requests 폴더가 없어서 새로 생성함');
  }

  // 파일 저장
  fs.writeFile(requestPath, requestData, (err) => {
    if (err) {
      console.error('❌ 파일 저장 실패:', err);
      return res.status(500).json({ success: false, message: '파일 저장 실패', detail: err.message });
    }

    console.log(`✅ 요청 파일 저장: ${requestPath}`);
    res.json({ success: true, message: '요청 저장 완료' });
  });
});

// ✅ 테스트용 API도 그대로 유지
app.get('/api/test', (req, res) => {
  res.json({ message: '백엔드 연결 성공!' })
})

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`)
})
