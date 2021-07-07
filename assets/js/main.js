function fetchJson(url) {
  return fetch(url).then((resp) => resp.json());
}

const baseURL = "https://api.covid19api.com";

async function getCovidData() {
  let data = await fetchJson(`${baseURL}/summary`);
  let global = data.Global;
  let countriesArray = data.Countries;
  console.log("Global", data.Global);
  console.log("Countries", data.Countries);
}
getCovidData();
