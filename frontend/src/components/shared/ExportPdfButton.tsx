interface ExportPdfButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function ExportPdfButton({ onClick, loading = false, disabled = false }: ExportPdfButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="btn-secondary shrink-0"
    >
      {loading ? 'Generando PDF…' : 'Descargar PDF'}
    </button>
  );
}
