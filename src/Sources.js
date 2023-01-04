import dataSources from './search_data/data_sources.json';

export default function Sources() {
  return <div>
    <h2>Data Sources</h2>
    <p>Below find the links to the github pages that were used to assemble the data you see here.</p>
    <nav>
                        <ul>
    <div className="field-list">
      {
      dataSources.map(source=>
        <li key={source.title}><a href={source.source} target="_blank" rel="noreferrer">{source.title}</a></li>)
      }
    </div>
    </ul>
  </nav>
  </div>
}