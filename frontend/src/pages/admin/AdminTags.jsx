import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getTags,
    deleteTag,
} from "../../services/tagService";

import TagTable from "../../components/admin/TagTable";

import SearchBar from "../../components/admin/ui/Searchbar";
import Button from "../../components/admin/ui/Button";


export default function AdminTags() {

    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();


    async function loadTags() {

        try {

            const data =
                await getTags();

            setTags(data);

        } catch (err) {

            console.error(
                "Error cargando etiquetas:",
                err
            );

        }

    }


    useEffect(() => {

        loadTags();

    }, []);


    const filtered =
        tags.filter((tag) =>
            tag.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );


    async function handleDelete(tag) {

        const message =
            tag.product_count > 0

                ? `La etiqueta "${tag.name}" está siendo utilizada por ${tag.product_count} producto(s).\n\nSi la eliminas, también se eliminarán sus relaciones con esos productos.\n\n¿Deseas continuar?`

                : `¿Eliminar la etiqueta "${tag.name}"?`;


        if (!window.confirm(message))
            return;


        try {

            await deleteTag(tag.id);

            await loadTags();

        } catch (err) {

            console.error(
                "Error eliminando etiqueta:",
                err
            );

            alert(
                err.message ||
                "No se pudo eliminar la etiqueta."
            );

        }

    }


    return (

        <div className="page">

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20
                }}
            >

                <SearchBar
                    value={search}
                    onChange={setSearch}
                />


                <Button
                    onClick={() =>
                        navigate(
                            "/admin/tags/new"
                        )
                    }
                >
                    + Nueva etiqueta
                </Button>

            </div>


            <TagTable

                tags={filtered}

                onEdit={(tag) =>
                    navigate(
                        `/admin/tags/${tag.id}`
                    )
                }

                onDelete={handleDelete}

            />

        </div>

    );

}