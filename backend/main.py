import os
import asyncio
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

load_dotenv()

API_KEY = os.getenv("VITE_API_KEY")
API_URL = os.getenv("VITE_API_URL")

if not API_KEY or not API_URL:
    raise RuntimeError("API_KEY and API_URL must be set in the environment variables.")

app = FastAPI()

# --- 例外ハンドラ ---
@app.exception_handler(httpx.HTTPStatusError)
async def http_status_error_handler(request: Request, exc: httpx.HTTPStatusError):
    return JSONResponse(
        status_code=exc.response.status_code,
        content={"detail": exc.response.text},
    )

@app.exception_handler(httpx.RequestError)
async def request_error_handler(request: Request, exc: httpx.RequestError):
    return JSONResponse(
        status_code=500,
        content={"detail": f"外部APIへのリクエスト中にエラーが発生しました: {exc}"},
    )

# --- ミドルウェア ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],  # フロントエンドのオリジンに合わせて調整してください
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 依存関係 ---
async def get_api_client():
    """事前設定されたhttpx.AsyncClientを取得するための依存関係。"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "accept": "application/json"
    }
    async with httpx.AsyncClient(base_url=API_URL, headers=headers) as client:
        yield client

# --- 再利用可能なプロキシロジック ---
async def execute_proxy_request(request: Request, client: httpx.AsyncClient):
    """実際のプロキシ処理を実行するためのヘルパー関数。"""
    path = request.url.path.replace("/api", "")
    query_params = dict(request.query_params)

    if 'language' not in query_params:
        query_params['language'] = 'ja'

    response = await client.get(path, params=query_params)
    response.raise_for_status()  
    return response.json()

# --- APIエンドポイント ---
@app.get("/api/movie/{movie_id}/full")
async def full_movie_details(movie_id: int, client: httpx.AsyncClient = Depends(get_api_client)):
    """複数のAPI呼び出しを並行して実行し、映画の完全な詳細情報を取得するエンドポイント。"""
    requests = [
        client.get(f"/movie/{movie_id}", params={"language": "ja"}),
        client.get(f"/movie/{movie_id}/videos", params={"language": "ja"}),
        client.get(f"/movie/{movie_id}/similar", params={"language": "ja", "page": "1"}),
        client.get(f"/movie/{movie_id}/images", params={"language": "ja"}),
    ]
    
    # すべてのリクエストを並行して実行
    details_res, videos_res, similar_res, images_res = await asyncio.gather(*requests)

    # すべてのレスポンスのステータスを確認
    for res in (details_res, videos_res, similar_res, images_res):
        res.raise_for_status()

    return {
        "details": details_res.json(),
        "videos": videos_res.json(),
        "similar": similar_res.json(),
        "images": images_res.json()
    }

@app.get("/api/movie/popular")
async def popular_movies(request: Request, client: httpx.AsyncClient = Depends(get_api_client)):
    """/movie/popularエンドポイントへのリクエストをプロキシする。"""
    return await execute_proxy_request(request, client)

@app.get("/api/search/movie")
async def search_movies(request: Request, client: httpx.AsyncClient = Depends(get_api_client)):
    """/search/movieエンドポイントへのリクエストをプロキシする。"""
    return await execute_proxy_request(request, client)
