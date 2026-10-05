import "./Searchbar.css";
export default function SearchBar({

    value,
    onChange

}){

    return(

        <input

            className="search"

            placeholder="Buscar..."

            value={value}

            onChange={(e)=>onChange(e.target.value)}

        />

    )

}