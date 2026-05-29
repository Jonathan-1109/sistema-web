from fastapi import HTTPException
import io
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from datetime import datetime

env = Environment(loader=FileSystemLoader("./app/static"))

def create_pdf(payload, templateHTML: str, name:str) -> bytes:
    try:
        template = env.get_template(templateHTML)
        template_vars = payload.model_dump()
        
        rendered_html = template.render(**template_vars)
        
        pdf_buffer = io.BytesIO()
        HTML(string=rendered_html).write_pdf(target=pdf_buffer)
        pdf_buffer.seek(0)
        
        filename = f"Reporte_{name}_{datetime.now()}.pdf"
        
        return pdf_buffer, filename
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno generando el PDF: {str(e)}")