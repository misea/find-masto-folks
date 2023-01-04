import { useState, useEffect } from "react";
import {useLoaderData, Outlet, Link, useLocation } from "react-router-dom";
import SearchForm from "./SearchForm.js";
import Results from "./Results";
import LoginButton from "./LoginButton";
import * as db from "./db.js";
import {isLoggedIn, getUserFollows, getUserFollowsImmediate} from "./Mastodon";
import {Helmet} from "react-helmet-async";

export async function loader({request}) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const field = url.searchParams.get("field")

    //TODO: Should be better about doing rendering while these aren't all back 
    //e.g. using defer
    const accounts = await db.getPeople(field === "all" ? null : field, q);
    const fields = await db.getFields();
    return {accounts, q, field, fields:[{id:"all", title:"All available academic fields"}].concat(fields)};
}

export default function Search() {
    const {accounts, q, field, fields } = useLoaderData();
    const location = useLocation();

    const [userFollows, setUserFollows] = useState(getUserFollowsImmediate());
    useEffect(()=>{
        if (isLoggedIn() && !userFollows) {
            getUserFollows().then((allFollows)=>{
                setUserFollows(allFollows);
            });
        }    
    })
    const isAccountPage = location.pathname.indexOf("account") !== -1;


    const urlParams = {};
    if (q) {
        urlParams.q = q;
    }
    if (field) {
        urlParams.field = field;
    }
    //Make sure that params are preserved in all links
    const urlSearchString = "?" + new URLSearchParams(urlParams).toString();
    const makeAccountLink = (handle) => `/search/accounts/${handle}${urlSearchString}`;

    let searchTitle = "Find Academics";
    if (field) {
        searchTitle = field + (q ? ": " + q : "");
    } else if (q) {
        searchTitle = "Find " + q;
    }

    let noAccountsMessage = accounts && accounts.length ? null : "No data to display.";
    if (noAccountsMessage) {
        if (q && q !== "") {
            noAccountsMessage = noAccountsMessage + " Try changing your search."
        } else if (field && field !== "all") {
            noAccountsMessage = noAccountsMessage + " Choose a field or search for text."
        }    
    }

    return (
        <>
        <Helmet><title>{searchTitle}</title></Helmet>

        <div id="header">
            <div><Link to="/"><h1>Find Academics</h1></Link></div>           <LoginButton/>
        </div>
        <div>
            <SearchForm q={q} fieldId={field || "all"} fields={fields}/>
        </div>
            <div className="columns-area__panels">
                <div className={`column results ${isAccountPage ? "placeholder" : ""}`}>
                    {noAccountsMessage || 
                    <Results accounts={accounts} userFollows={userFollows || new Set()} makeAccountLink={makeAccountLink} showField={field !== "all"}/>}
                </div>
                <Outlet  />
            </div>

        </>
    )
}