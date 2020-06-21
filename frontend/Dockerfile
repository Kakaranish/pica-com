FROM node:12-alpine as build-deps
WORKDIR /home/pica-com
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run-script build

FROM nginx:1.19-alpine
COPY --from=build-deps /home/pica-com/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]