// © 2023 Mark Igra <markigra@sciences.social>
import { useFetcher, Link } from "react-router-dom";

//TODO: Merge these buttons
const buttonStyle = {fontSize: "18px", width:"23.1429px", height: "23.1429px", lineHeight: "18px"}
export default function FollowButton({handle, userFollows}) {
  const fetcher = useFetcher();

  let btnParams = {
    value:handle,
    style:buttonStyle
  }
  //Optimistic - switch button before api returns.
  let follows = userFollows.has(handle);
  if (fetcher.formData) {
    follows = fetcher.formData.get("follow") === handle;
  }
  if (follows) {
    Object.assign(btnParams, {name:"unfollow", label:"Unfollow", btnClass:"active", iClass:"fa-user-times"})
  } else {
    Object.assign(btnParams, {name:"follow", label:"Follow", btnClass:"", iClass:"fa-user-plus"})
  }
  return (<fetcher.Form method="post" action="/follow">
        <div className="account__relationship">
            <button type="submit" name={btnParams.name} value={btnParams.value} aria-label={btnParams.label} title={btnParams.label} className={`icon-button ${btnParams.btnClass}`} tabIndex="0" style={btnParams.style}>
                <i className={`fa ${btnParams.iClass} fa-fw`} aria-hidden="true"></i>
            </button> 
        </div>
  </fetcher.Form>);

}

export function PlainFollowButton({handle, userFollows}) {
  const fetcher = useFetcher();

  const btnParams = {value:handle};
  let follows = userFollows.has(handle);
  //This is for optimistic updating. 
  if (fetcher.formData) {
    follows = fetcher.formData.get("follow") === handle;
  }
  if (follows) {
    Object.assign(btnParams, {name:"unfollow", label:"Unfollow", btnClass:"button--destructive"})
  } else {
    Object.assign(btnParams, {name:"follow", label:"Follow", btnClass:""})
  }
  return (<fetcher.Form method="post" action="/follow">
            <button type="submit" name={btnParams.name} value={btnParams.value} aria-label={btnParams.label} title={btnParams.label} className={`button logo-button ${btnParams.btnClass}`} tabIndex="0">
              {btnParams.label}
            </button> 
  </fetcher.Form>);
}

export function LoginFollowButton({loginUrl, buttonStyle}) {
  if (buttonStyle === "button") {
    return <Link to={loginUrl} className="button logo-button" tabIndex="0" >
    Follow
  </Link>
  } else {
    return  (
      <div className="account__relationship">
        <Link to={loginUrl} className="icon-button" tabIndex="0" style={buttonStyle}>
          <i className={`fa fa-user-plus fa-fw`} aria-hidden="true"></i>
        </Link>
      </div>
  )}
}