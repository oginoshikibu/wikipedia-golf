# index page
- Log in ボタン
  1. [ログイン画面](#ログイン画面)へ遷移
- How to Play ボタン
  1. [ゲームプレイ画面](#ゲームプレイ画面)へ遷移
- Play ボタン
  1. [ゲームプレイ画面](#ゲームプレイ画面)へ遷移

# ログイン画面
- inputMail
  1. メールアドレスを入力できる。    
- Continue ボタン
  - inputMailに......
  1. 文字列が入力されていないとき、「メールアドレスを入力してください」という文章を表示する。
  2. 文字列がメールアドレスとして無効なとき、「有効なメールアドレスを入力してください」という文章を表示する。
  3. 文字列がメールアドレスとして有効であり、データベースに登録されたものであるとき、新しくinputPassword、log inボタン、Forgot your passwordリンクを表示する。
  4. 文字列がメールアドレスとして有効であるが、データベースに登録されていないとき、パスワードを登録するための新しいinputPassword、create accountボタンを表示する。
  - inputPassword
    1. 6文字以上255文字以下のパスワードを入力できる。
    2. 256文字以上の入力はできない。
    3. 空白（スペース）は文字数に数えない。
    4. 半角英数字以外の文字の入力は受け入れない。
  -  log in ボタン
     - inputPasswordに...... 
      1. 文字列が入力されていないとき、「パスワードを入力してください」という文章を表示する。
      2. 文字列が登録されたパスワードと一致しないとき、「メールアドレスまたはパスワードが間違っています」という文章を表示する。
      3. 文字列が登録されたパスワードと一致するとき、[ゲームプレイ画面](#ゲームプレイ画面)へと遷移する。
  - log in without password ボタン
    1. [Check画面](#Check画面)へと遷移する。
  - Forgot your password? ボタン
    1. [Reset your password画面](#Reset-your-password画面)に遷移する。

  - inputUsername
    1. 6文字以上255文字以下のユーザー名を入力できる。
    2. 256文字以上の入力はできない。
    3. 空白（スペース）は文字数に数えない。
    4. 半角英数字以外の文字の入力は受け入れない。
  - create account ボタン
     - inputPasswordに......
     1. 文字列が入力されていないとき、「パスワードを入力してください」という文章を表示する。
     2. 文字列に半角英数字以外の文字が含まれるとき、「ある種の複雑な文字は私たちのパスワードでは許容されていません」という文章を表示する。
     3. 文字列が５文字以下であるとき、「パスワードは最低６文字以上です」という文章を表示する。
     4. 文字列が６文字以上であるとき、[You're all set画面](#You're-all-set画面)へ遷移する。


- 連携ボタン
  1. ウィンドウ外にポップアップを表示する。
     1. Google, Facebook, Appleアカウントと連携できる。

# ゲームプレイ画面
  1. How to play ボタンから遷移してきたとき、ポップアップ_1を表示する。
  1. How to play ボタン以外から遷移してきたとき、ポップアップ_2を表示する。
  - ポップアップ_1
    1. 遊び方のポップアップを表示する。
    1. ポップアップ内部に[ログイン画面](#ログイン画面)へのリンクを表示する。
    1. ゲーム更新通知設定のリンクを表示する。
    1. 右上のバツ印またはポップアップの外部をクリックで[ゲームプレイ画面](#ゲームプレイ画面)へ遷移する。
  - ポップアップ_2
    1. 初めてのサイト訪問ならば、ポップアップ_1を表示する。
    1. 当日中の再訪問ならば、ポップアップは表示しない。
    1. 別日の訪問ならば、[ログイン画面](#ログイン画面)への遷移を推奨するポップアップを表示する。
      1. 右上のバツ印またはポップアップの外部をクリックで[ゲームプレイ画面](#ゲームプレイ画面)へ遷移する。
  - wikipediaのページを埋め込み
    1. クリックを無効化し、ページ遷移をできないようにする
    2. タブキーによる選択も不可能にする

  - ヘッダー（上部固定）
    - ゴールのページ名
    - 現在の打数
    - 次のページへのフォーム（input & Shot ボタン）
      - そのページ内にinput欄の入力に該当するページリンクがなければ、その旨を表示
      - 有効であれば、打数を+1し、wikipediaのページ埋め込みを更新する
    - ヘルプアイコン ボタン
      1. ポップアップ_1を表示する。
    - ヒストグラムアイコン ボタン
      1. 過去のプレイ記録のポップアップを表示する。
         1. プレイ回数
         2. 勝率
         3. 連勝記録
         4. 最高連勝記録
         5. クリア速度のヒストグラム
    - オプションアイコン ボタン
      1. 機能設定のプルダウンが開く。
         1. Hard mode: 問題を難しくできる。
         2. Dark theme: 画面のカラーリングを変更できる。
         3. High contrast mode:  画面のコントラストを変更できる。
         4. on screen keyboard input only:  画面上のキーボードからだけの文字入力を許可する。
         5. report bug:  バグを報告する。
         6. questions(FAQ):  [FAQ画面](#FAQ画面)へ遷移する。
    - log in済みの場合は、ユーザー名を表示

# Reset your password画面
- inputMail
  1. メールアドレスを入力できる。
- Continue ボタン
  - inputMailに...
  1. 文字列が入力されていないとき、「有効なメールアドレスを入力してください」という文章を表示する。
  2. 文字列がメールアドレスとして無効なとき、「有効なメールアドレスを入力してください」という文章を表示する。
  3. 文字列がメールアドレスとして有効であるとき、[Check画面](#Check画面)へ遷移する。
  - inputMailに入力されたメールアドレスと、inputMailに入力されたメールアドレスが異なるとき、パスワードを変更するリンクが添付されたメールは送信しない。

# Check画面
- inputMailに入力したメールアドレスにメールを送ったことを意味する文章を表示する。「（inputMailに入力したメールアドレス）宛てにメールを送信しました。」という文章を表示する。
- [メール画面](#メール画面)への遷移を促す文章を表示する。「inboxに届いたメールを確認してください。迷惑メールフォルダに振り分けられている場合もあるため注意してください。」という文章を表示する。
- re-enter your email address ボタン
  1. [Reset your password画面](#Reset-your-password画面)へ遷移する。

# メール画面
- [ログイン画面](#ログイン画面)のLog in without password ボタンから[Check画面](#Check画面)を経由して遷移してくるとき、log in URL ボタンを表示する。
- [Reset your password画面](#Reset-your-password画面)のContinue ボタンから[Check画面](#Check画面)を経由して遷移してくるとき、change pass URL ボタンを表示する。
- log in URL ボタン
  1. [ゲームプレイ画面](#ゲームプレイ画面)へと遷移する。
- change pass URL ボタン
  1. [パスワード変更画面](#パスワード変更画面)へと遷移する。

# パスワード変更画面
- inputPassword
  1. 6文字以上255文字以下のパスワードを入力できる。
  1. 256文字以上の入力はできない。
  1. 空白（スペース）は文字数に数えない。
  1. 半角英数字以外の文字の入力は受け入れない。
- Continue ボタン
  - inputPasswordに......
  1. 文字列が入力されていないとき、「パスワードを入力してください」という文章を表示する。
  2. 文字列に半角英数字以外の文字が含まれるとき、「ある種の複雑な文字は私たちのパスワードでは許容されていません」という文章を表示する。
  3. 文字列が５文字以下であるとき、「パスワードは最低６文字以上です」という文章を表示する。
  4. 文字列が６文字以上であるとき、[You're all set画面](#You're-all-set画面)へ遷移する。
- [メール画面](#メール画面)のlog in URL ボタンから遷移してくるとき、Show ボタンを表示する。
  - Show ボタン
    1. inputPasswordに入力された文字列がそのまま出力され、それらを識別できるようにする。
  - Hide ボタン
    1. inputPasswordに入力された文字列を黒丸に変換し、それらを識別できないようにする。

# You're all set画面
- 「あなたの新しいパスワードが保存され、あなたはログインした状態です」という文章を表示する。
- Continue ボタン
  1. [ゲームプレイ画面](#ゲームプレイ画面)へ遷移する。

# FAQ画面
- FAQを列挙する。