import StatusBadge from "../common/StatusBadge";
import CategoryBadge from "../common/CategoryBadge";
import WhatsAppButton from "../common/WhatsAppButton";
import ShareButton from "../common/ShareButton";
import site from "../../config/site";
import { formatPrice } from "../../utils/formatPrice";

function ProductInfo({ product }) {

  return (
    <div className="space-y-6">

        <div>
			<h1 className="text-4xl font-bold text-gray-800">
			  {product.nombre}
			</h1>

			<div className="mt-3">
			  <CategoryBadge categoria={product.categoria} />
			</div>
		  </div>

		  <div>
			<p className="text-4xl font-bold text-rose-500">
			  {formatPrice(product.precio)}
			</p>
		  </div>

		  <div className="flex items-center gap-3">
			<span className="font-medium">
			  Estado:
			</span>

			<StatusBadge estado={product.estado} />
		  </div>

		  <div>
			<h3 className="font-semibold text-lg">
			  Descripción
			</h3>

			<p className="mt-2 text-gray-600 leading-7">
			  {product.descripcion}
			</p>
		  </div>

		  <div className="space-y-3">
			<WhatsAppButton
			  product={product}
			  className="block w-full rounded-lg py-2 text-center transition"
			/>

			<ShareButton
			  product={product}
			/>
		  </div>

		</div>

  );
}

export default ProductInfo;