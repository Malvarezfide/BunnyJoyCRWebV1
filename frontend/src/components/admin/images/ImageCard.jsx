import "./ImageCard.css";
import { getImageUrl } from "./imageUtils";

export default function ImageCard({
  image,
  index,
  onDelete,
  onReplace,
  onDragStart,
  onDrop,
}) {

  const inputId = `replace-${image.id}`;

  const src =
	  image.preview ||
	  getImageUrl(image.filename);

  return (

    <div

      className="image-card"

      draggable

      onDragStart={() =>
        onDragStart(index)
      }

      onDragOver={(e) =>
        e.preventDefault()
      }

      onDrop={() =>
        onDrop(index)
      }

    >

      <div className="image-card-container">
	  
	  <div className={`image-status ${image.status}`}>

		{
			image.status==="existing" &&
			"Guardada"
		}

		{
			image.status==="new" &&
			"Nueva"
		}

		{
			image.status==="replaced" &&
			"Reemplazada"
		}

	</div>

        {src && (
		  <img
			src={src}
			alt={`Imagen ${index + 1}`}
			className="image-card-preview"
		  />
		)}


        {
		 index === 0 &&
		 (
		   <div className="image-primary-badge">
			 ⭐ Principal
		   </div>
		 )
		}


      </div>


      <div className="image-card-actions">


        <label

          htmlFor={inputId}

          className="image-btn"

        >
          🖊 Cambiar

        </label>


        <button

          type="button"

          className="image-btn image-btn-danger"

          onClick={onDelete}

        >
          🗑 Eliminar

        </button>


      </div>


      <input

        id={inputId}

        hidden

        type="file"

        accept=".jpg,.jpeg,.png,.webp,.avif"

        onChange={(e)=>{

          const file =
            e.target.files[0];


          if(file){

            onReplace(file);

          }


          e.target.value = "";

        }}

      />


    </div>

  );

}