  
// © 2023 Mark Igra <markigra@sciences.social>
import escapeRegExp from "lodash.escaperegexp"
import Papa from "papaparse"
import { canonicalHandle, splitHandle, getAccount as getMastodonAccount } from "./Mastodon"
import dataSources from "./search_data/data_sources.json"

let combinedData = null;
const byField = new Map();

async function loadData(listInfo) {
  function joinClean(...args) {return args.filter(arg=>arg!== undefined && arg !== null).join(" ")}
  return loadCSV(listInfo).then((loaded)=>{
    let records = loaded.data
    .map(record=>{
      if(record["Account address"]) {
        record.account = record["Account address"];
        delete record["Account address"];
      }
      return record;
    })
    .filter(record=>record.account && record.account.indexOf("@") !== -1)
    .map(record=>{
      record.account = canonicalHandle(record.account);
      //Some keywords comma separated list without spaces
      if (record.keywords && record.keywords.indexOf(",") !== -1) {
        record.keywords = record.keywords.split(/, */).join(", "); 
      }
      //Need to account for all the different versions of dash that show up as missing
      record.name = record.name && record.name.match(/^[ \u002D\u2012\u2013\u2014]*$/u) === null ? record.name.trim() : splitHandle(record.account).userName;
      record.field = listInfo.title;
      record.searchText = joinClean(record.account, record.name, record.field, record.keywords, record.intro);
      return record;
    });
    
    records.sort((a, b)=>{
      return a.name.localeCompare(b.name);
    });
    return records;

  }).catch((e)=>{
    console.error(`Error retrieving data from ${listInfo?.source}: ${e.message}`);
    return [];
  });
}

async function loadCSV(listInfo) {
  const localName = listInfo?.build?.localName;
  let downloadUrl = localName ? `/data/${localName}` : listInfo?.dataSource?.url;
  if (!downloadUrl) {
    const {host, pathname} = new URL(listInfo.source);
    const repo = host.split(".")[0]
    const sourceFileName = listInfo?.dataSource?.file || "users.csv";
    downloadUrl = `https://raw.githubusercontent.com/${repo}${pathname}main/resources/${sourceFileName}`  
  }
  const renameColumns = listInfo?.dataSource?.columns !== undefined;

  return new Promise((resolve, reject)=>{
    Papa.parse(downloadUrl, {download:true, header:!renameColumns, complete:resolve, error:reject})
  }).then(res=>{
    if (listInfo?.dataSource?.skipRows) {
      res.data = res.data.slice(listInfo.dataSource.skipRows)
    }
    if (renameColumns && res.data) {
      const colNames = listInfo.dataSource.columns.map(col=>col.name && !col.skip ? col.name : null);
      res.data = res.data.map(rowArray=>{
        const rowObj = {};
        for(let i = 0; i < colNames.length; i++) {
          if (colNames[i]) {
            rowObj[colNames[i]] = rowArray[i];
          }
        }
        return rowObj;
      })
    }
    return res;
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

//Fix bug: Make sure that only accounts found in field are displayed
export async function getAccount(accountHandle, fieldId) {
  accountHandle = canonicalHandle(accountHandle);
  if (fieldId) {
    await ensureFieldData(fieldId);
    if (!byField.get(fieldId).accounts.find((val)=>val.account === accountHandle)) {
      return null;
    }
    return getMastodonAccount(accountHandle);
  } else {
    await ensureAllFieldData();
    if(!combinedData.find((val)=>val.account === accountHandle)) {
      return null
    };
    return getMastodonAccount(accountHandle);
  }
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

  const re = reFromQueryString(queryString);
  const matchCounts = accounts.map(account=>{
    return {n:Array.from(account.searchText.matchAll(re)).length, account:account};
  });
  return matchCounts.filter(x=>x.n > 0).sort((a,b)=>b.n-a.n).map(x=>x.account)
}

export function getDataSourceInfo(sourceId) {
  const dataSource = dataSources.find((source)=>cleanKey(source.title) === sourceId)
  return dataSource || dataSources.find(source=>source.title === sourceId)
}