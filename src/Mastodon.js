// © 2023 Mark Igra <markigra@sciences.social>
const CONFIG_KEY = "masto_server";

//Cache for whoever the user is following
let following = null;

let curLoginInfo = null;
function saveLoginInfo(instanceName, loginInfo) {
    loginInfo.instance = instanceName;
    curLoginInfo = loginInfo;
    localStorage.setItem(CONFIG_KEY + ":" + instanceName, JSON.stringify(loginInfo))
}

function getLoginInfo(instanceName) {
    if (curLoginInfo && (!instanceName || curLoginInfo.instance === instanceName)) {
        return curLoginInfo;
    }

    if (!instanceName) {
        instanceName = getCurrentInstance();
    }
    
    const itemText = localStorage.getItem(CONFIG_KEY + ":" + instanceName);
    if (!itemText) {
        return {};
    }
    curLoginInfo = JSON.parse(itemText);
    return curLoginInfo;
}

function setCurrentInstance(instanceName) {
    if (!instanceName) {
        return localStorage.removeItem(CONFIG_KEY);
    }
    return localStorage.setItem(CONFIG_KEY, instanceName);
}

export function getCurrentInstance() {
    if (curLoginInfo) {
        return curLoginInfo.instance;
    }
    return localStorage.getItem(CONFIG_KEY);
}

export function cleanServerName(serverText) {
    const trimmed = serverText.trim();
    if (trimmed.startsWith("http")) {
        return new URL(trimmed).hostname;
    }
    if (trimmed.indexOf("@") !== -1) {
        const match = trimmed.match(/[^@]+$/)
        return match[0];
    }
    return trimmed;
}

export async function checkServer(serverText) {
    const hostName = cleanServerName(serverText)
    try {
        const res = await fetch(`https://${hostName}/api/v1/instance`);
        if (res.ok) {
            setCurrentInstance(hostName);
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

// export async function login(instanceName, redirectURL) {
//     const instanceOk = await checkServer(instanceName);
//     if (!instanceOk) {
//         return {error:"Could not reach server"}
//     }
//     setCurrentInstance(instanceName);
//     const loginInfo = getLoginInfo(instanceName);
//     let appInfo = loginInfo.appInfo;
//     if (!loginInfo.appInfo) {
//         appInfo = await createApp(instanceName, redirectURL);
//         if (appInfo.error) {
//             return appInfo;
//         }
//     }
//     if (!loginInfo.accessToken) {
//         displayAuthForm(appInfo, instanceName);
//     } else {
//         return loginInfo.userInfo;
//     }
// }

export async function completeLogin(code) {
    const instanceName = getCurrentInstance();
    const {appInfo} = getLoginInfo(instanceName);
    try {
        const formData = new FormData();
        formData.set("code", code);
        formData.set("client_id", appInfo.clientId);
        formData.set("redirect_uri", appInfo.redirectURL);
        formData.set("scope", "read write:follows");
        formData.set("client_secret", appInfo.clientSecret);
        formData.set("grant_type", "authorization_code")
        const response = await fetch(
          `https://${instanceName}/oauth/token`,
          {
            method: "POST",
            body:formData
          }
        );
        const data = await response.json();
        const loginInfo = getLoginInfo(instanceName);
        loginInfo.accessToken = data.access_token;
        saveLoginInfo(instanceName, loginInfo);
        //Grab users account information here...
        const userInfo = await verifyAccount(loginInfo);
        userInfo.handle = canonicalHandle(userInfo.acct);
        userInfo.instance = instanceName;
        loginInfo.userInfo = userInfo;
        saveLoginInfo(instanceName, loginInfo);
        return userInfo;
      } catch (error) {
        console.error(error);
        return {error};
      }
    
}

export async function logout() {
    const instanceName = getCurrentInstance();
    const loginInfo = getLoginInfo(instanceName);
    try {
        const formData = new FormData();
        formData.set ("client_id", loginInfo.appInfo.clientId);
        formData.set("client_secret", loginInfo.appInfo.clientSecret);
        formData.set("token", loginInfo.accessToken);  
        await fetch(`https://${instanceName}/oauth/revoke`, {
          method: "POST",
          body:formData,
          mode: 'no-cors'
        });
      } catch (error) {
        console.error(error);
      } finally {
        //Even if token wasn't successfully revoked get a new one next time.
        loginInfo.accessToken = null;
        delete loginInfo.userInfo;
        saveLoginInfo(instanceName, loginInfo);
        localAccounts.clear();    
        setCurrentInstance(null);
      }

  
}

export function getUserInfo() {
    const instanceName = getCurrentInstance();
    if (!instanceName) {
        return null;
    }
    return getLoginInfo(instanceName)?.userInfo;
}

export function getUserHandle() {
    const instanceName = getCurrentInstance();
    if (!instanceName) {
        return null;
    }
    return getLoginInfo(instanceName)?.userInfo?.handle;
}

export function isLoggedIn() {
    const instanceName = getCurrentInstance();
    if (!instanceName) {
        return false;
    }
    return getLoginInfo(instanceName)?.accessToken && true;
}

async function createApp(instanceName, redirectURL) {
    const url = `https://${instanceName}/api/v1/apps`
    try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        client_name: process.env.REACT_APP_NAME,
        redirect_uris: redirectURL,
        scopes: "read write:follows",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    const { name, client_id, client_secret, vapid_key } = data;
    const appInfo = {
      appName: name,
      clientId: client_id,
      clientSecret: client_secret,
      vapidKey: vapid_key,
      redirectURL: redirectURL
    };
    console.log(appInfo);
    saveLoginInfo(instanceName, {appInfo});
    return appInfo;
  } catch (error) {
    return {error};
  }
}

export async function ensureApp(instanceName, redirectUrl) {
    const instanceOk = await checkServer(instanceName);
    if (!instanceOk) {
        return {error:"Could not reach server"}
    }
    setCurrentInstance(instanceName);
    const loginInfo = getLoginInfo(instanceName);
    let appInfo = loginInfo.appInfo;
    if (!loginInfo.appInfo) {
        appInfo = await createApp(instanceName, redirectUrl);
    }
    return appInfo;
}

export function getLoginUrl(instanceName) {
    const {appInfo} = getLoginInfo(instanceName);
    return `https://${instanceName}/oauth/authorize?scope=read+write%3Afollows&client_id=${appInfo.clientId}&redirect_uri=${appInfo.redirectURL}&response_type=code`;
}

async function postJson(loginInfo, path, body) {
    const headers =  { "Content-Type": "application/json" };
    if (loginInfo.accessToken) {
        headers.authorization = `Bearer ${loginInfo.accessToken}`;
    }
    const url = `https://${loginInfo.instance}/${path}`
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers:headers
    });
    if (!res.ok) {
        throw new Error(`${res.code}: Error fetching ${path}`)
    }
    const data = await res.json();
    return data;
}

