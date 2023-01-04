// © 2023 Mark Igra <markigra@sciences.social>
import { Link } from "react-router-dom";
import FollowButton, {LoginFollowButton} from "./FollowButton";

export default function Person({info, showField, userFollows, accountUrl, userHandle}) {
    const loginUrl = `/login?returnTo=${encodeURIComponent(accountUrl)}`;
    return (
        <article aria-posinset="2" aria-setsize="14">
            <div className="account">
                <div className="account__wrapper">
                    <Link className="account__display-name" title={info.name} to={accountUrl}>
                        <span className="display-name">
                            <bdi>
                                <strong className="display-name__html">{info.name} {showField ? `(${info.field})` : null}</strong>
                            </bdi>
                            <span className="display-name__account">{info.account}</span>
                            {info.keywords && <div className="keywords">{info.keywords}</div>}
                        {info.intro && <div>{info.intro}</div>}
                        </span>
                    </Link>
                    {userHandle ?
                        (userHandle !== info.account ? <FollowButton userFollows={userFollows} handle={info.account} /> : "") :
                        <LoginFollowButton loginUrl={loginUrl} />
                    }
                    {/* <div className="account__relationship">
                    {userFollows(info.account) ?
                        <button type="button" aria-label="Unfollow" title="Unfollow" class="icon-button active" tabindex="0" style={{fontSize: "18px", width:"23.1429px", height: "23.1429px", lineHeight: "18px"}}>
                            <i className="fa fa-user-times fa-fw" aria-hidden="true"></i>
                        </button> :
                        <button type="button" aria-label="Follow" title="Follow" className="icon-button" tabIndex="0" style={{fontSize: "18px", width:"23.1429px", height: "23.1429px", lineHeight: "18px"}}>
                            <i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> 
                        </button>
                    }
                    </div> */}
                </div>
            </div>
        </article>);
    // return (<div className="person" onClick={()=>navigate(`/search/accounts/${info.account}${location.search}`)}>
    //     <div className="name">{info.name} {showField ? `(${info.field})` : null}</div>
    //     <div>{info.account}</div>
    //     {info.keywords? <div>{info.keywords}</div> : null}
    //     {info.intro ? <div>{info.intro}</div> : null}
    // </div>);
}