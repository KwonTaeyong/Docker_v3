const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const REQUEST_DIR = path.resolve(__dirname); // 현재 폴더가 backend/requests라면



console.log('🕵️‍♂️ Watching for new frontend container requests...');

fs.watch(REQUEST_DIR, (eventType, filename) => {
  if (eventType === 'rename' && filename.endsWith('.json')) {
    const filePath = path.join(REQUEST_DIR, filename);

    // 잠깐 대기 후 읽기 (쓰기 중일 수 있으므로)
    setTimeout(() => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return console.error('❌ 파일 읽기 실패:', err);

        const { containerName, port } = JSON.parse(data);
        console.log(`📦 새 컨테이너 요청: ${containerName} (${port})`);

        const command = `docker run -d --name ${containerName} -p ${port}:80 frontend-image`;

        exec(command, (err, stdout, stderr) => {
          if (err) {
            console.error('❌ Docker 실행 오류:', stderr);
          } else {
            console.log(`✅ 컨테이너 생성됨: ${stdout}`);
            fs.unlink(filePath, () => {}); // 처리 완료 후 파일 삭제
          }
        });
      });
    }, 500);
  }
});
