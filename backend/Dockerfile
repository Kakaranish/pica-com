FROM node:12-alpine
WORKDIR /home/pica-com
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 9000
CMD ["npm", "run", "start-prod"]