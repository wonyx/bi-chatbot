# BI Chatbot

## Overview
BI Chatbot is a web application that allows users to interact with a chatbot powered by Google Gemini. The chatbot is designed to answer questions related to business intelligence (BI) and data analytics.
This project is built on top of [Chat SDK](https://github.com/vercel/ai-chatbot) and DuckDB, and it uses [Google Gemini](https://ai.google.dev/) for natural language processing.

## Architecture
[Architecture](https://chat-sdk.dev/docs/getting-started/architecture)を参考にしてください。
オリジナルのChat SDKのアーキテクチャは、VercelのサーバーレスアーキテクチャやVercel Blob, Neon, xAIのGrokを前提としていますが、BI ChatbotはGoogle Cloudとコンテナを中心に構成しています。
具体的には、Google Cloud Run, Cloud SQL, Geminiを使用しています。
下記の表は、BI ChatbotとChat SDKのアーキテクチャの違いを示しています。
| Category | Chat SDK | BI Chatbot | 備考 |
|----------|----------|------------|------|
| Hosting  | Vercel   | Cloud Run | |
| Database | Neon     | Cloud SQL  | |
| Blob Storage | Vercel Blob | - | 添付ファイルは無効化している |
| AI Model | xAI Grok | Google Gemini | |
| Cache | Vercel | - | 複数のインスタンスで共有するキャッシュはないので、一つのインスタンスで構成する |
| KV Store | Redis | - | ChatのResumable streamsのためにRedisを使えるが、使用していない |

## Prerequisites
- [mise](https://mise.jdx.dev/)

    ```bash
    mise install
    ```

- docker

## Development
### Environment Variables
Create a `.env.local` file in the root directory of the project.
```bash
cp .env.example .env.local
```

Google Cloudのデフォルト認証を設定するために、以下のコマンドを実行してください。
```bash
gcloud auth application-default login
```

`GOOGLE_VERTEX_PROJECT`は、Google CloudのProjectIDを指定してください。
そのほかの、環境変数はexampleのままで動作するはずです。

### Setup

- compose
```bash
# start db only
docker compose up -d
```

- install dependencies
```
pnpm install
```

- migrate database
```bash
pnpm db:migrate
```

### Start the development server
```bash
pnpm dev
```

## Deployment
### Build

```bash
IMAGE=asia-northeast1-docker.pkg.dev/<your-project>/<repo-name>/bi-chatbot:latest
docker build --platform linux/amd64 -t $IMAGE .
```
### Push to Artifact Registry
```bash
docker push $IMAGE
```

### Deploy to Cloud Run
```bash
SERVICE_NAME=bi-chatbot
REGION=asia-northeast1
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE \
  --region $REGION
```
