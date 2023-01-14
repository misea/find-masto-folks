// © 2023 Mark Igra <markigra@sciences.social>
import { useState } from "react";
import { Form, useSubmit } from "react-router-dom"
import { SourceDescription } from "./Sources";
import { getDataSourceInfo } from "./db";


export default function SearchForm({ q, action, fieldId, fields }) {
  const submit = useSubmit();
  const [showInfo, setShowInfo] = useState(false);
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
        {fieldId ? <div style={{ display: "flex", alignItems: "center" }}>
          <select name="field" id="field" defaultValue={fieldId} onChange={(e) => submit(e.currentTarget.form)}>
            {fields.map((field) => {
              return <option key={field.id} value={field.id}>{field.title}</option>
            }
            )}
          </select>
          {fieldId === "all" ? "" : 
          <div role="button" className="info-button hide-wide" onClick={()=>setShowInfo(!showInfo)} >
            &#9432;
          </div>
          }
        </div> : ""}
        {showInfo ? <div className="hide-wide"><SourceDescription source={getDataSourceInfo(fieldId)} /></div> : ""}
        </div>
    </Form>
  );

}