# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Run stage
FROM nginxinc/nginx-unprivileged:alpine

COPY --from=build \
  --chown=nginx:nginx \
  /app/dist/front/browser \
  /usr/share/nginx/html

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
