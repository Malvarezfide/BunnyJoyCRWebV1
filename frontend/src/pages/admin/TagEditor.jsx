import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TagForm from "../../components/admin/TagForm";

import {
    getTag,
    createTag,
    updateTag,
} from "../../services/tagService";


export default function TagEditor() {

    const navigate =
        useNavigate();

    const { id } =
        useParams();


    const [loading, setLoading] =
        useState(true);

    const [tag, setTag] =
        useState(null);


    useEffect(() => {

        async function load() {

            try {

                if (!id) {

                    setLoading(false);

                    return;

                }


                const found =
                    await getTag(id);


                setTag(
                    found || null
                );

            } catch (err) {

                console.error(
                    "Error cargando etiqueta:",
                    err
                );

            } finally {

                setLoading(false);

            }

        }


        load();

    }, [id]);


    async function handleSave(data) {

        try {

            if (id) {

                await updateTag(
                    id,
                    data
                );

            } else {

                await createTag(
                    data
                );

            }


            navigate(
                "/admin/tags"
            );

        } catch (err) {

            console.error(
                "Error guardando etiqueta:",
                err
            );


            alert(
                err.message ||
                "No se pudo guardar la etiqueta."
            );

        }

    }


    if (loading) {

        return (
            <h2>
                Cargando...
            </h2>
        );

    }


    return (

        <div className="page">

            <h1>
                {id
                    ? "Editar etiqueta"
                    : "Nueva etiqueta"}
            </h1>


            <TagForm

                initialData={tag}

                onSubmit={handleSave}

                onCancel={() =>
                    navigate(
                        "/admin/tags"
                    )
                }

            />

        </div>

    );

}