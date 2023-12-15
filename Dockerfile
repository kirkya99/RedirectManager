# syntax=docker/dockerfile:1

FROM node
WORKDIR /app
COPY . .
RUN npm install express && npm install fs
ENV BEARER_TOKEN=TOKEN
CMD ["node", "index.js"]
EXPOSE 3000