import "./datatable.css";

export default function DataTable({

    columns,
    children

}){

    return(

        <div className="datatable">

            {children}

        </div>

    )

}