//Two caches for downloaded account information.
//One for the instance of the the current user of this app
//and one for the instance of the account owner.
//Use public account so can see public posts & show account info quickly
//Same account stored in both places if same instance
const localAccounts = new Map();
const publicAccounts = new Map();

export function splitHandle(handle) {
    const a = handle.split("@");
    return {userName:a[a.length - 2], instance:a[a.length - 1]}
}

function cacheLocalAccount(handle, account) {
    const {userName, instance} = splitHandle(handle);
    const isLocalAccount = account.acct.indexOf("@") === -1;
    const currentInstance = getCurrentInstance();
    console.assert(isLocalAccount || (instance !== currentInstance), handle, currentInstance);
    console.assert(userName === account.username, userName, account.username)
    account.handle = handle;
    account.instance = currentInstance;
    localAccounts.set(handle, account);
    if (isLocalAccount) {
        cachePublicAccount(handle, account);
    }
    localAccounts.set(handle, account);
}

function cachePublicAccount(handle, account) {
    const {instance} = splitHandle(handle);
    account.handle = handle;
    account.instance = instance;
    publicAccounts.set(handle, account);
}

//Todo: we could end up calling this multiple times in rapid succession
//Should keep a notification queue.
export async function getLocalAccount(handle) {
    handle = canonicalHandle(handle);
    if (!isLoggedIn()) {
        throw new Error("Need to log in before accessing account details from server");
    }
    if (localAccounts.has(handle)) {
        return localAccounts.get(handle);
    }
    const ret = await getLocalJson(getLoginInfo(), "/api/v2/search", {q:handle, resolve:true, type:"accounts", limit:1});
    const accountArray = ret.accounts || [];
    if (accountArray.length >= 1) {
        const account = accountArray[0];
        cacheLocalAccount(handle, account);
        return account;
    } else {
        console.error("bad accounts", handle, accountArray)
        return null;
    }
}

// Same account shows up with different ids on local users server & other server
// Sometimes preferable to use public account from home server since
// posts are always stored there. But fall back to local server since
// sometimes public search appears to be blocked, but web-finger can find the person
export async function getAccount(handle) {
    handle = canonicalHandle(handle);
    const {instance} = splitHandle(handle);
    if (instance === getCurrentInstance() && isLoggedIn()) {
        return getLocalAccount(handle);
    }

    const cachedPublicAccount = publicAccounts.get(handle);
    if (cachedPublicAccount) {
        return cachedPublicAccount;
    }

    let accountArray = []
    try {
        const ret = await getPublicJson(instance, "/api/v2/search", {q:handle, type:"accounts", limit:1});
        accountArray = ret.accounts || [];    
    } catch (e) {
        if (!isLoggedIn()) {
            throw new Error(`Error getting public account for ${handle}, not logged in, so can't use server`);
        }
        console.error(`Error getting public account for ${handle}, trying local`, e);
        return getLocalAccount(handle);
    }

    if (accountArray.length >= 1) {
        const account = accountArray[0];
        cachePublicAccount(handle, account);
        return account;
    } else {
        console.error(`No account found for ${handle}`)
        return null;
    }
}

