#!/bin/bash
set -euo pipefail

# Log output to console and setup.log
exec > >(tee -a /var/log/guidra-setup.log) 2>&1

echo "========================================="
echo " Starting Guidra EC2 Server Setup        "
echo "========================================="

# 1. Update OS packages and install make, docker, git, jq, curl
echo "[1/5] Installing make, docker, git, jq, curl..."
sudo dnf update -y
sudo dnf install -y make docker git jq curl

# 2. Enable and start Docker and SSM Agent
echo "[2/5] Starting Docker and SSM Agent..."
sudo systemctl enable --now docker
sudo systemctl enable --now amazon-ssm-agent
sudo usermod -aG docker ec2-user

# 3. Install Docker Compose CLI plugin
echo "[3/5] Installing Docker Compose CLI plugin..."
DOCKER_CLI_PLUGINS_DIR="/usr/local/lib/docker/cli-plugins"
sudo mkdir -p "$DOCKER_CLI_PLUGINS_DIR"
ARCH="$(uname -m)"
sudo curl -fsSL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$ARCH" -o "$DOCKER_CLI_PLUGINS_DIR/docker-compose"
sudo chmod +x "$DOCKER_CLI_PLUGINS_DIR/docker-compose"
sudo ln -sf "$DOCKER_CLI_PLUGINS_DIR/docker-compose" /usr/local/bin/docker-compose

# 4. Folder structure and permissions
echo "[4/5] Configuring /opt/guidra directory and permissions..."
sudo mkdir -p /opt/guidra
sudo chown -R ec2-user:ec2-user /opt/guidra
sudo chmod 755 /opt/guidra

# 5. Fetch compose specs and sync secrets
echo "[5/5] Syncing configuration and starting application..."
cd /opt/guidra

if [ ! -f docker-compose.yml ]; then
  curl -fsSL "https://raw.githubusercontent.com/mrtuxcoder/Guidra-learning-platform/main/docker-compose.yml" -o docker-compose.yml
fi

if [ ! -f docker-compose.prod.yml ]; then
  curl -fsSL "https://raw.githubusercontent.com/mrtuxcoder/Guidra-learning-platform/main/docker-compose.prod.yml" -o docker-compose.prod.yml
fi

if [ -f /opt/guidra/sync-secrets.sh ]; then
  /opt/guidra/sync-secrets.sh
fi

if [ -f /opt/guidra/.env.production ] && grep -q "BACKEND_IMAGE=" /opt/guidra/.env.production; then
  REGISTRY_HOST=$(grep "^BACKEND_IMAGE=" /opt/guidra/.env.production | head -n 1 | cut -d '=' -f 2 | cut -d '/' -f 1)
  AWS_REGION="${AWS_REGION:-ap-south-1}"
  if [ -n "$REGISTRY_HOST" ]; then
    aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$REGISTRY_HOST" || true
  fi
  docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up -d
fi

echo "========================================="
echo " Setup Finished Successfully             "
echo "========================================="
