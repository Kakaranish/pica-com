#!/bin/bash

cd ../frontend
docker build -t picacom.azurecr.io/frontend .
docker push picacom.azurecr.io/frontend