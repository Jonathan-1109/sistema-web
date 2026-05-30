from fastapi import FastAPI
from .routers.transports import router
from .routers.requestGroq import router_groq
from .routers.assignment import router_agm
from .routers.routePDF import router_pdf
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Nexuscore systems API")
app.include_router(router)
app.include_router(router_agm)
app.include_router(router_groq)
app.include_router(router_pdf)
