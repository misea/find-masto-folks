import {Link} from "react-router-dom";

export default function Fields({fields}) {
    return (<div id="browse" className="field-list">{
        fields.map((field)=>{
            return(<li key={field.id}>
            <Link to={`search?field=${field.id}`}>{field.title}</Link>
            </li>);}
            ) 
    }
    </div>);
}