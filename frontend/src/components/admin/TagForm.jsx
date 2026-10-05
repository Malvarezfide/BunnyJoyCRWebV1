import { useEffect, useState } from "react";


const initialState = {
    name: "",
};


export default function TagForm({

    initialData,
    onSubmit,
    onCancel

}) {

    const [form, setForm] =
        useState(initialState);


    useEffect(() => {

        if (initialData) {

            setForm({
                ...initialState,
                ...initialData,
            });

        } else {

            setForm(
                initialState
            );

        }

    }, [initialData]);


    function handleChange(e) {

        const {
            name,
            value
        } = e.target;


        setForm((prev) => ({

            ...prev,

            [name]: value,

        }));

    }


    function submit(e) {

        e.preventDefault();


        if (!form.name.trim()) {

            alert(
                "Ingrese un nombre."
            );

            return;

        }


        onSubmit({

            name:
                form.name.trim(),

        });

    }


    return (

        <form
            className="category-form"
            onSubmit={submit}
        >


            <div className="grid-form">

                <div className="col">

                    <label>
                        Nombre
                    </label>


                    <input

                        name="name"

                        value={
                            form.name
                        }

                        onChange={
                            handleChange
                        }

                        placeholder="Ej. navidad"

                    />

                </div>

            </div>


            <div className="form-actions">

                <button type="submit">
                    Guardar
                </button>


                <button
                    type="button"
                    onClick={onCancel}
                >
                    Cancelar
                </button>

            </div>

        </form>

    );

}