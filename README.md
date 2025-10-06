# movie-app

これは、ReactのフロントエンドとFastAPIのバックエンドで構築された、映画情報閲覧アプリケーションです。

## 目次

- [前提条件](#-前提条件)
- [セットアップ](#-セットアップ)
  - [1-環境変数の設定](#1-環境変数の設定)
  - [2-バックエンドのセットアップ](#2-バックエンドのセットアップ)
  - [3-フロントエンドのセットアップ](#3-フロントエンドのセットアップ)
- [アプリケーションの実行](#-アプリケーションの実行)
  - [バックエンド](#バックエンド)
  - [フロントエンド](#フロントエンド)

## 前提条件

- [Node.js](https://nodejs.org/) (v18以降を推奨)
- [Python](https://www.python.org/) (v3.8以降を推奨)
- [The Movie Database (TMDB)](https://www.themoviedb.org/) のAPIキー

## セットアップ

### 1. 環境変数の設定

バックエンドは、TMDBからデータを取得するためにAPI認証情報が必要です。

1.  `backend` ディレクトリに移動します。
2.  `.env` という名前で新しいファイルを作成します。
3.  `.env` ファイルに以下の内容を追加し、`your_api_key` を実際のTMDB APIキーに置き換えてください。

```
VITE_API_KEY="your_api_key"
VITE_API_URL="https://api.themoviedb.org/3"
```

### 2. バックエンドのセットアップ

1.  `backend` ディレクトリに移動します。
2.  仮想環境の作成を推奨します:
    ```bash
    python -m venv venv
    ```
3.  仮想環境を有効化します:
    -   **Windows:**
        ```bash
        .\venv\Scripts\activate
        ```
    -   **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```
4.  必要なPythonパッケージをインストールします:
    ```bash
    pip install -r requirements.txt
    ```

### 3. フロントエンドのセットアップ

1.  `frontend` ディレクトリに移動します。
2.  必要なnpmパッケージをインストールします:
    ```bash
    npm install
    ```

## アプリケーションの実行

バックエンドとフロントエンドのサーバーを、それぞれ別のターミナルで同時に実行する必要があります。

### バックエンド

1.  `backend` ディレクトリにいること、そして仮想環境が有効化されていることを確認してください。
2.  以下のコマンドを実行してFastAPIサーバーを起動します:
    ```bash
    uvicorn main:app --reload
    ```
    サーバーは `http://127.0.0.1:8000` で利用可能になります。

### フロントエンド

1.  `frontend` ディレクトリにいることを確認してください。
2.  以下のコマンドを実行してVite開発サーバーを起動します:
    ```bash
    npm run dev
    ```
    アプリケーションは `http://localhost:5173` で利用可能になります。
