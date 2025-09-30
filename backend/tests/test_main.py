from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)

def test_get_popular_movies():
    """
    /api/movie/popular エンドポイントをテストします。
    """
    response = client.get("/api/movie/popular")
    assert response.status_code == 200
    # レスポンスがJSONオブジェクトであり、'results'キー（リスト）を持っているか確認します
    response_json = response.json()
    assert isinstance(response_json, dict)
    assert "results" in response_json
    assert isinstance(response_json["results"], list)

def test_get_movie_details_not_found():
    """
    存在しない映画IDで /api/movie/{movie_id} エンドポイントをテストします。
    """
    # 存在しそうにない映画ID
    non_existent_movie_id = 999999999
    response = client.get(f"/api/movie/{non_existent_movie_id}")
    # 外部APIは404を返し、プロキシはそれを転送する必要があります
    assert response.status_code == 404

