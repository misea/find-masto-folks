import { PlainFollowButton, LoginFollowButton } from "./FollowButton";
import { getUserInfo } from "./Mastodon";
export default function AccountHeader({info, loggedIn, loginUrl, userFollows}) {
  return (<div className="account__header">
    <div className="account__header__image">
      <div className="account__header__info">
      </div>
      <img src={info.header_static} alt="" className="parallax" />
    </div>
    <div className="account__header__bar"><div className="account__header__tabs">
      <a className="avatar" href={info.avatar_static} rel="noopener noreferrer" target="_blank">
  <div className="account__avatar" style={{width: "90px", height: "90px"}}>
        <img src={info.avatar_static} alt={info.handle} />
      </div>
    </a>
      <div className="account__header__tabs__buttons">
        {info.handle !== getUserInfo()?.handle ?
          (loggedIn ? 
              <PlainFollowButton userFollows={userFollows} handle={info.handle}/> 
            : <LoginFollowButton buttonStyle={"button"} loginUrl={loginUrl}  />) 
          : ""
        }
        </div></div><div className="account__header__tabs__name">
          <h1><span>{info.display_name}</span> <small>{info.handle} </small></h1>
      </div>
      <div className="account__header__extra">
        <div className="account__header__bio">
            <div className="account__header__content translate" dangerouslySetInnerHTML={{__html:info.note}}>
            </div>
            <div className="account__header__fields">
                <dl>
                  <dt><span>Joined</span></dt><dd>{new Date(info.created_at).toLocaleDateString()}</dd>
                </dl>
                {info.fields.map((pair, i) => (
                    <dl key={i} className={pair.verified_at ? "verified" : ""}>
                      <dt title={pair.name} className='translate' >{pair.name}</dt>

                      <dd className='translate'>
                        {pair.verified_at && 
                        <span title={`Ownership of this link was checked on ${new Date(pair.verified_at).toLocaleString()}`}>
                            <i className="fa fa-check verified__mark"></i>
                        </span>
                        } 
                        <span dangerouslySetInnerHTML={{ __html: pair.value }} />
                      </dd>
                    </dl>
                  ))}

              </div>
            </div>
            <div className="account__header__extra__links">
              <a className="active" aria-current="page" title={info.statuses_count} href={info.url}>
                <span>
                  <strong>
                    <span>{info.statuses_count}</span>
                  </strong> Posts</span>
                </a>
                <a title={info.following_count} href={`${info.url}/following`} target="_blank" rel="noreferrer" >
                  <span><strong><span>{info.following_count}</span></strong> Following</span>
                </a>
                <a title={info.followers_count} href={`${info.url}/followers`} target="_blank" rel="noreferrer">
                  <span><strong><span>{info.followers_count}</span></strong> Followers</span>
                </a>
              </div>
            </div>
          </div>
        </div >
        )
}

export function AccountHeaderPlaceholder({handle}) {
    return (<div className="account__header">
      <div className="account__header__image">
        <div className="account__header__info">
        </div>
        <img src="https://sciences.social/headers/original/missing.png" alt="" className="parallax" />
      </div>
      <div className="account__header__bar">
        <div className="account__header__tabs">
        <a className="avatar" href="." rel="noopener noreferrer" target="_blank">
          <div className="account__avatar" style={{width: "90px", height: "90px"}}>
          <img src="https://sciences.social/avatars/original/missing.png" alt={handle} />
          </div>
      </a>
          <div className="account__header__tabs__buttons">
          </div>
        </div>
        <div className="account__header__tabs__name">
          <h1><span>&nbsp;</span> <small>{handle} </small></h1>
        </div>
      </div>
    </div>)
      
}