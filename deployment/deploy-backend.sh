#!/bin/bash

mv ../backend/.env ../backend/.env-temp
cp .env-backend-prod ../backend/.env
cd ../backend
docker build -t picacom.azurecr.io/backend .
docker push picacom.azurecr.io/backend
mv .env-temp .env