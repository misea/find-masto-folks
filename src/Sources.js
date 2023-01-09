// © 2023 Mark Igra <markigra@sciences.social>
import dataSources from './search_data/data_sources.json';

function urlFromHandle(handle) {
  const parts = handle.split("@");
  return `https://${parts[2]}/@${parts[1]}`;
}

export default function Sources() {
  return <div>
    <h2>Data Sources</h2>
    
    <div className="source-list">
      {
      dataSources.map(source=><Source source={source} key={source.title} />)
    }
    </div>
  </div>
}

export function Source({source, prose}) {
  return <div className={`source ${prose ? "prose" : ""}`} >
    {prose ? "The " : ""}
  <a href={source.source} target="_blank" rel="noreferrer">{source.title}</a>
  <div className="owners">
  {prose ? " list is managed by " : (source.owners.length === 1 ? "Owner: " : "Owners: ")}
  {
    source.owners.map((owner, index, owners)=>
      <span key={owner.handle || owner.email}>
      {index > 0 ? (index === owners.length - 1 ? " and " : ", ") : ""}
      <Owner  owner={owner}/>
      </span>
    )
  }
  </div>
</div>
}

function Owner({owner}) {
  let ownerName = owner.name;
  if (owner.url) {
    ownerName = <a href={owner.url} target="_blank" rel="noreferrer">{owner.name}</a>
  }

  return <span  className="owner">
    {ownerName}
    {owner.handle && owner.name ? " (" : ""}
      {owner.handle ? 
        <span><a href={urlFromHandle(owner.handle)} target="_blank" rel="noreferrer">{owner.handle}</a></span> : ""}
    {owner.handle && owner.name ? ")" : ""}
  </span>
}