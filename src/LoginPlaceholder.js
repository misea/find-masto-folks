// © 2023 Mark Igra <markigra@sciences.social>
import {getUserInfo, isLoggedIn, getCurrentInstance} from "./Mastodon";
import LoginForm from "./LoginForm";
import { useLocation } from "react-router-dom";
import { getDataSourceInfo } from "./db";
import { Source } from "./Sources";

export default function LoginPlaceholder() {
    const location = useLocation();
    const fieldId = new URLSearchParams(location.search).get("field")
    if (isLoggedIn()) {
        const userInfo = getUserInfo();
        return <div className={`column app-text placeholder`}>
            <SourceSummary fieldId={fieldId} />
            <p>You are logged in as <a href={userInfo.url} rel="noreferrer" target="_blank">@{userInfo.acct}@{getCurrentInstance()}</a>.</p>
            <div className="app-text" style={{color:"black"}}>
                Click on the names on the list to see profiles and posts.
            </div>
                <p>This app does not retain information about your usage or follows.</p>
            </div>;
    } else {
        return <div className="column placeholder">
            <SourceSummary fieldId={fieldId} />

            <div className="app-text"  style={{color:"black"}}>
                Click on the names on the list to see profiles and posts.
            </div>
            <LoginForm returnTo={location.pathname + location.search}/>
            <div className="app-text">This web application will ask for permission to read information using your account and to update your "following" list.
            </div>
        </div>
    }
}

function SourceSummary({fieldId}) {
  if (!fieldId) {
    return "";
  }
  const sourceInfo = getDataSourceInfo(fieldId);
  if (!sourceInfo) {
    return "";
  }
  return <Source source={sourceInfo} prose={true} />
}