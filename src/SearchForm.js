import { Form, useSubmit } from "react-router-dom"

export default function SearchForm({ q, action, fieldId, fields }) {
    const submit = useSubmit();
    return (
        <Form className="search-form simple_form" id="search-form" role="search" action={action}>
            <div className="search">
                <input className="search__input" id="q"
                    aria-label="Search for people"
                    placeholder="Search names of people and academic fields"
                    type="search"
                    defaultValue={q}
                    name="q" />
                <div role="button" tabIndex="0" className="search__icon"><i className="fa fa-search active"></i><i className="fa fa-times-circle" aria-label="Search"></i></div>
                <div id="search-spinner" aria-hidden hidden={true} />
                {fieldId ? 
                            <select name="field" id="field" defaultValue={fieldId} onChange={(e)=>submit(e.currentTarget.form)}>
                            {fields.map((field)=>{
                                return  <option key={field.id} value={field.id}>{field.title}</option>   
                            }
                            )}
                            </select>
 :
                ""}
            </div>
        </Form>
    );

}