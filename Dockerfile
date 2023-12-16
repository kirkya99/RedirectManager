FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install
ENV BEARER_TOKEN="123456"
ENV PORT=3000
CMD ["npm", "start"]