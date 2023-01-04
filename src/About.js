import { isLoggedIn } from "./Mastodon";
import LoginForm from "./LoginForm";

export default function About() {
 return <div>
      <div className="app-text">
      {isLoggedIn() ? "" : <LoginForm/>}
  <h2>Where does the data come from?</h2>
      <p>The wonderful <a href="https://nathanlesage.github.io/academics-on-mastodon/" target="_blank" rel="noreferrer">Academics of Mastodon</a> site contains 
links to a variety of lists of academics in different disciplines. Because many of the lists are based on
      the <a href="https://trutzig89182.github.io/Mastodon-Sociologists/" target="_blank" rel="noreferrer">List of Sociologists</a> maintained by  <a href="https://social.tchncs.de/@perspektivbrocken" target="_blank" rel="noreferrer">David Adler</a> et al. it was possible to combine them.
      For this prototype, the data is just loaded into your web browser. A later version will store it in an online database.
      </p>
  <h2>How do I add myself, or update my info?</h2>
<p>    I'm hoping to add that soon. For now, if you want to be on these lists, use the list of data sources below or head on over 
  to  <a href="https://nathanlesage.github.io/academics-on-mastodon/" target="_blank" rel="noreferrer">
      Academics of Mastodon</a> for the full list of disciplines. I'm reaching out to the folks who own those lists to see if we can work out a way to manage them cooperatively.
      </p>
  <h2>Do I have to login?</h2>
  <p>You can browse public information without logging in. In order to follow and see non-public profiles you can access, you need to log into your mastodon instance. I would like to add an "Export to CSV" option so that
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