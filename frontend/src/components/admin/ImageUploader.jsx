import "./ImageUploader.css";
import { useEffect, useRef, useState } from "react";
import {
  uploadImages,
  deleteImage
} from "../../services/uploadService";
import imageCompression from "browser-image-compression";

const API = "";

export default function ImageUploader({
  value,
  onUpload,
}) {
  const inputRef = useRef(null);

  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif"
];

  useEffect(() => {

    if (!Array.isArray(value)) {
        setPreviews([]);
        return;
    }

    setPreviews(
        value.map(filename => `${API}/media/${filename}`)
    );

}, [value]);

  async function compress(file){

      return await imageCompression(file,{
          maxSizeMB:1,
          maxWidthOrHeight:1920,
          useWebWorker:true
      });

  }

  async function upload(files){

    setLoading(true);

    try{

        const compressedFiles = [];

        const previews = [];

        for(const file of files){

            if(!allowedTypes.includes(file.type)){
                alert(`${file.name} no es un formato válido`);
                continue;
            }

            const compressed = await compress(file);

            compressedFiles.push(compressed);

            previews.push(URL.createObjectURL(compressed));

        }

        setPreviews(previews);

        const result = await uploadImages(compressedFiles);

        onUpload(
			result.files.map(file => file.filename)
		);

    }

    finally{

        setLoading(false);

    }

}

  const handleChange=(e)=>{

    upload(Array.from(e.target.files));

};

  const handleDrop=(e)=>{

    e.preventDefault();

    upload(Array.from(e.dataTransfer.files));

};

  return (

    <div className="image-uploader">

      <div

        className="upload-box"

        onClick={() => inputRef.current.click()}

        onDragOver={(e) => e.preventDefault()}

        onDrop={handleDrop}

      >

        <input
			ref={inputRef}
			hidden
			type="file"
			multiple
			accept=".jpg,.jpeg,.png,.webp,.avif"
			onChange={handleChange}
		/>

        {

          previews.length > 0 ?

          <div className="preview-grid">

			  {
				  previews.map((src,index)=>

					  <img
						  key={index}
						  src={src}
						  className="image-preview"
					  />

				  )
		  	  }

		  </div>

          :

          <div className="upload-placeholder">

            <div style={{fontSize:50}}>📷</div>

            <strong>

              Selecciona una imagen

            </strong>

            <small>

              o arrástrala aquí

            </small>

          </div>

        }

      </div>

      {

        loading &&

        <p>

          Subiendo imagen...

        </p>

      }

      {

        previews &&

        <div className="upload-actions">

          <button

            type="button"

            onClick={() => inputRef.current.click()}

          >

            Cambiar imagen

          </button>

          <button

            type="button"

            onClick={async()=>{

				for(const image of value){

					await deleteImage(image);

				}


				setPreviews([]);

				onUpload([]);

			}}

          >

            Eliminar

          </button>

        </div>

      }

    </div>

  );

}