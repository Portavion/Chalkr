from fastapi.testclient import TestClient

# from .users import router
# client = TestClient(router)

from ..main import app

client = TestClient(app)


def test_read_users():
    response = client.get("api/v1/users")
    assert response.status_code == 200
    assert response.json() == [{"username": "Guillaume"}, {"username": "Porta"}]
