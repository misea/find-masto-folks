const Papa = require("papaparse");
const fs = require("fs");
const path = require("path");
const sources = require("../src/search_data/data_sources.json");

const csvDir = path.join(__dirname, 'csvs');
if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir);
}

async function downloadFiles() {
    const downloads = sources
    .filter(source=>new URL(source.source).host.endsWith("github.io"))
    .map(source=>{
        const {origin, host, pathname} = new URL(source.source);
            const repo = host.split(".")[0]
            const sourceFileName = source?.dataSource?.file || "users.csv";
            const downloadUrl = `https://raw.githubusercontent.com/${repo}${pathname}/main/resources/${sourceFileName}`
            const localFileName = pathname.replaceAll("/","").toLowerCase() + ".csv";
            console.log(downloadUrl)
            return fetch(downloadUrl)
            .then(response=>{
                if(response.ok) {
                    return response.text()
                } else {
                    throw new Error(downloadUrl + ": " + response.text())
                }
            })
            .then(text=>{
                fs.writeFileSync(path.join(csvDir, localFileName), text)
                return {sourceName:source.title, fileName:localFileName};
            })
            .catch(e=>console.error(e))
    })
    return Promise.all(downloads)
}

function canonicalHandle(handle) {
    return handle.startsWith("@") ? handle : "@" + handle;
}

downloadFiles().then(fileInfos=>{
    const recordSets = fileInfos.map(fileInfo=>{
        const filePath = path.join(csvDir, fileInfo.fileName);
        const allRecords = Papa.parse(fs.readFileSync(filePath, 'utf-8'), {header:true});
        const records = allRecords.data
            .filter(info=>info.account && info.account.indexOf("@") !== -1)
            .map(info=>{info.account = canonicalHandle(info.account); return info;})
        records.forEach(record=>record.field = fileInfo.sourceName);
        records.sort((a, b)=>{
            let aName = a.name || a.account;
            let bName = b.name || b.account;
            if (aName == bName) {
                aName = a.account;
                bName = b.account;
            }
            if (aName < bName) {
                return -1;
            } else if (aName > bName) {
                return 1;
            } 
            return 0;
        })
        return records;
    });
    const combined = [].concat(...recordSets);
    fs.writeFileSync(path.join(__dirname, "..", "src", "search_data", "combined.json"), JSON.stringify(combined,undefined,2))
    fs.writeFileSync(path.join(__dirname, "csvs", "combined.csv"), Papa.unparse(combined));
})
