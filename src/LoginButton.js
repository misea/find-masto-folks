// © 2023 Mark Igra <markigra@sciences.social>
import {Form} from "react-router-dom"
import {isLoggedIn} from "./Mastodon"

export default function LoginButton () {
    const loggedIn = isLoggedIn();
    return (
        <div className="login">
            <Form action={loggedIn ? "/logout" : "/login"} 
            method={loggedIn ? "post" : "get"}
            ><button className="button" type="submit">{loggedIn ? "Logout" : "Login"}</button></Form>
        </div>
    )
}