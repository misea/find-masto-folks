// © 2023 Mark Igra <markigra@sciences.social>
import {useLoaderData} from "react-router-dom";
import SearchForm from "./SearchForm.js";
import * as db from "./db.js";
import Fields from "./Fields.js";
import LoginButton from "./LoginButton";
import About from "./About";
import Sources from "./Sources";
 
export async function loader() {
    const fields = await db.getFields();
    return {fields};
}

export default function Root() {
    const {fields} = useLoaderData();
    return (
        <>
            <div id="header">
                <div></div>
                <LoginButton/>
            </div>
                <div>
                    <h1 className="heading">Find Academics on Mastodon</h1>
                    <SearchForm action="search"/>
                </div>
                <div>
                    <h2>Or browse</h2>
                    <nav>
                        <ul>
                            <Fields fields={fields}/>
                        </ul>
                    </nav>
                </div>
                <About />
                <Sources />
        </>
    )
}