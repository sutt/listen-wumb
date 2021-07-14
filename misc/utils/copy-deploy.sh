# cd deploy-1
#   > rm -rf ./*
# cd into this folder: 
#   > copy-deploy.sh


# does rsync overwirte existing files?

cd ../../deploy-1

rsync -avr --exclude='node_modules' ../wumb-front-2/wumb/* ./
rsync -avr               ../wumb-front-2/wumb/.gitignore   ./

rsync -avr --exclude='node_modules' ../proxy-2             ./
mv proxy-2 backend

rm ./yarn.lock

node ../misc/utils/merge-deps.js

cd ../wumb-front-2
git log -n 1 > ../deploy-1/frontend.log

cd ../proxy-2
git log -n 1 > ../deploy-1/backend.log
