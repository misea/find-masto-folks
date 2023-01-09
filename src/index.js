// © 2023 Mark Igra <markigra@sciences.social>
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/mastodon-light.scss";
import "font-awesome/css/font-awesome.css";
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import Root, {loader as fieldsLoader} from './Root';
import ErrorPage from './error-page.js'
import AccountDetails, {loader as accountLoader} from './AccountDetails';
import LoginPlaceholder from "./LoginPlaceholder";
import Search, {loader as searchLoader} from "./Search"
import LoginForm, {action as loginAction} from "./LoginForm"
import Token, {tokenLoader} from "./Token";
import * as Mastodon from "./Mastodon";
import {HelmetProvider} from "react-helmet-async";

const router = createBrowserRouter([
  {
  path: "/",
  element: <Root />,
  errorElement: <ErrorPage/>,
  loader: fieldsLoader
  },
  {
    path:"/search",
    errorElement: <ErrorPage/>,
    element: <Search />,
    loader: searchLoader,
    children: [
      {
        index:true,
        path:"",
        element:<LoginPlaceholder/>
      },
      {
        path:"accounts/:accountHandle",
        element: <AccountDetails/>,
        loader: accountLoader,
        errorElement: <ErrorPage/>
      }
    ]
  },
  {
    path:"/login",
    errorElement: <ErrorPage/>,
    element: <LoginForm />,
    action: loginAction
  },
  {
    path:"/token",
    element: <Token/>,
    loader: tokenLoader
  },
  {
    path:"/logout",
    element:<div>Logging out...</div>,
    errorElement:<ErrorPage/>,
    action: async ()=>{
      await Mastodon.logout(); 
      throw redirect("/");
    }
  },
  {
    path:"/follow",
    action: async({request})=>{
      if (!Mastodon.isLoggedIn()) {
        throw redirect(`/login`);
      }
      const fd = await request.formData();
      const follow = fd.get("follow");
      const unfollow = fd.get("unfollow");
      if (follow) {
        try {
          const following = await Mastodon.follow(follow);
          return following;  
        } catch (e) {
          console.error(e);
          return false;
        }
      } else {
        try {
          const following = await Mastodon.unfollow(unfollow);
          return following;  
        } catch (e) {
          console.error(e);
          return true;
        }
      }
    }
  }

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
