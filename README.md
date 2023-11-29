# wikipedia-golf

# local環境構築

## 使用技術

- Laravel
- React & TypeScript
- Docker (sail)
- Vite

## 環境構築手順

前提：`git`, `Docker` install済み

```bash
git clone git@github.com:oginoshikibu/wikipedia-golf.git
cd wikipedia-golf.git

# 必要な場合は別途編集
cp .env.example .env

# Composer依存関係のインストール
# ref: https://readouble.com/laravel/10.x/ja/sail.html
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs

# コンテナの起動
# sail = ./vendor/bin/sail
sail up -d
# アプリケーションキーの作成
sail artisan key:generate

# asdfのインストール
brew install asdf
echo -e "\n. $(brew --prefix asdf)/libexec/asdf.sh" >> ${ZDOTDIR:-~}/.zshrc
exec $SHELL -l

# デフォルトパッケージの作成
touch ~/.default-npm-packages 
echo -e "yarn\ntypescript\nts-node\ntypesync\nnpm-check-updates" >> ~/.default-npm-packages 

# nodejsのインストール
asdf plugin add nodejs
asdf install nodejs latest
asdf global nodejs latest

# npm依存関係のインストール
yarn
# run: http://localhost
yarn dev

```

## ローカル実行

```bash
# コンテナの起動
sail up -d
# run
yarn dev
# コンテナの終了
sail down
```

DB構築は未実施
