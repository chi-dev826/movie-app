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

# --- Exception Handlers ---
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
        content={"detail": f"An error occurred while requesting the external API: {exc}"},
    )

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],  # Adjust this to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependencies ---
async def get_api_client():
    """Dependency to get a pre-configured httpx.AsyncClient."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "accept": "application/json"
    }
    async with httpx.AsyncClient(base_url=API_URL, headers=headers) as client:
        yield client

# --- Reusable Proxy Logic ---
async def execute_proxy_request(request: Request, client: httpx.AsyncClient):
    """Helper function to perform the actual proxying."""
    path = request.url.path.replace("/api", "")
    query_params = dict(request.query_params)

    if 'language' not in query_params:
        query_params['language'] = 'ja'

    response = await client.get(path, params=query_params)
    response.raise_for_status()  # Handled by the global exception handler
    return response.json()

# --- API Endpoints ---
@app.get("/api/movie/{movie_id}/full")
async def full_movie_details(movie_id: int, client: httpx.AsyncClient = Depends(get_api_client)):
    """Endpoint to get full movie details by running multiple API calls in parallel."""
    requests = [
        client.get(f"/movie/{movie_id}", params={"language": "ja"}),
        client.get(f"/movie/{movie_id}/videos", params={"language": "ja"}),
        client.get(f"/movie/{movie_id}/similar", params={"language": "ja", "page": "1"}),
        client.get(f"/movie/{movie_id}/images", params={"language": "ja"}),
    ]
    
    # Run all requests concurrently
    details_res, videos_res, similar_res, images_res = await asyncio.gather(*requests)

    # Check status for all responses
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
    """Proxies requests to the /movie/popular endpoint."""
    return await execute_proxy_request(request, client)

@app.get("/api/search/movie")
async def search_movies(request: Request, client: httpx.AsyncClient = Depends(get_api_client)):
    """Proxies requests to the /search/movie endpoint."""
    return await execute_proxy_request(request, client)
