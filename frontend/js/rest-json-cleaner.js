let oldFetch = fetch;

fetch = async function (...args) {
  let rawResult = await oldFetch(...args);
  // monkey patch the json method of the rawResult
  let oldJson = rawResult.json;
  rawResult.json = async function () {
    let data = await oldJson.apply(rawResult);
    // Remove all < and > - characters from the fetched JSON
    // the second to json stringify is a function that
    // can transform values on all levels in data structure
    // (check all values that are strings...)
    data = JSON.parse(JSON.stringify(data, function (key, value) {
      if (typeof value === 'string') {
        value = value
          .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      }
      return value;
    }));
    // Return data to make our patched json method
    // continue to work as the original method
    return data;
  }
  return rawResult;
}