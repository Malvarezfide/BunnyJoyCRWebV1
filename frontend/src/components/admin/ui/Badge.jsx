import "./Badge.css";
export default function Badge({active}){

    return(

        <span

            className={
                active
                ? "badge badge-success"
                : "badge badge-danger"
            }

        >

            {active ? "Activo" : "Inactivo"}

        </span>

    )

}