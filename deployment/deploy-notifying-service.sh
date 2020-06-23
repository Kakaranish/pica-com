#!/bin/bash

mv ../notifying-service/.env ../notifying-service/.env-temp
cp .env-notif-service ../notifying-service/.env
cd ../notifying-service
docker build -t picacom.azurecr.io/notifying-service .
docker push picacom.azurecr.io/notifying-service
mv .env-temp .env