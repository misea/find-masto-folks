// © 2023 Mark Igra <markigra@sciences.social>
import {Form, useActionData, useSearchParams, redirect } from "react-router-dom"
import isValidDomain from "is-valid-domain";
import * as Mastodon from "./Mastodon"

export async function action({request}) {
    const formData = await request.formData();
    const redirectUrl = new URL(request.url);
    redirectUrl.search = "";
    redirectUrl.pathname = "token";
    console.log("redirect url: ", redirectUrl);
    const serverParam = formData.get("server");
    const instance = Mastodon.cleanServerName(serverParam);
    if (!isValidDomain(instance)) {
        if (instance !== serverParam) {
            return {server:serverParam, error:`"${serverParam}" (${instance}) is not a valid name for an instance.`}
        }
        return {server:serverParam, error:`"${serverParam}" is not a valid name for an instance.`}
    }
    const app = await Mastodon.ensureApp(instance, redirectUrl);
    console.log(app);
    if (app.error) {
        console.error(app.error, "connecting to", instance);
        return {server:serverParam, error:`Error ${app.error} connecting to ${instance}`}
    }
    localStorage.setItem("login_instance", instance);
    throw redirect(Mastodon.getLoginUrl(instance));
}

export function getPostLoginRedirect() {
    return localStorage.getItem("returnTo");
}

export function clearPostLoginRedirect() {
    localStorage.removeItem("returnTo")
}

export default function LoginForm({returnTo}) {
    const actionData = useActionData();
    const [searchParams] = useSearchParams();
    if (!returnTo) {
        returnTo = searchParams.get("returnTo");
    }
    if (returnTo) {
        localStorage.setItem("returnTo", returnTo);
    }
    let server = localStorage.getItem("login_instance"), error = null;
    if (actionData) {
        ({server, error} = actionData);
    } 

    return (
        <div style={{paddingTop:"6px"}}>
            <div className="app-text">
            After you log in you can easily follow anyone you find, even if they are on a different server. 
            </div>
            {error ? <div className="error">{error}</div> : ""}
            <Form className="simple_form" acceptCharset="UTF-8" method="post" action="/login">
                <div className="fiselds-group">
                    <div className="input with_label">
                        <div className="label_input">
                            <label className="email" htmlFor="server">Your Mastodon Instance Name</label>
                            <input type="text" name="server" defaultValue={server} />
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <button name="button" type="submit" className="btn">Go to Login</button>
                </div>
            </Form>    
        </div>
    )

}