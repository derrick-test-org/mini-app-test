from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from databases import Database

DATABASE_URL = "sqlite:///./test.db"
database = Database(DATABASE_URL)

app = FastAPI()

class Observation(BaseModel):
    id: int | None = None
    location: str
    clarity: str

@app.on_event("startup")
async def startup():
    await database.connect()
    await database.execute("""
        CREATE TABLE IF NOT EXISTS observations (
            id INTEGER PRIMARY KEY,
            location TEXT NOT NULL,
            clarity TEXT NOT NULL
        );
    """)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/observations/", response_model=Observation)
async def create_observation(obs: Observation):
    query = "INSERT INTO observations(location, clarity) VALUES (:location, :clarity)"
    obs_id = await database.execute(query, values=obs.dict())
    obs.id = obs_id
    return obs

@app.get("/observations/", response_model=List[Observation])
async def get_observations():
    query = "SELECT * FROM observations"
    return await database.fetch_all(query)

