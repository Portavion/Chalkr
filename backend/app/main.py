from fastapi import FastAPI

from .routers import users

app = FastAPI()

app.include_router(users.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Backend running: current version v1"}
