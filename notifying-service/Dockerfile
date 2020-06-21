FROM node:12-alpine
WORKDIR /home/pica-com
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 8000
CMD ["npm", "start"]