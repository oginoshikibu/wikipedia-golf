# AWSの手順書

## 構築手順

（注）現在ひとまず動くところを目標としているため、変更が大いにあり得ます。


## 参考サイト
https://brainlog.jp/server/aws/post-3246/
https://qiita.com/miriwo/items/2accf74a33e71d0a0d61
https://qiita.com/miriwo/items/a1a0d6471aef9bff224f
https://www.next.inc/articles/2023/aws-ec2amazon-linux-2023%E3%81%ABcrontab%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B.html
https://blog.serverworks.co.jp/I-tried-to-install-MySQL-on-Amazon-Linux2-and-got-Nothing-to-do

## EC2

os: Amazon Linux

### 各種install

```bash

sudo yum update

# nginx
sudo amazon-linux-extras install nginx1
sudo systemctl start nginx
sudo systemctl status nginx
sudo systemctl enable nginx     # 自動起動

# php
sudo amazon-linux0extras install php8.2
sudo systemctl start php-fpm.service
sudo systemctl enable php-fpm

# composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === '55ce33d7678c5a611085589f1f3ddf8b3c52d662cd01d4ba75c0ee0459970c2200a51f492d557530c71c15d8dba01eae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer

# git
sudo yum install git

# mariaDB (mySQLサポート外のため)
sudo yum install -y mariadb mariadb-client

# npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm ls-remote
nvm install v16.14.0
nvm use 16.14.0

# yarn
npm install --global yarn

# cron
sudo yum install cronie -y
sudo systemctl enable crond.service
sudo systemctl start crond.service
sudo systemctl status crond | grep Active

```

### 各種設定

#### php-fpm

```bash
sudo vi /etc/php-fpm.d/www.conf
```

``` www.conf
user = nginx
group = nginx

listen = /var/run/php-fpm/php-fpm.sock

listen.owner = nginx
listen.group = nginx
listen.mode = 0660
```

```bash
sudo systemctl restart php-fpm.service
```

#### nginx

```bash
sudo vi /etc/nginx/nginx.conf
```

``` nginx.conf
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen 80;
        server_name _;
        root /var/www/public;

        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";

        index index.php;

        charset utf-8;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location = /favicon.ico { access_log off; log_not_found off; }
        location = /robots.txt  { access_log off; log_not_found off; }

        error_page 404 /index.php;

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            include fastcgi_params;
        }

        location ~ /\.(?!well-known).* {
            deny all;
        }
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2;
#        listen       [::]:443 ssl http2;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers PROFILE=SYSTEM;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}

```

```bash
sudo nginx -t   # test
sudo systemctl restart nginx
```

ルートディレクトリの変更
```bash
sudo mkdir /var/www
sudo chown ec2-user:nginx /var/www
sudo chmod 2775 /var/www
sudo usermod -a -G nginx ec2-user
```

#### mySQL

```bash
mysql -h <end point> -P 3306 -u admin -p
create database wikipedia_golf_db;
```

#### git

```bash
cd ~./ssh
ssh-keygen -t ed25519 -f ed25519_github
cat ed25519_github.pub
```
https://github.com/settings/ssh/new

```~/.ssh/config
 Host github.com
     HostName github.com
     IdentityFile ~/.ssh/ed25519_github
     User git
```

```bash
ssh -T git@github.com
```

#### timezone

```bash
# タイムゾーンの設定ファイルを所定の場所にコピー
sudo cp -p /usr/share/zoneinfo/Japan /etc/localtime

# /etc/sysconfig/clockを編集
sudo vi /etc/sysconfig/clock

---------------------
ZONE="Asia/Tokyo"
UTC=false
```


### deploy

```bash
# clone
cd /var/www/
git clone git@github.com:oginoshikibu/wikipedia-golf.git .

# edit .env file
mv .env.example .env
vi .env

# package
composer install
yarn

# php init
php artisan key:generate
php artisan migrate

# scheduler
crontab -e
>> * * * * * cd /var/www/ && php artisan schedule:run >> /dev/null 2>&1

# front
yarn build

```