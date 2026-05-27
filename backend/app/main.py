from fastapi import FastAPI
from .routers.transports import router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Nexuscore systems API")
app.include_router(router)
