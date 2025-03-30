# The Astronauts DAO - Deployment Guide

## Overview

This guide covers the deployment process for The Astronauts DAO platform, including both the frontend application, backend services, and smart contracts. The deployment process is automated using GitHub Actions and infrastructure is managed with Terraform.

## Prerequisites

### Development Environment

1. Node.js and npm
```bash
node --version  # v18.x or higher
npm --version   # v9.x or higher
```

2. Git
```bash
git --version  # v2.x or higher
```

3. Docker
```bash
docker --version  # v20.x or higher
docker-compose --version  # v2.x or higher
```

### Cloud Services

1. AWS Account
   - IAM user with necessary permissions
   - Access key and secret key
   - S3 bucket for frontend hosting
   - Route53 domain configuration

2. GitHub Account
   - Repository access
   - GitHub Actions enabled
   - Repository secrets configured

3. Infura Account
   - Project ID
   - API endpoints for Ethereum networks

### Environment Variables

1. Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.theastronauts.dao
NEXT_PUBLIC_INFURA_ID=your_infura_project_id
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_GOVERNOR_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
```

2. Backend (.env.production)
```env
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://host:6379
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_private_key
```

3. GitHub Secrets
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DOCKER_USERNAME
DOCKER_PASSWORD
INFURA_API_KEY
ETHERSCAN_API_KEY
```

## Infrastructure Setup

### Terraform Configuration

1. Initialize Terraform
```bash
cd infrastructure
terraform init
```

2. Plan Infrastructure
```bash
terraform plan \
  -var="aws_region=us-east-1" \
  -var="domain_name=theastronauts.dao" \
  -var="environment=production"
```

3. Apply Infrastructure
```bash
terraform apply \
  -var="aws_region=us-east-1" \
  -var="domain_name=theastronauts.dao" \
  -var="environment=production"
```

### Database Setup

1. Create Database
```sql
CREATE DATABASE astronauts_dao;
```

2. Run Migrations
```bash
cd backend
npx prisma migrate deploy
```

3. Seed Initial Data
```bash
npx prisma db seed
```

## Smart Contract Deployment

### Contract Verification

1. Compile Contracts
```bash
cd contracts
npx hardhat compile
```

2. Run Tests
```bash
npx hardhat test
npx hardhat coverage
```

3. Deploy to Testnet
```bash
npx hardhat run scripts/deploy.ts --network goerli
```

4. Verify on Etherscan
```bash
npx hardhat verify --network goerli DEPLOYED_ADDRESS "Constructor Arg 1" "Constructor Arg 2"
```

### Production Deployment

1. Deploy Token
```bash
npx hardhat run scripts/deploy_token.ts --network mainnet
```

2. Deploy Governor
```bash
npx hardhat run scripts/deploy_governor.ts --network mainnet
```

3. Deploy Treasury
```bash
npx hardhat run scripts/deploy_treasury.ts --network mainnet
```

## Frontend Deployment

### Build Process

1. Install Dependencies
```bash
cd frontend
npm install
```

2. Build Application
```bash
npm run build
```

3. Test Build
```bash
npm run start
```

### AWS Deployment

1. Configure AWS CLI
```bash
aws configure
```

2. Deploy to S3
```bash
aws s3 sync ./out s3://theastronauts-dao-frontend
```

3. Invalidate CloudFront
```bash
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
```

## Backend Deployment

### Docker Build

1. Build Image
```bash
cd backend
docker build -t theastronauts/api:latest .
```

2. Test Container
```bash
docker run -p 3001:3001 theastronauts/api:latest
```

3. Push to Registry
```bash
docker push theastronauts/api:latest
```

### Kubernetes Deployment

1. Apply Configurations
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
```

2. Deploy Application
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

3. Verify Deployment
```bash
kubectl get pods -n astronauts-dao
kubectl get services -n astronauts-dao
kubectl get ingress -n astronauts-dao
```

## Monitoring Setup

### Prometheus Configuration

1. Install Prometheus
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

2. Configure Rules
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: astronauts-dao-alerts
spec:
  groups:
    - name: astronauts-dao
      rules:
        - alert: HighErrorRate
          expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
          for: 5m
          labels:
            severity: critical
```

### Grafana Dashboards

1. API Metrics Dashboard
```json
{
  "dashboard": {
    "id": null,
    "title": "Astronauts DAO API",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      }
    ]
  }
}
```

