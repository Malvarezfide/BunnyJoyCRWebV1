import { getWhatsAppUrl } from "../../utils/whatsapp";

function WhatsAppButton({ product, className = "" }) {
  const isAgotado = product.estado === "Agotado";

  return (
    <a
      href={isAgotado ? undefined : getWhatsAppUrl(product)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (isAgotado) {
          e.preventDefault();
        }
      }}
      className={`
        inline-flex
        items-center
        justify-center
        min-w-0
        overflow-hidden
        whitespace-nowrap
        ${className}
        ${
          isAgotado
            ? "bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none"
            : "bg-green-500 hover:bg-green-600 text-white"
        }
      `}
    >
      <span className="truncate">
        {isAgotado ? "Agotado" : "Consultar por WhatsApp"}
      </span>
    </a>
  );
}

export default WhatsAppButton;
