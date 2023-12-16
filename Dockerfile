
FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install
ENV BEARER_TOKEN=TOKEN
CMD ["npm", "start"]
EXPOSE 3000