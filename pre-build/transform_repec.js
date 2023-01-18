const Papa = require("papaparse");
const codeMap = require("./repec_code_map.json");

function transform(repec_text) {
  const parseOutput = Papa.parse(repec_text, {header:false, delimiter:";"});
  const transformed = parseOutput.data.map(row=>{
    return {
      account:row[1],
      name:row[2],
      keywords:mapCodes(row[3])
    }
  });
  return Papa.unparse(transformed);
}

function mapCodes(codes) {
  if (!codes || codes == "") {
    return null;
  }
  return codes.split(",").map(code=>codeMap[code.trim()] || code).slice(0,5).join(', ')
}

module.exports = {list:"Economics", transform};