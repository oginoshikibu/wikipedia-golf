cp .env.local.example .env    # 必要な場合は別途編集

# Composer依存関係のインストール
# ref: https://readouble.com/laravel/10.x/ja/sail.html
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs

./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail yarn install
./vendor/bin/sail stop

sh shellscript/localDev.sh