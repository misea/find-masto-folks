  
import combinedData from "./search_data/combined.json";
import escapeRegExp from "lodash.escaperegexp"

function joinClean(...args) {return args.filter(arg=>arg!== undefined && arg !== null).join(" ")}

const cleanData = combinedData.filter(r=>r.account && r.account.indexOf("@") !== -1)
cleanData.forEach(r=>{
  r.searchText = joinClean(r.account, r.name, r.field, r.keywords, r.intro)
});

function cleanKey(text) {return text.replaceAll(/[ &+()]/g, "-").replaceAll(/-+/g, "-").toLowerCase()}
const byField = new Map();
cleanData.forEach(r=>{
  const fieldKey = cleanKey(r.field);
  let fieldData = byField.get(fieldKey);
  if (!fieldData) {
    const keywords = new Set();
    const accountHandles = new Set();
    accountHandles.add(r.account)
    if (r.keywords) {
      r.keywords.split(/,| /).forEach(w=>keywords.add(w));
    }
    byField.set(fieldKey, {fieldKey:fieldKey, field:r.field, accounts:[r], accountHandles:accountHandles, keywords:keywords})
  } else if(!fieldData.accountHandles.has(r.account)) { //There are dups in some sets
    if (r.keywords) {
      r.keywords.split(/,/).forEach(w=>fieldData.keywords.add(w));
    }
    fieldData.accountHandles.add(r.account) 
    fieldData.accounts.push(r);
  }
})


const departments = [];
for(const [fieldKey, data] of byField) {
  departments.push({id:fieldKey, title:data.field, keywords:Array.from(data.keywords).sort()});
}

export async function getFields() {
    return departments;
}

export async function getPeople(fieldId, queryString) {
    // await fakeNetwork(fieldId);
    if (queryString) {
      queryString = queryString.trim();
      if (queryString === "") {
        queryString = null;
      }
    }

    if (!fieldId && !queryString)
      return [];

    if (fieldId) {
      return filterByQueryString(byField.get(fieldId).accounts, queryString);
    } else {
      return filterByQueryString(cleanData, queryString)
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

// let fakeCache = {};
// async function fakeNetwork(key) {
//     if (!key) {
//       fakeCache = {};
//     }
  
//     if (fakeCache[key]) {
//       return;
//     }
  
//     fakeCache[key] = true;
//     return new Promise(res => {
//       setTimeout(res, Math.random() * 800);
//     });
//   }