#!/bin/bash
set -e

echo "🚀 Deploying latest Mistri updates to m-mistri.com..."

cd /root/mistri
git pull origin main

# 1. Update Frontend
echo "📦 Building Frontend..."
cd /root/mistri/frontend
npm install
npm run build
rm -rf /var/www/m-mistri/*
cp -r dist/* /var/www/m-mistri/
chown -R www-data:www-data /var/www/m-mistri
chmod -R 755 /var/www/m-mistri

# 2. Update Backend
echo "⚙️ Updating Backend..."
cd /root/mistri/backend
npm install
pm2 restart mistri-backend

echo "=========================================================="
echo "✅ DEPLOYMENT FINISHED SUCCESSFULLY!"
echo "Site: https://m-mistri.com"
echo "API:  https://m-mistri.com/api"
echo "=========================================================="
