from fastapi.testclient import TestClient

from .users import router

client = TestClient(router)


def test_pytest_setup():
    assert 1 == 1


def test_read_main():
    response = client.get("/users")
    assert response.status_code == 200
    assert response.json() == [{"username": "Guillaume"}, {"username": "Porta"}]
