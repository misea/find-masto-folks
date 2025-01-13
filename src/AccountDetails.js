// © 2023 Mark Igra <markigra@sciences.social>
import {Suspense, useEffect, useState} from "react";
import { defer, useLoaderData, Await, useAsyncValue, Link } from "react-router-dom";
import { getPosts, isLoggedIn, getUserFollowsImmediate } from "./Mastodon";
import {getAccount} from "./db"
import Post from "./Post";
import AccountHeader, {AccountHeaderPlaceholder} from "./AccountHeader"
import LoginForm from "./LoginForm";
import {Helmet} from "react-helmet-async";

export async function loader({request, params}) {
    try {
        //Returns a promise. Going to defer/Await this
        const url = new URL(request.url);
        const field = url.searchParams.get("field")
    
        const account = getAccount(params.accountHandle, field === "all" ? null : field);
        return defer({account, handle:params.accountHandle});
    } catch (e) {
        console.error(e);
        return {account:{handle:params.accountHandle}, error:e}
    }
}

export default function AccountDetails() {
    const {account, handle } = useLoaderData();

    //TODO: Move these out into parent.
    const accountUrl = `/search/accounts/${handle}${window.location.search}`
    const showResultsLink = `/search${window.location.search}`
    const loginUrl = `/login?returnTo=${encodeURIComponent(accountUrl)}`;
    //TODO: Move these to defer as well? But can only Await one promise so have to do some kind of "all"
    
    const errorElement = 
        isLoggedIn() ? <div className="error">Couldn't load data for {handle}</div> :
             <>
                <div className="app-text">
                    <p>It looks like you cannot access information about this user without logging in.</p>
                </div>
                <LoginForm returnTo={accountUrl} />
            </>
    
    return (
        <div className={`column details`}>
        {<Link className="phone-nav" to={showResultsLink}>&lt; Results</Link>}
<div className={`scrollable`}>
        <Helmet><title>{handle}</title></Helmet>
        <div className={`item-list`}>
        <Suspense
        fallback={ <AccountHeaderPlaceholder handle={handle} />}
      >
        <Await
          resolve={account}
          errorElement={
            errorElement
          }
        >
          <AccountDetailsDeferred loginUrl={loginUrl} curUrl={accountUrl} handle={handle} />
        </Await>
      </Suspense>
     </div>
     
    </div>
    </div>
);
}

function AccountDetailsDeferred({loginUrl, curUrl, handle}) {
    const account = useAsyncValue();
    const [posts, setPosts] = useState(null);
    useEffect(()=>{
      if (account) {
        getPosts(account).then(posts=>setPosts(posts));
      }
    });

    if (!account) {
        return <AccountHeaderPlaceholder handle={handle} message="Account not found." />
    }

    return (
        <>
        <AccountHeader userFollows={getUserFollowsImmediate() || new Set()} info={account} loggedIn={isLoggedIn()} loginUrl={loginUrl} /> 
        {posts ?  posts.map((post)=><Post key={post.id} post={post} userAccount={account} curUrl={curUrl}/>) : ""}
        </>
    )
}
