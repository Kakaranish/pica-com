#!/bin/bash

mv ../backend/.env ../backend/.env-temp
cp .env-backend-prod ../backend/.env
cd ../backend
docker build -t picacom.azurecr.io/backend .
docker push picacom.azurecr.io/backend
mv .env-temp .env

cd ../frontend
docker build -t picacom.azurecr.io/frontend .
docker push picacom.azurecr.io/frontend

mv ../notifying-service/.env ../notifying-service/.env-temp
cp .env-notif-service ../notifying-service/.env
cd ../notifying-service
docker build -t picacom.azurecr.io/notifying-service .
docker push picacom.azurecr.io/notifying-service
mv .env-temp .env

cd ..