// © 2023 Mark Igra <markigra@sciences.social>
import { isLoggedIn } from "./Mastodon";
import LoginForm from "./LoginForm";

export default function About() {
 return <div>
      <div className="app-text">
      {isLoggedIn() ? "" : <LoginForm/>}
      <h2>What is this page?</h2>
      <p>This is a prototype web application that allows folks to browse some of the 
        lists of <a href="https://nathanlesage.github.io/academics-on-mastodon/" target="_blank" rel="noreferrer">Academics of Mastodon</a>, 
        view public profiles and posts,
        and easily follow people on the list by logging in.</p>
        <p> <em style={{color:"black", fontStyle:"italic"}}>If you are seeing this page, it is likely because you manage one of these lists,
           and I want to get feedback from you before releasing anything.</em> Please read through how and let me (Mark Igra) 
           know via <a href="mailto:markigra@sciences.social">email: 
           markigra@sciences.social</a> or  <a href="https://sciences.social/@markigra">DM @markigra@sciences.social</a> what you think. I'm specifically 
           inerested in responses to 
           the questions for you below.</p>

           <ol className="numbered">
          <li>
            Is it OK if your list is included in this application?
          </li>
          <li>
            If #1 is OK, how would you like to handle requests to add to your list? (See below)
          </li>
          <li>
            If #1 is not OK, would individual opt-ins from people on the list be acceptable?
          </li>
        </ol>
      

  <h2>Where does the data come from?</h2>
      <p>The wonderful <a href="https://nathanlesage.github.io/academics-on-mastodon/" target="_blank" rel="noreferrer">Academics of Mastodon</a> site contains 
links to a variety of lists of academics in different disciplines. Because many of the lists are based on
      the <a href="https://trutzig89182.github.io/Mastodon-Sociologists/" target="_blank" rel="noreferrer">List of Sociologists</a> maintained by  <a href="https://social.tchncs.de/@perspektivbrocken" target="_blank" rel="noreferrer">David Adler</a> et al. it was possible to combine them.
      For now, the data is just loaded into your web browser and not stored in a database.
      </p>
  <h2>How do I add myself, or update my info?</h2>
<p>    I'm hoping to add that soon. For now, if you want to be on these lists, use the list of data sources below or head on over 
  to  <a href="https://nathanlesage.github.io/academics-on-mastodon/" target="_blank" rel="noreferrer">
      Academics of Mastodon</a> for the full list of disciplines. I'm reaching out to the folks who own those lists to see if we can work out a way to manage them cooperatively. 
      There are several options. We might
      <ol className="numbered">
        <li>Keep things as they are, and allow you to sign up with the list owner.</li>
        <li>Provide a custom form that verifies your account, collects information and sends it to the list owner.</li>
        <li>Create a centralized list either as follows to an Mastodon account managed by the list owner, 
          or in a database, moderated by list owners.</li>
      </ol>
      </p>
  <h2>Do I have to login?</h2>
  <p>You can browse public information without logging in. In order to follow and see non-public profiles you have permissions to, you need to log into your mastodon instance. I would like to add an "Export to CSV" option so that
    people can still make use of the data without logging in.
  </p>
  <h2>Are you planning to add more academic disciplines?</h2>
  <p>
    Yes, assuming people approve, I'd like to do that right after I allow people to add and update their own information.
  </p>
  <h2>Who built this?</h2>
  <p>
    <a href="https://sciences.social/@markigra" target="_blank" rel="noreferrer">Mark Igra</a>, the founder 
    of <a href="https://sciences.social/about" target="_blank" rel="noreferrer">sciences.social</a> built this over winter break 2022. I welcome
    comments and suggestions. The code (such as it is) is on github.
    </p>
  <h2>Shouldn't he have been working on his PhD instead? </h2>
  <p>That is a frequently asked question.</p>
  </div>
  </div>
}