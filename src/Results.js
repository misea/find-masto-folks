import Person from "./Person";
import { isLoggedIn, getUserHandle } from "./Mastodon";

export default function Results ({accounts, userFollows, showField, makeAccountLink}) { 
    //Need to ensure no dup keys - data seems to be shaky
    const seen = new Set();
    const userHandle = isLoggedIn() && getUserHandle();
    return (<div className="scrollable scrollable--flex">
        {accounts.map((p)=>{
            if (seen.has(p.account + p.field)) {
                return "";
            } else {
                seen.add(p.account + p.field);
                return <Person key={p.account + p.field} showField={showField} info={p} 
                userHandle={userHandle} 
                accountUrl={makeAccountLink(p.account)}
                userFollows={userFollows}/>}
            }
        )}
    </div>);
}