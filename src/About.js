// © 2023 Mark Igra <markigra@sciences.social>
import { isLoggedIn } from "./Mastodon";
import LoginForm from "./LoginForm";

export default function About() {
 return <div>
      <div className="app-text">
      {isLoggedIn() ? "" : <LoginForm/>}
      <h2>What is this page?</h2>
      <p>This is a <span style={{fontStyle:"italic" }}>prototype</span> web application that allows folks to browse some of the 
        lists of <a href="https://nathanlesage.github.io/academics-on-mastodon/" target="_blank" rel="noreferrer">Academics of Mastodon</a>, 
        view public profiles and posts,
        and easily follow people on the list by logging in.</p>      

  <h2>Where does the data come from?</h2>
      <p>The wonderful <a href="https://nathanlesage.github.io/academics-on-mastodon/" target="_blank" rel="noreferrer">Academics of Mastodon</a> site contains 
links to a variety of lists of academics in different disciplines. Because many of the lists are based on
      the <a href="https://trutzig89182.github.io/Mastodon-Sociologists/" target="_blank" rel="noreferrer">List of Sociologists</a> maintained by  <a href="https://social.tchncs.de/@perspektivbrocken" target="_blank" rel="noreferrer">David Adler</a> et al. it was possible 
      to create an app to view those lists in one place.
      This app does not maintain a copy of the data and does not &#8220;crawl&#8221; or &#8220;scrape&#8221; Mastodon, it just 
      loads the lists into your browser and requests information from Mastodon instances as you browse. 
      </p>
  <h2>How do I add myself, or update my info?</h2>
<p>    I'm hoping to add that soon. For now, if you want to be on these lists, use the list of data sources below or head on over 
  to  <a href="https://nathanlesage.github.io/academics-on-mastodon/" target="_blank" rel="noreferrer">
      Academics of Mastodon</a> for the full list of disciplines. I'm reaching out to the folks who own those lists to see if we can add a way to ease signups. 
      In addition to supporting current sign-up mechanisms we might
      </p>
      <ol className="numbered">
        <li>Provide a custom form that verifies your account, collects information and sends it to the list owner.</li>
        <li>Create an option for owners to store lists in Mastodon or as part of this app.</li>
      </ol>
  <h2>Do I have to login?</h2>
  <p>You can browse public information without logging in. In order to follow and see any non-public profiles you have permissions to see, you need to log into your Mastodon instance. 
    I would like to add an "Export to CSV" option so that
    people can still make use of the data without logging in.
  </p>
  <h2>Are you planning to add more academic disciplines?</h2>
  <p>
    Yes, assuming it's not too difficult to get the data. <a href="https://sciences.social/@markigra" target="_blank" rel="noreferrer">DM me</a> if you manage a list, or would like to start one.
  </p>
  <h2>Who built this?</h2>
  <p>
    <a href="https://sciences.social/@markigra" target="_blank" rel="noreferrer">Mark Igra</a>, the founder 
    of <a href="https://sciences.social/about" target="_blank" rel="noreferrer">sciences.social</a> built this over winter break 2022. I welcome
    comments and suggestions. The code is on <a href="https://github.com/misea/find-masto-folks">github.</a>
    </p>
  <h2>Shouldn't he have been working on his PhD instead? </h2>
  <p>That is a frequently asked question.</p>
  </div>
  </div>
}