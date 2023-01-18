const fs = require("fs/promises");
const path = require("path");

//TODO: Would like to make this generic (just load transform modules)
const transforms = {
  "Economics":require("./transform_repec.js").transform
}

const dataSources = require(path.join(__dirname, "../src/search_data/data_sources.json"));
dataSources.forEach(listInfo=>{
  if (listInfo?.build?.copy) {
    console.log(`copying ${listInfo.dataSource.url} to ${listInfo.build.localName}`)
    fetch(listInfo.dataSource.url)
    .then(res=>res.text())
    .then(text=>
      transforms[listInfo.title] ? transforms[listInfo.title](text) : text)
    .then(text=>fs.writeFile(`./public/data/${listInfo.build.localName}`, text, 'utf-8'))
  }
})