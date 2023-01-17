// © 2023 Mark Igra <markigra@sciences.social>
import { Link } from "react-router-dom";
import { canonicalHandle } from "./Mastodon";


export default function Post({ post, userAccount, curUrl }) {
  const { account, sensitive, spoiler_text, content, media_attachments } = post.reblog || post;
  const linkForMore = spoiler_text | sensitive | media_attachments.length > 1 | (media_attachments.length === 1 && media_attachments[0].type !== "image");
  const image = media_attachments.length === 1 && media_attachments[0].type === "image" ? media_attachments[0] : null;

  function personLink(handle, instance) {
    handle = canonicalHandle(handle, instance);
    let search = curUrl.match(/\?.*$/) || "";
    return `/search/accounts/${handle}${search}`
  }
  
  return (
    <article aria-posinset="1" aria-setsize="2" tabIndex="0">
      <div tabIndex="-1">
        <div className="status__wrapper status__wrapper-public focusable" tabIndex="0" aria-label="">
        {post.pinned ? 
          <div className="status__prepend">
            <div className="status__prepend-icon-wrapper">
              <i className="fa fa-thumb-tack status__prepend-icon fa-fw"></i>
            </div>
            <span>Pinned post</span>
          </div> : ""}
        {post.reblog ?
          <div className="status__prepend">
            <div className="status__prepend-icon-wrapper">
              <i className="fa fa-retweet status__prepend-icon fa-fw"></i>
            </div>
            <span>
              <Link to={personLink(post.account.acct, userAccount.instance)} className="status__display-name muted">
                <bdi><strong>{post.account.display_name || post.account.username}</strong></bdi>
              </Link> boosted
            </span>
          </div>
          : ""
         }
          <div className="status status-public" >
            <div className="status__info">
              <a href={post.url} className="status__relative-time" target="_blank" rel="noopener noreferrer">
                <span className="status__visibility-icon">
                  <i className="fa fa-globe" title="Public"></i>
                </span><time dateTime={post.created_at} title={new Date(post.created_at).toLocaleTimeString()}>{new Date(post.created_at).toLocaleDateString()}</time>
              </a>
              <Link to={personLink(account.acct, userAccount.instance)} title={account.acct} className="status__display-name" >
                <div className="status__avatar">
                  <div className="account__avatar" style={{width: "46px", height: "46px"}}>
                    <img src={account.avatar_static} alt={account.acct} />
                  </div>
                </div>
                <span className="display-name">
                  <bdi>
                    <strong className="display-name__html">{account.display_name}</strong>
                  </bdi>
                  <span className="display-name__account">{account.acct}</span>
                </span>
              </Link>
            </div>
            {spoiler_text && spoiler_text !== '' ?
            <p style={{marginBottom: "0px"}}>
              <span className="translate" lang={post.language}>{spoiler_text}</span>
            </p>   
            :
            <div className="status__content status__content--with-action" tabIndex="0">
              <div className="status__content__text status__content__text--visible translate" dangerouslySetInnerHTML={{__html:content}} lang={post.language}>
              </div>
            </div>
          }
          {image ? 
            <div className="media-gallery" style={{height: "165.375px"}}>
              <div className="media-gallery__item" style={{inset: "auto", width: "100%", height: "100%"}}>
                <a className="media-gallery__item-thumbnail" href={image.remote_url} target="_blank" rel="noopener noreferrer">
                  <img src={image.preview_url}
                    alt={image.description}
                    title={image.description}
                    style={{objectPosition: "50% 50%"}} />
                </a>
              </div>
            </div>
            :
            ""
            }
            { linkForMore ?
              <div>
                <a href={post.url} target="_blank" rel="noopener noreferrer">See more.</a>
              </div> 
              :
              ""
            }
          </div>
        </div>
      </div>
    </article>
  )
}