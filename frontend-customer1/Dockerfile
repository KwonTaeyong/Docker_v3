# 1단계: Vite 앱 빌드
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2단계: Caddy에서 정적 파일 서빙
FROM caddy:2 AS export
COPY --from=build /app/dist /srv/frontend
