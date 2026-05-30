from fastapi import APIRouter, status, HTTPException
from fastapi.responses import StreamingResponse
from ..utils.createPDF import create_pdf
from ..schemas.data import dataPDF, dataHungarianPDF

router_pdf = APIRouter(prefix="/pdf")

@router_pdf.post("/")
async def generate_pdf(request: dataPDF):
    try:
        request.conclusion = request.conclusion.replace("*","") 
        pdf_bytes, name = create_pdf(request,"transportTemplate.html","Reporte")
        return StreamingResponse(
                pdf_bytes,
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename={name}"}
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al generar el PDF",
        )

@router_pdf.post("/hungarian")
async def generate_pdf(request: dataHungarianPDF):
    try:
        request.conclusion = request.conclusion.replace("*","") 
        pdf_bytes, name = create_pdf(request, "hungarianTemplate.html", "Asignación")
        return StreamingResponse(
                pdf_bytes,
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename={name}"}
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al generar el PDF" ,
        )
