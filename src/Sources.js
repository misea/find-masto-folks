// © 2023 Mark Igra <markigra@sciences.social>
import dataSources from './search_data/data_sources.json';
import { splitHandle } from './Mastodon'

function urlFromHandle(handle) {
  const { userName, instance } = splitHandle(handle);
  return `https://${instance}/@${userName}`;
}

export default function Sources() {
  return <div>
    <h2>Data Sources</h2>

    <div className="source-list">
      {
        dataSources.map(source => <Source source={source} key={source.title} />)
      }
    </div>
  </div>
}

export function SourceDescription({ source }) {
  return <div className={`app-text`} >
    <p>
    The accounts shown here are a view of the <a href={source.source} target="_blank" rel="noreferrer">{source.title}</a> list managed 
    by {
        source.owners.map((owner, index, owners) =>
          <span key={owner.handle || owner.email}>
            {index > 0 ? (index === owners.length - 1 ? " and " : ", ") : ""}
            <Owner owner={owner} />
          </span>
        )
      }.
      </p>
      <p>
      To add remove yourself from the list or to modify your information, see the <a href={source.source} target="_blank" rel="noreferrer">list page</a>.
      </p>   
  </div>
}

function Source({ source }) {
  return <div className="source" >
    <a href={source.source} target="_blank" rel="noreferrer">{source.title}</a>
    <div className="owners">
      {source.owners.length === 1 ? "Owner: " : "Owners: "}
      {
        source.owners.map((owner, index, owners) =>
          <span key={owner.handle || owner.email}>
            {index > 0 ? (index === owners.length - 1 ? " and " : ", ") : ""}
            <Owner owner={owner} />
          </span>
        )
      }
    </div>
  </div>
}

function Owner({ owner }) {
  let ownerName = owner.name;
  if (owner.url) {
    ownerName = <a href={owner.url} target="_blank" rel="noreferrer">{owner.name}</a>
  }

  return <span className="owner">
    {ownerName}
    {owner.handle && owner.name ? " (" : ""}
    {owner.handle ?
      <span><a href={urlFromHandle(owner.handle)} target="_blank" rel="noreferrer">{owner.handle}</a></span> : ""}
    {owner.handle && owner.name ? ")" : ""}
  </span>
}