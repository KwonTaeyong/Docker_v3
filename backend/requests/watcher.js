const fs = require('fs');
const fse = require('fs-extra');
const { exec } = require('child_process');
const path = require('path');

const REQUEST_DIR = __dirname;
const TEMPLATE_DIR = path.resolve(__dirname, '../../frontend-customer1');

console.log('🕵️‍♂️ Watching for new frontend container requests...');

fs.watch(REQUEST_DIR, (eventType, filename) => {
  if (eventType === 'rename' && filename.endsWith('.json')) {
    const filePath = path.join(REQUEST_DIR, filename);

    // 잠깐 대기 후 읽기 (쓰기 중일 수 있으므로)
    setTimeout(() => {
      fs.readFile(filePath, 'utf-8', async (err, data) => {
        if (err) {
          console.error('❌ 파일 읽기 실패:', err);
          return;
        }

        const { containerName, port } = JSON.parse(data);
        const newFrontendDir = path.resolve(__dirname, `../../frontend-${containerName}`);

        try {
          console.log(`📦 새 컨테이너 요청: ${containerName} (${port})`);

          // 1. 디렉토리 복사
          if (!fs.existsSync(newFrontendDir)) {
            await fse.copy(TEMPLATE_DIR, newFrontendDir);
            console.log(`✅ 디렉토리 생성됨: ${newFrontendDir}`);
          } else {
            console.warn(`⚠️ 이미 존재하는 디렉토리: ${newFrontendDir}`);
          }

          // 2. Docker 이미지 빌드
          const buildCommand = `docker build -t frontend-${containerName} "${newFrontendDir}"`;
          console.log('🔨 빌드 명령:', buildCommand);

          exec(buildCommand, (buildErr, buildStdout, buildStderr) => {
            if (buildErr) {
              console.error('❌ Docker 빌드 실패:', buildErr.message);
              console.error('stderr:', buildStderr);
              return;
            }
            console.log(`✅ Docker 빌드 완료:\n${buildStdout}`);

            // 3. Docker 컨테이너 실행
            const runCommand = `docker run -d --name ${containerName} -p ${port}:80 frontend-${containerName}`;
            console.log('🚀 실행 명령:', runCommand);

            exec(runCommand, (runErr, runStdout, runStderr) => {
              if (runErr) {
                console.error('❌ Docker 실행 실패:', runErr.message);
                console.error('stderr:', runStderr);
                return;
              }

              console.log(`✅ 컨테이너 실행됨: ${runStdout.trim()}`);

              // 4. 요청 파일 삭제
              fs.unlink(filePath, () => {
                console.log(`🧹 요청 파일 삭제됨: ${filePath}`);
              });
            });
          });
        } catch (e) {
          console.error('🔥 처리 중 오류 발생:', e);
        }
      });
    }, 500);
  }
});
