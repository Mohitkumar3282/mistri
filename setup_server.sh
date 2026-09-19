#!/bin/bash
set -e

echo "=========================================================="
echo "🚀 MISTRI (m-mistri.com) PRODUCTION DEPLOYMENT SCRIPT"
echo "=========================================================="

DOMAIN="m-mistri.com"
WWW_DOMAIN="www.m-mistri.com"
APP_DIR="/root/mistri"
WEB_ROOT="/var/www/m-mistri"
REPO_URL="https://github.com/Mohitkumar3282/mistri.git"

# 1. Update and install prerequisites
echo "📦 Step 1: Updating packages & installing system dependencies..."
apt update -y
apt install -y nginx git curl certbot python3-certbot-nginx ufw

# Install Node.js 20 LTS if not present
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'.' -f1)" != "v20" ]; then
    echo "🟢 Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2..."
    npm install -g pm2
fi

# 2. Clone or update repository
echo "📂 Step 2: Setting up application files at $APP_DIR..."
if [ -d "$APP_DIR/.git" ]; then
    echo "Pulling latest changes from git..."
    cd "$APP_DIR"
    git reset --hard HEAD
    git pull origin main
else
    echo "Cloning repository..."
    cd /root
    rm -rf "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# 3. Configure Backend
echo "🛠️ Step 3: Setting up Backend..."
cd "$APP_DIR/backend"

cat << 'EOF' > .env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://emistri003_db_user:7b80xxnekai0xiMq@cluster0.jvvks4j.mongodb.net/emistri
JWT_SECRET=mistri_super_secret_jwt_key_2026
JWT_EXPIRES_IN=30d
CLIENT_URL=https://m-mistri.com
RAZORPAY_KEY_ID=rzp_test_TRZdg2aAOYv4KK
RAZORPAY_KEY_SECRET=Zu7lopLZWWZtA4T0R5Z2ORhU

# Cloudinary Cloud Storage Configuration
CLOUDINARY_CLOUD_NAME=wj934vih
CLOUDINARY_API_KEY=951352839961256
CLOUDINARY_API_SECRET=ENaD5cmuOkaztf-MFjNKSKnO3WM
CLOUDINARY_URL=cloudinary://951352839961256:ENaD5cmuOkaztf-MFjNKSKnO3WM@wj934vih
EOF

echo "Installing backend dependencies..."
npm install --production=false

echo "Starting Backend with PM2..."
pm2 delete mistri-backend 2>/dev/null || true
pm2 start server.js --name mistri-backend
pm2 save
pm2 startup systemd -u root --hp /root || true

# 4. Configure & Build Frontend
echo "🎨 Step 4: Setting up & Building Frontend..."
cd "$APP_DIR/frontend"

cat << 'EOF' > .env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_TRZdg2aAOYv4KK

# Firebase Web App Configuration (emistri-2db9c)
VITE_FIREBASE_API_KEY=AIzaSyDOLoNGsJCzv8DrdeWgPnssx4_ZQKip3PI
VITE_FIREBASE_AUTH_DOMAIN=emistri-2db9c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=emistri-2db9c
VITE_FIREBASE_STORAGE_BUCKET=emistri-2db9c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=154249982036
VITE_FIREBASE_APP_ID=1:154249982036:web:710ded702c19623c047dc1
VITE_FIREBASE_MEASUREMENT_ID=G-E98HJTHQBB

# Cloudinary Cloud Storage Configuration (wj934vih)
VITE_CLOUDINARY_CLOUD_NAME=wj934vih
VITE_CLOUDINARY_API_KEY=951352839961256
EOF

cp .env .env.production

echo "Installing frontend dependencies & building production bundle..."
npm install
npm run build

echo "Deploying build files to $WEB_ROOT..."
mkdir -p "$WEB_ROOT"
rm -rf "$WEB_ROOT"/*
cp -r dist/* "$WEB_ROOT"/
chown -R www-data:www-data "$WEB_ROOT"
chmod -R 755 "$WEB_ROOT"

# 5. Configure Nginx
echo "🌐 Step 5: Configuring Nginx reverse proxy & static hosting..."
cat << 'EOF' > /etc/nginx/sites-available/m-mistri.conf
server {
    listen 80;
    listen [::]:80;
    server_name m-mistri.com www.m-mistri.com;

    root /var/www/m-mistri;
    index index.html;

    # Client-side routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to Backend (port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket / Socket.io Support
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/m-mistri.conf /etc/nginx/sites-enabled/m-mistri.conf
rm -f /etc/nginx/sites-enabled/default

echo "Testing Nginx configuration..."
nginx -t
systemctl restart nginx

# 6. Create ~/deploy.sh for future updates
cat << 'EOF' > /root/deploy.sh
#!/bin/bash
set -e
echo "🚀 Auto-deploy started..."

cd /root/mistri
git pull origin main

# Frontend
echo "Building Frontend..."
cd /root/mistri/frontend
npm install
npm run build
rm -rf /var/www/m-mistri/*
cp -r dist/* /var/www/m-mistri/
chown -R www-data:www-data /var/www/m-mistri

# Backend
echo "Updating Backend..."
cd /root/mistri/backend
npm install
pm2 restart mistri-backend

echo "✅ Deployment finished successfully!"
EOF
chmod +x /root/deploy.sh

# 7. Configure SSL with Certbot (Optional / Automatic if DNS is pointed)
echo "🔒 Step 7: Requesting SSL Certificate (Certbot)..."
certbot --nginx -d m-mistri.com -d www.m-mistri.com --non-interactive --agree-tos -m admin@m-mistri.com --redirect || echo "⚠️ SSL setup skipped or DNS not yet propagated. Run 'certbot --nginx -d m-mistri.com -d www.m-mistri.com' once DNS is propagated."

echo ""
echo "=========================================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "Frontend: https://m-mistri.com"
echo "Backend:  https://m-mistri.com/api"
echo "Daily workflow: Run ~/deploy.sh anytime code is updated"
echo "=========================================================="
