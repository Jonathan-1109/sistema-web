# SISTEMA WEB DE LOGÍSTICA Y OPTIMIZACIÓN 

1. Módulo Interactivo de Transporte (Cadena de Suministro) 
2. Módulo Interactivo de Asignación (Gestión de Talento)
3. Integración de la API de Groq y Reporte PDF Dinámico 

## Pasos

### Clonar repositorio
```bash
git clone https://github.com/Jonathan-1109/sistema-web.git
```
### Servidor fastapi

#### 1. Crear el entorno virtual

```bash
cd backend
python -m venv .venv
source .venv/bin/activate #linux/mac
.venv\Scripts\activate #windows
```

#### 2. Instalar dependencias
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 3. Generar una apikey 
Crea y obten una apikey en [GroqCloud](https://console.groq.com/) y crea un archivo .env en el backend, usando de ejemplo el .env.example

#### 4. Iniciar el servidor
```bash
fastapi dev app/main.py
```

### Frontend

#### 1. Instalar dependencias
```bash
cd frontend
pnpm install #o npm install
```

#### 2. Iniciar frontend
```bash
pnpm run dev #o npm run dev
```

