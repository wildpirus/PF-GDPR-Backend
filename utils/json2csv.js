const converter = require('json-2-csv');

// convert JSON array to CSV string
async function json2csv(){
  try {
    const csv = await converter.json2csvAsync(todos);
    return csv
  } catch (err) {
      console.log(err);
  }
}

module.exports = json2csv;
