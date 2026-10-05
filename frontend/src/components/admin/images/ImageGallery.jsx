import "./ImageGallery.css";
import { useEffect, useRef, useState } from "react";

import ImageCard from "./ImageCard";
import { prepareImages } from "./imageUtils";
import DragDropArea from "./DragDropArea";

export default function ImageGallery({

  value = [],

  onChange,

}) {

  const inputRef = useRef(null);

  const [dragIndex, setDragIndex] = useState(null);
  
  const images = value;

  async function handleFiles(files) {

    const prepared = await prepareImages(files);

    if (prepared.errors.length) {

      alert(prepared.errors.join("\n"));

    }

    if (!prepared.images.length) {

      return;

    }

    const newImages = [

      ...images,

      ...prepared.images.map((img, index) => ({

        ...img,

        id: crypto.randomUUID(),

        existing: false,

        uploaded: false,

        position: images.length + index,

      })),

    ];

    onChange(newImages);

  }



  function handleChange(e) {

    handleFiles(Array.from(e.target.files));

    e.target.value = "";

  }



  function handleDragStart(index) {

    setDragIndex(index);

  }



  function handleDrop(index) {

    if (

      dragIndex === null ||

      dragIndex === index

    ) {

      return;

    }

    const updated = [...images];

    const moved = updated.splice(

      dragIndex,

      1

    )[0];

    updated.splice(

      index,

      0,

      moved

    );

    const reordered = updated.map(

      (img, index) => ({

        ...img,

        position: index,

      })

    );

    onChange(reordered);

    setDragIndex(null);

  }

  function removeImage(index) {

    const updated = images.filter(

      (_, i) => i !== index

    );

    onChange(updated);

  }



  async function replaceImage(index, file) {

    const prepared = await prepareImages([file]);

    if (!prepared.images.length) {

      return;

    }

    const updated = [...images];

    updated[index]={

		...updated[index],

		file:prepared.images[0].file,

		preview:prepared.images[0].preview,

		filename:null,

		status:"replaced"

	};

    onChange(updated);

  }



  return (

    <div className="image-gallery">
	
		{/* CONTADOR DE IMÁGENES */}
		<p className="image-counter">

		  {images.length}

		  {" "}

		  imagen{images.length !== 1 && "es"}

		</p>
		
		{/* AVISO DE CAMBIOS PENDIENTES */}
		{
		  images.some(
			image => image.status !== "existing"
		  )
		  &&
		  (
			<div className="image-warning">

			  Los cambios de imágenes se aplicarán al guardar el producto.

			</div>
		  )
		}

      <DragDropArea onFiles={handleFiles}>

		  <button
			type="button"
			onClick={() => inputRef.current.click()}
		  >
			+ Agregar imágenes
		  </button>

		  <input
			hidden
			multiple
			ref={inputRef}
			type="file"
			accept=".jpg,.jpeg,.png,.webp,.avif"
			onChange={handleChange}
		  />

		  <div className="image-gallery-grid">

			{images.map((image,index)=>(

			  <ImageCard
				key={image.id}
				image={image}
				index={index}
				onDelete={() => removeImage(index)}
				onReplace={(file)=>replaceImage(index,file)}
				onDragStart={handleDragStart}
				onDrop={handleDrop}
			  />

			))}

		  </div>

		</DragDropArea>

    </div>

  );

}