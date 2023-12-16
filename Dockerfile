
FROM node
WORKDIR /app
COPY . .
RUN npm install
ENV BEARER_TOKEN=TOKEN
CMD ["node", "index.js"]
EXPOSE 3000