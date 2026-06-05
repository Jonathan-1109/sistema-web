import io
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from datetime import datetime

env = Environment(loader=FileSystemLoader("./app/static"))

def create_pdf(payload, templateHTML: str, name:str) -> bytes:
    template = env.get_template(templateHTML)

    rendered_html = template.render(payload)
    pdf_buffer = io.BytesIO()
    HTML(string=rendered_html).write_pdf(target=pdf_buffer)
    pdf_buffer.seek(0)
    
    filename = f"Reporte_{name}_{datetime.now()}.pdf"
        
    return pdf_buffer, filename
    