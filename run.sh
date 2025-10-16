#!/bin/bash
set -e  # Exit immediately if a command fails
set -o pipefail
 
# Function to clean up Docker resources
cleanup_docker() {
    echo "Cleaning up old Docker resources..."
 
    # Remove stopped containers
    sudo docker container prune -f
 
    # Remove unused images
    sudo docker image prune -af
 
    # Remove unused volumes
    sudo docker volume prune -f
 
    # Remove unused networks
    sudo docker network prune -f
 
    echo "Docker cleanup completed."
}
 
# Stop and remove current containers
echo "Stopping current containers..."
sudo docker compose down
 
# Cleanup old images, volumes, and networks
cleanup_docker
 
# Build and start containers
echo "Building and starting containers..."
sudo docker compose build --no-cache
sudo docker compose up -d
 
# Show running containers
sudo docker ps
sudo systemctl restart caddy
 
echo "✅ Application deployed successfully!"
