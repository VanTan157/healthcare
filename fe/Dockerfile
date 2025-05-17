FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
RUN npm install -D tailwindcss@3.4.1 postcss@8.4.31 autoprefixer@10.4.15
RUN npx tailwindcss init -p

COPY . .
COPY next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "dev"]
