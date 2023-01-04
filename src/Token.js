// © 2023 Mark Igra <markigra@sciences.social>
import { redirect } from 'react-router-dom';
import * as Mastodon from "./Mastodon";
import { getPostLoginRedirect, clearPostLoginRedirect } from './LoginForm';

export async function tokenLoader({request}) {
    const url = new URL(request.url);
    const authCode = url.searchParams.get("code");
    if (authCode) {
        await Mastodon.completeLogin(authCode);
        const lastLoginLoc = getPostLoginRedirect() || "/";
        clearPostLoginRedirect();
        throw redirect(lastLoginLoc);
    } else {
        return {error:"Could not get authorization code"}
    }
}

export default function Token() {
    return <div>Completing login...</div>
}