# 環境構築

## `Windows` のみ必要なもの

基本的にはwsl上での開発を推奨しています。

### `WSL2`のインストール
旧wslは設定をいじる必要がありましたが、現在は以下のコマンド一つでinstallすることが出来ます。

```powershell
wsl -l -v   # 既にインストールされていないか確認
wsl --install
```

詳細については[公式サイト](https://learn.microsoft.com/ja-jp/windows/wsl/install)を確認してください。またOSやそのversionについては、`Ubuntu LTS`であれば問題ないと思います。

何かトラブルが生じた際には、再installをまずは試すと良いです。

`Ubuntu`アプリを直接起動するか、`PowerShell`や`command prompt`、`git bash`などで`ubuntu`といったコマンドでも起動することが出来ます。

以下のセクションでは`Mac`及び`Windows(wsl2: ubuntu)`どちらでも同じ操作で問題ありません。ただターミナルの違い（`Mac`のデフォルトは`zsh`、`Ubuntu`のデフォルトは`bash`）などから若干の違いがあります。括弧付けで (`Mac`)  (`Win`) と表記するので、自身の環境に合ったものを実行してください。

## 1. 各種ツールのインストール

### Homebrew

#### install

```shell
brew -v # 既にインストールされていないか確認
```

[公式サイト](https://brew.sh/)トップに記載のコマンドを実行してください。

上のコマンドを実行後、最後の方の出力で以下のような`Next steps`が表示される場合があります。

```shell
    ==> Next steps:
    - Run these two commands in your terminal to add Homebrew to your PATH:
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/user/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
```

指示通り表示された2行のコマンド（`PATH`を通すコマンド）を実行してください。なお、環境により若干の差異があるため、上で記載したものではなく必ず出力からコピーしてください。

version確認で実行できるか確認
```shell
brew -v
```

### git

#### install

`Mac`の場合はデフォルトで`git`がインストールされていることがあります。ただversionがかなり古いものな場合が多いため、`homebrew`版を使うことを推奨とします。

```shell
git --version # 既にインストールされていないか確認
brew install git
git --version   # 確認
```

#### SSH

```shell
mkdir ~/.ssh
cd ~/.ssh
ssh-keygen -t ed25519 -f ed25519_github
cat d25519_github.pub
> # 出力を https://github.com/settings/ssh/new に張り付ける
echo -e "Host github.com\n\tHostName github.com\n\tIdentityFile ~/.ssh\n\ted25519_github\n\tUser git" >> ~/.ssh/config
ssh -T git@github.com   # 疎通確認
> # githubのユーザー名が表示されれば成功
```

#### config

```shell
git --global config user.name <username>
git --global config user.email
```

リポジトリ毎に設定したい場合は、`clone`後リポジトリ内で上記コマンドの`--global`オプションを`--local`に変えて実行してください。

### Docker

#### install

基本的に`Docker Desktop`を使うのが丸いです。[公式サイト](https://www.docker.com/products/docker-desktop/)よりインストールしてください。なお`WSL`の場合もインストールするのは`windows`版です。

```shell
docker version # 確認
```


#### Tips (`Win`)

ただ`WSL` + `Docker Desktop`の環境だと、莫大なメモリ消費を起こす場合があります。回避方法としては
1. Docker Desktopを使わない（[公式ドキュメント](https://docs.docker.com/engine/install/ubuntu/)）
2. 使用可能メモリを制限する（[WSL2によるホストのメモリ枯渇を防ぐための暫定対処](https://qiita.com/yoichiwo7/items/e3e13b6fe2f32c4c6120)）

などがあります。


### VScode

#### install

[公式サイト](https://code.visualstudio.com/download)より自身の環境に合ったものをインストールしてください。なお`WSL`の場合もインストールするのは`windows`版です。

#### Settings (`Win`)

`VScode`で`wsl`のターミナルを開くと、`.profile`が読み込まれないことがあります。

1. `Ctrl + ,` で設定画面を開く
2. `terminal integrated profile linux`と検索し、`setting.jsonで編集`をクリック
3. 以下のように変更
```settings.json
"terminal.integrated.profiles.linux": {
    "bash": {
        "path": "bash",
        "icon": "terminal-bash",
        "args": ["-l"]
    },
```


## 2. Frontend

Frontendは`docker`ではなく、（知識がないので）別途環境を作ります。

### asdf


```shell
asdf --version  # 確認
brew install asdf
```

[公式ドキュメント](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf)の「3. Install asdf」欄から自身の環境のものを選んで、pathを通す。（特に変更していない場合、`WSL`の場合は`Bash & Homebrew`、`Mac`の場合は`ZSH & Homebrew`）


### Node

```shell
echo -e "yarn\ntypescript\nts-node\ntypesync\nnpm-check-updates" >> ~/.default-npm-packages    # nodeのデフォルトパッケージの指定
asdf plugin add nodejs
asdf install nodejs latest
asdf global nodejs latest
node -v # 確認
```



## 3. Project Initialization


```shell
git clone git@github.com:oginoshikibu/wikipedia-golf.git
cd wikipedia-golf.git

cp .env.example .env    # 必要な場合は別途編集

# Composer依存関係のインストール
# ref: https://readouble.com/laravel/10.x/ja/sail.html
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs

# コンテナの起動
echo "alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'" >> ~/.bashrc
exec $SHELL -l
sail up -d
# アプリケーションキーの作成
sail artisan key:generate
sail artisan migrate

# npm依存関係のインストール
yarn
# run: http://localhost
yarn dev

```
