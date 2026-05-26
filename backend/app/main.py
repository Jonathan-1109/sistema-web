from fastapi import FastAPI, Request, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional
# Importaciones para el Rate Limiting

# 1. INSTANCIA Y CONFIGURACIÓN DEL RATE LIMITER
# Usamos la IP del cliente (get_remote_address) como identificador para el límite
app = FastAPI(title="API Profesional con POO y Rate Limit")

@app.get("/")
async def root():
    return {"hello": "world"}