from fastapi import FastAPI, Request, HTTPException, Depends, status

app = FastAPI(title="API")

@app.get("/")
async def root():
    return {"hello": "world"}
