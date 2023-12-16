FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install
ENV BEARER_TOKEN="123456"
ENV PORT=80
CMD ["npm", "start"]