export function canonicalHandle(handle, userInstance = getCurrentInstance()) {
  handle = handle.trim();
  if(!handle.startsWith("@")) {
      handle = "@" + handle;
  }
  if (handle.lastIndexOf("@") === 0 && userInstance) {
      handle = `${handle}@${userInstance}`
  }
  return handle;
}

export async function follow(handle) {
    const account = await getLocalAccount(handle);
    if (!account || account.error) {
        throw new Error(`Couldn't find ${handle}`);
    }
    const rel = await postJson(getLoginInfo(), `/api/v1/accounts/${account.id}/follow`);
    if (rel.following) {
        following.add(canonicalHandle(handle));
    }
    return rel.following;
}

export async function unfollow(handle) {
    const account = await getLocalAccount(handle);
    if (!account || account.error) {
        throw new Error(`Couldn't find ${handle}`);
    }
    const rel = await postJson(getLoginInfo(), `/api/v1/accounts/${account.id}/unfollow`);
    if (!rel.following) {
        following.delete(canonicalHandle(handle));
    }
    return rel.following;
}

export async function getUserFollows() {
    //TODO: Queue up calls since this can be called more than once
    //Or use a fancier data model that takes care of it.
    if (following) {
        return following;
    }
    const loginInfo = getLoginInfo();
    const headers =  { "Content-Type": "application/json", authorization:`Bearer ${loginInfo.accessToken}`};

    async function getBatch(url) {
        const res = await fetch(url, {headers:headers});
        if (!res.ok) {
            //TODO: supply message not just code
            throw new Error(`${res.code}: Error fetching ${url}`);
        }
        const link = res.headers.get("Link");
        let nextUrl = null;
        if (link) {
            const matches = link.matchAll(/<([^>]+)>; *rel=["']([^'"]+)['"]/g);
            for (let match of matches) {
                if(match[2] === "next") {
                    nextUrl = match[1]
                }
            }
        }
        const accounts = await res.json();
        return {accounts, nextUrl}
    }

    const handles = new Set();
    const instance = getCurrentInstance();
    let url = `https://${loginInfo.instance}/api/v1/accounts/${loginInfo.userInfo.id}/following?limit=80`
    let requestCount = 0;
    while (url && requestCount < 20) {
        let batch = await getBatch(url);
        batch.accounts.forEach(account=>{
            const handle = canonicalHandle(account.acct, instance);
            cacheLocalAccount(handle, account);
            handles.add(handle)
        });
        url = batch.nextUrl;
        requestCount++;
    }
    following = handles;
    return following;
}

// A synchronous version that allows rendering to continue while waiting happens.
export function getUserFollowsImmediate() {
    return following;
}

const postCache = new Map();
export async function getPosts(accountInfo) {
    console.assert(accountInfo.handle, accountInfo);
    const cachedPosts = postCache.get(accountInfo.handle);
    if (cachedPosts) {
        return cachedPosts;
    }
    console.assert(accountInfo.instance, `Missing instance for ${accountInfo.url}`);
    const [pinnedPosts, posts] = await Promise.all([
        getPublicJson(accountInfo.instance, `/api/v1/accounts/${accountInfo.id}/statuses`, {pinned:true}),
        getPublicJson(accountInfo.instance, `/api/v1/accounts/${accountInfo.id}/statuses`,  {exclude_replies:true}),
    ]);
    let allPosts = posts;
    // Posts can be duplicated across requests.
    if (pinnedPosts && pinnedPosts.length) {
        const pinnedIds = new Set();
        pinnedPosts.forEach(post=>{pinnedIds.add(post.id); post.pinned = true})
        allPosts = pinnedPosts.concat(posts.filter(post=>!pinnedIds.has(post.id)))
    }
    postCache.set(accountInfo.handle, allPosts);
    return allPosts;
}

async function getLocalJson(loginInfo, path, params) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    const headers =  { "Content-Type": "application/json" };
    if (loginInfo.accessToken) {
        headers.authorization = `Bearer ${loginInfo.accessToken}`;
    } 
    if (path.startsWith("/")) {
        path = path.substring(1);
    }
    const url = `https://${loginInfo.instance}/${path}${queryString}`
    const res = await fetch(url, {
        headers:headers
    });
    if (!res.ok) {
        throw new Error(`${res.code}: Error fetching ${path}`)
    }
    const data = await res.json();
    return data;
}

async function getPublicJson(instance, path, params) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    const headers =  { "Content-Type": "application/json" };
    if (path.startsWith("/")) {
        path = path.substring(1);
    }
    const url = `https://${instance}/${path}${queryString}`
    const res = await fetch(url, {
        headers:headers
    });
    if (!res.ok) {
        throw new Error(`${res.code}: Error fetching ${path}`)
    }
    const data = await res.json();
    return data;
}

async function verifyAccount(loginInfo) {
    return getLocalJson(loginInfo, '/api/v1/accounts/verify_credentials');
}
  
