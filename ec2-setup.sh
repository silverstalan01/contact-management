#!/bin/bash

# Update system
sudo apt update
sudo apt upgrade -y

# Install required packages
sudo apt install -y python3-pip python3-venv nginx postgresql postgresql-contrib

# Setup PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE contact_db;"
sudo -u postgres psql -c "CREATE USER contact_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE contact_db TO contact_user;"

# Setup application directory
mkdir -p ~/contact-app
cd ~/contact-app

# Setup Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install gunicorn psycopg2-binary

# Setup Nginx
sudo nano /etc/nginx/sites-available/contact-app
sudo ln -s /etc/nginx/sites-available/contact-app /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx

# Setup Gunicorn
sudo nano /etc/systemd/system/gunicorn.service
sudo systemctl start gunicorn
sudo systemctl enable gunicorn