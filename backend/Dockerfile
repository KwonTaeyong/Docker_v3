FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# nodemon 설치 (devDependencies 포함)
RUN npm install -g nodemon

COPY . .

# nodemon으로 시작!
CMD ["nodemon", "index.js"]
