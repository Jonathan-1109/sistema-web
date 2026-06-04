from fastapi import FastAPI
from .routers.transports import router
from .routers.route_groq import router_groq
from .routers.assignment import router_agm
from .routers.routePDF import router_pdf
from dotenv import load_dotenv
from .db.storage import strg
from os import getenv

load_dotenv()

async def lifespan(app: FastAPI):
    await strg.connect(getenv("REDIS_URL"))
    yield
    await strg.disconnect()

app = FastAPI(title="Nexuscore systems API", lifespan=lifespan)
app.include_router(router)
app.include_router(router_agm)
app.include_router(router_groq)
app.include_router(router_pdf)
