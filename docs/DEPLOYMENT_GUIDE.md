# Deployment Guide

This guide covers deploying the Nursing Training Institution Database System to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

### System Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **MongoDB**: v4.0.0 or higher
- **Memory**: Minimum 512MB RAM
- **Storage**: Minimum 1GB free space

### Development Tools
- **Git**: For version control
- **PM2**: For production process management (optional)
- **Docker**: For containerized deployment (optional)

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd katyayani_assignment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nursing_training_db

# Server Configuration
PORT=8080

# Security
JWT_SECRET=your-super-secret-jwt-key-here

# Environment
NODE_ENV=production
```

## Local Development

### Start Development Server
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Check Application Health
```bash
curl http://localhost:8080/api/hospitals
```

## Production Deployment

### 1. Server Preparation

#### Update System Packages
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Node.js (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 2. Application Deployment

#### Clone and Setup
```bash
git clone <repository-url>
cd katyayani_assignment
npm install --production
```

#### Configure Environment
```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

#### Start with PM2
```bash
pm2 start src/server.js --name "nursing-training-api"
pm2 save
pm2 startup
```

### 3. Nginx Configuration (Optional)

#### Install Nginx
```bash
sudo apt install nginx
```

#### Configure Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/nursing-training-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/nursing-training-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/nursing_training_db
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

### 3. Deploy with Docker Compose
```bash
docker-compose up -d
```

## Cloud Deployment

### Heroku Deployment

#### 1. Install Heroku CLI
```bash
npm install -g heroku
```

#### 2. Login and Create App
```bash
heroku login
heroku create nursing-training-api
```

#### 3. Configure Environment Variables
```bash
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production
```

#### 4. Deploy
```bash
git push heroku main
```

### AWS EC2 Deployment

#### 1. Launch EC2 Instance
- Choose Ubuntu 20.04 LTS
- Select t2.micro (free tier)
- Configure security groups (ports 22, 80, 443)

#### 2. Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

Follow the production deployment steps above.

#### 3. Configure Load Balancer (Optional)
- Create Application Load Balancer
- Configure target groups
- Set up health checks

### MongoDB Atlas Setup

#### 1. Create Cluster
- Sign up at MongoDB Atlas
- Create a new cluster
- Configure network access
- Create database user

#### 2. Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/nursing_training_db
```

#### 3. Update Environment Variables
```bash
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/nursing_training_db"
```

## Monitoring and Maintenance

### 1. Application Monitoring

#### PM2 Monitoring
```bash
pm2 status
pm2 logs nursing-training-api
pm2 monit
```

#### Health Check Endpoint
```bash
curl http://localhost:8080/api/hospitals
```

### 2. Database Monitoring

#### MongoDB Logs
```bash
tail -f /var/log/mongodb/mongod.log
```

#### Database Stats
```javascript
// Connect to MongoDB shell
db.stats()
db.hospitals.stats()
```

### 3. Performance Monitoring

#### Server Resources
```bash
htop
df -h
free -m
```

#### Application Performance
```bash
pm2 show nursing-training-api
```

### 4. Backup Strategy

#### Database Backup
```bash
mongodump --uri="mongodb://localhost:27017/nursing_training_db" --out=/backup/$(date +%Y%m%d)
```

#### Automated Backup Script
```bash
#!/bin/bash
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

### 5. Log Management

#### Log Rotation
```bash
sudo nano /etc/logrotate.d/nursing-training-api
```

Add configuration:
```
/var/log/nursing-training-api/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
}
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use secure secret management
- Rotate secrets regularly

### 2. Database Security
- Enable authentication
- Use SSL/TLS connections
- Implement IP whitelisting
- Regular security updates

### 3. Application Security
- Implement rate limiting
- Use HTTPS in production
- Validate all inputs
- Implement proper error handling

### 4. Server Security
- Keep system updated
- Configure firewall
- Use SSH keys
- Disable root login

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs nursing-training-api

# Check environment variables
pm2 show nursing-training-api

# Restart application
pm2 restart nursing-training-api
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongo "mongodb://localhost:27017/nursing_training_db"

# Check MongoDB status
sudo systemctl status mongod
```

#### High Memory Usage
```bash
# Check memory usage
free -m

# Restart application
pm2 restart nursing-training-api

# Check for memory leaks
pm2 monit
```

### Performance Optimization

#### Database Indexing
```javascript
// Create indexes for better performance
db.hospitals.createIndex({ "name": 1 })
db.doctors.createIndex({ "personalInfo.email": 1 })
db.students.createIndex({ "academicInfo.enrollmentNumber": 1 })
db.certificates.createIndex({ "certificateNumber": 1 })
```

#### Application Optimization
- Enable gzip compression
- Implement caching
- Use connection pooling
- Optimize database queries

## Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Implement session management
- Database sharding
- Microservices architecture

### Vertical Scaling
- Increase server resources
- Optimize database configuration
- Use faster storage (SSD)
- Increase connection limits

## Maintenance Schedule

### Daily
- Monitor application logs
- Check system resources
- Verify backup completion

### Weekly
- Review performance metrics
- Update dependencies
- Security patches

### Monthly
- Database maintenance
- Log cleanup
- Performance optimization
- Security audit

---

**Note**: Always test deployments in a staging environment before deploying to production. Keep documentation updated with any configuration changes.