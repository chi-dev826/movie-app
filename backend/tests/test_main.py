from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)

def test_get_popular_movies():
    """
    Tests the /api/movie/popular endpoint.
    """
    response = client.get("/api/movie/popular")
    assert response.status_code == 200
    # Check if the response is a JSON object and has a 'results' key which is a list
    response_json = response.json()
    assert isinstance(response_json, dict)
    assert "results" in response_json
    assert isinstance(response_json["results"], list)

def test_get_movie_details_not_found():
    """
    Tests the /api/movie/{movie_id} endpoint with a non-existent movie ID.
    """
    # A movie ID that is highly unlikely to exist
    non_existent_movie_id = 999999999
    response = client.get(f"/api/movie/{non_existent_movie_id}")
    # The external API should return a 404, which our proxy should forward.
    assert response.status_code == 404

