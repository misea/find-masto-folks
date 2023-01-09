  
// © 2023 Mark Igra <markigra@sciences.social>
import escapeRegExp from "lodash.escaperegexp"
import Papa from "papaparse"
import { canonicalHandle } from "./Mastodon"
import dataSources from "./search_data/data_sources.json"

let combinedData = null;
const byField = new Map();

async function loadData(listInfo) {
  let downloadUrl = listInfo?.dataSource?.url;
  if (!downloadUrl) {
    const {host, pathname} = new URL(listInfo.source);
    const repo = host.split(".")[0]
    const sourceFileName = listInfo?.dataSource?.file || "users.csv";
    downloadUrl = `https://raw.githubusercontent.com/${repo}${pathname}/main/resources/${sourceFileName}`  
  }

  function joinClean(...args) {return args.filter(arg=>arg!== undefined && arg !== null).join(" ")}
  return loadCSV(downloadUrl).then((loaded)=>{
    let records = loaded.data
    .filter(record=>record.account && record.account.indexOf("@") !== -1)
    .map(record=>{
      record.account = canonicalHandle(record.account);
      record.name = record.name && record.name !== "–" ? record.name.trim() : record.account.split("@")[1];
      record.field = listInfo.title;
      record.searchText = joinClean(record.account, record.name, record.field, record.keywords, record.intro);
      return record;
    });
    
    records.sort((a, b)=>{
      return a.name.localeCompare(b.name);
    });
    return records;

  });
}

async function loadCSV(url) {
  return new Promise((resolve, reject)=>{
    Papa.parse(url, {download:true, header:true, complete:resolve, error:reject})
  });
}


function cleanKey(text) {return text.replaceAll(/[ &+()]/g, "-").replaceAll(/-+/g, "-").toLowerCase()}


const departments = dataSources.map((dataSource)=>{
  return {
    id:cleanKey(dataSource.title), 
    title:dataSource.title
  }
});

export function getFields() {
    return departments;
}

export async function ensureFieldData(fieldKey) {
  let fieldData = byField.get(fieldKey);
  if (fieldData) {
    return fieldData;
  } else {
    const dataSource = dataSources.find((ds)=>cleanKey(ds.title) === fieldKey);
    if (!dataSource) {
      throw new Error("Could not find data source for " + fieldKey);
    }
    fieldData = await loadData(dataSource);
    byField.set(fieldKey, {id:fieldKey, title:dataSource.title, accounts:fieldData});
    return fieldData
  }
}

export async function ensureAllFieldData() {
  if (combinedData) {
    return combinedData;
  }
  const promises = [];
  dataSources.forEach(dataSource=>{
    const fieldId = cleanKey(dataSource.title);
    if (!byField.has(fieldId)) {
      promises.push(ensureFieldData(fieldId));
    }
  })
  await Promise.all(promises);

  combinedData = [].concat(...Array.from(byField.values()).map(f=>f.accounts));


  
}


export async function getPeople(fieldId, queryString) {
    if (queryString) {
      queryString = queryString.trim();
      if (queryString === "") {
        queryString = null;
      }
    }

    if (!fieldId && !queryString)
      return [];

    if (fieldId) {
      await ensureFieldData(fieldId);
      return filterByQueryString(byField.get(fieldId).accounts, queryString);
    } else {
      await ensureAllFieldData();
      return filterByQueryString(combinedData, queryString)
    }
}

function reFromQueryString(queryString) {
  const terms = queryString.split(/ +/g)
  const reStr = "\\b" + terms.map(escapeRegExp).join("|\\b");
  return new RegExp(reStr, 'gi')
}

function filterByQueryString(accounts, queryString) {
  if (!queryString) {
    return accounts;
  }

  const matchCounts = accounts.map(account=>{
    const re = reFromQueryString(queryString);
    return {n:Array.from(account.searchText.matchAll(re)).length, account:account};
  });
  return matchCounts.filter(x=>x.n > 0).sort((a,b)=>b.n-a.n).map(x=>x.account)
}

export function getDataSourceInfo(sourceId) {
  const dataSource = dataSources.find((source)=>cleanKey(source.title) === sourceId)
  return dataSource || dataSources.find(source=>source.title === sourceId)
}