2. Smart Contract Dashboard
```json
{
  "dashboard": {
    "id": null,
    "title": "Astronauts DAO Contracts",
    "panels": [
      {
        "title": "Proposal Count",
        "type": "stat",
        "datasource": "Ethereum",
        "targets": [
          {
            "expr": "eth_call(governor_contract, 'proposalCount()')"
          }
        ]
      }
    ]
  }
}
```

## Backup Procedures

### Database Backup

1. Automated Backup
```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USER -d astronauts_dao > backup_$TIMESTAMP.sql
aws s3 cp backup_$TIMESTAMP.sql s3://astronauts-dao-backups/
```

2. Manual Backup
```bash
pg_dump -h localhost -U postgres -d astronauts_dao > manual_backup.sql
```

3. Restore from Backup
```bash
psql -h localhost -U postgres -d astronauts_dao < backup.sql
```

### Smart Contract Verification

1. Verify Source Code
```bash
npx hardhat verify-contract \
  --network mainnet \
  --contract contracts/AstronautsGovernor.sol:AstronautsGovernor \
  $DEPLOYED_ADDRESS
```

2. Export ABI
```bash
npx hardhat export-abi
```

3. Archive Deployment
```bash
tar -czf deployment_$VERSION.tar.gz \
  artifacts/ \
  deployments/ \
  .openzeppelin/
```

## Security Considerations

### SSL/TLS Configuration

1. Generate Certificate
```bash
certbot certonly \
  --dns-route53 \
  -d api.theastronauts.dao \
  -d theastronauts.dao
```

2. Configure Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name api.theastronauts.dao;
    
    ssl_certificate /etc/letsencrypt/live/api.theastronauts.dao/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.theastronauts.dao/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### Firewall Rules

1. AWS Security Groups
```hcl
resource "aws_security_group" "api" {
  name = "astronauts-dao-api"
  
  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

2. Kubernetes Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
spec:
  podSelector:
    matchLabels:
      app: api
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
```

## Troubleshooting

### Common Issues

1. Database Connection
```bash
# Test connection
psql -h $DB_HOST -U $DB_USER -d astronauts_dao

# Check logs
kubectl logs -f deployment/api -n astronauts-dao
```

2. Smart Contract Verification
```bash
# Check contract size
npx hardhat size-contracts

# Flatten contract
npx hardhat flatten contracts/AstronautsGovernor.sol > flattened.sol
```

3. Frontend Build
```bash
# Clear cache
rm -rf .next
npm run build

# Debug build
npm run build --debug
```

### Rollback Procedures

1. Frontend Rollback
```bash
# Revert to previous version
aws s3 sync s3://astronauts-dao-frontend-backup s3://astronauts-dao-frontend

# Invalidate cache
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

2. Backend Rollback
```bash
# Roll back deployment
kubectl rollout undo deployment/api -n astronauts-dao

# Verify rollback
kubectl rollout status deployment/api -n astronauts-dao
```

3. Database Rollback
```bash
# Revert migration
npx prisma migrate reset
npx prisma migrate up $PREVIOUS_VERSION
```

## Maintenance

### Regular Tasks

1. Certificate Renewal
```bash
# Auto-renewal
certbot renew

# Manual renewal
certbot renew --force-renewal
```

2. Database Maintenance
```bash
# Vacuum analysis
VACUUM ANALYZE;

# Reindex
REINDEX DATABASE astronauts_dao;
```

3. Log Rotation
```bash
# Configure logrotate
/var/log/astronauts-dao/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

### Monitoring Alerts

1. Configure Alert Manager
```yaml
apiVersion: monitoring.coreos.com/v1alpha1
kind: AlertmanagerConfig
metadata:
  name: astronauts-dao-alerts
spec:
  receivers:
    - name: 'slack'
      slack_configs:
        - channel: '#alerts'
          api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
```

2. Define Alert Rules
```yaml
groups:
  - name: astronauts-dao
    rules:
      - alert: HighErrorRate
        expr: rate(http_errors_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
```

## Documentation Updates

### API Documentation

1. Generate OpenAPI Spec
```bash
npm run generate-api-docs
```

2. Update Postman Collection
```bash
npm run update-postman-collection
```

### Contract Documentation

1. Generate Documentation
```bash
npx hardhat docgen
```

2. Update Deployment Addresses
```bash
echo "GOVERNOR_ADDRESS=$GOVERNOR_ADDRESS" >> .env.production
echo "TOKEN_ADDRESS=$TOKEN_ADDRESS" >> .env.production
``` 