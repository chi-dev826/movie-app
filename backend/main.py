
import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

API_KEY = os.getenv("VITE_API_KEY")
API_URL = os.getenv("VITE_API_URL")

if not API_KEY or not API_URL:
    raise RuntimeError("API_KEY and API_URL must be set in the environment variables.")

app = FastAPI()

# CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust this to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def proxy_request(request: Request):
    """
    A reusable function to proxy requests to the external TMDB API.
    It forwards the path and query parameters from the incoming request.
    """
    path = request.url.path.replace("/api", "")
    query_params = dict(request.query_params)

    # Ensure language is set to Japanese if not provided
    if 'language' not in query_params:
        query_params['language'] = 'ja'

    endpoint = f"{API_URL}{path}"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "accept": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            # Forward the request to the TMDB API
            response = await client.get(endpoint, params=query_params, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code, detail=e.response.text
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=500,
                detail=f"An error occurred while requesting the external API: {e}",
            )


# Generic proxy endpoints
@app.get("/api/movie/popular")
async def popular_movies(request: Request):
    return await proxy_request(request)

@app.get("/api/movie/{movie_id}")
async def movie_details(request: Request):
    return await proxy_request(request)

@app.get("/api/movie/{movie_id}/videos")
async def movie_videos(request: Request):
    return await proxy_request(request)

@app.get("/api/movie/{movie_id}/similar")
async def similar_movies(request: Request):
    return await proxy_request(request)

@app.get("/api/movie/{movie_id}/images")
async def movie_images(request: Request):
    return await proxy_request(request)

@app.get("/api/search/movie")
async def search_movies(request: Request):
    return await proxy_request(request)
