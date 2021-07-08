//-------------AUXILIAR FUNCTIONS-------------
function fetchJson(url) {
  return fetch(url).then((resp) => resp.json());
}

function formatNumber(n) {
  return new Intl.NumberFormat("pt-br").format(n);
}

function subtractDay(selectedDate) {
  let date = new Date(selectedDate);
  let dateUTC = date.getTimezoneOffset() / 60;
  let milisecondsByDay = 1000 * 60 * 60 * (24 - dateUTC);
  let deltaDate = new Date(date.getTime() - milisecondsByDay);
  let year = deltaDate.getFullYear().toString();
  let month = deltaDate.getMonth() + 1; //months starts in 0 (represents january)
  month = month.toString().padStart(2, "0");
  let day = deltaDate.getDate().toString().padStart(2, "0");
  let deltaDateFormatted = `${year}-${month}-${day}`;
  return deltaDateFormatted;
}

//-------------PRINCIPAL--------------
const baseURL = "https://api.covid19api.com";

function renderData(id, kpi, text) {
  if(text) return (document.getElementById(id).innerHTML = text + " - " + formatNumber(kpi));
  else return (document.getElementById(id).innerHTML = formatNumber(kpi));
}

function renderDiaryValues(id, kpi, text) {
    
}

async function getCovidData() {
  let data = await fetchJson(`${baseURL}/summary`);
  let global = data.Global;
  let countriesArray = data.Countries;
  return { global, countriesArray };
}

(async function populateGlobalData() {
  ({ global } = await getCovidData());
  renderData("confirmed", global.TotalConfirmed);
  renderData("death", global.TotalDeaths);
  renderData("recovered", global.TotalRecovered);
  let day = global.Date.slice(8, 10);
  let month = global.Date.slice(5, 7);
  let year = global.Date.slice(0, 4);
  let currentDate = `${day}/${month}/${year}`;

  document.getElementById("actives-title").innerHTML = "Data de Atualização";
  document.getElementById(
    "active"
  ).innerHTML = `${currentDate} - ${global.Date.slice(11, 16)}`;
})();

async function populateComboCountries() {
  ({ countriesArray } = await getCovidData());
  countriesList = countriesArray.map((item) => {
    return { country: item.Country, slug: item.Slug };
  });
  
  //prettier-ignore
  countriesList.forEach((item) =>
      (document.getElementById("combo").innerHTML += `<option value=${item.slug} >${item.country}</option>`)
  );
}

async function populateCountriesData() {
    let selectedDate = document.getElementById("today").value;
    console.log(selectedDate);
    let selectedCountry = document.getElementById("combo").value;
    let startDate = `${subtractDay(selectedDate)}T00:00:00Z`;
    let endDate = `${selectedDate}T23:59:59Z`;
    let country = await fetchJson(`${baseURL}/country/${selectedCountry}?from=${startDate}&to=${endDate}`);
      
  renderData("confirmed", country[1].Confirmed);
  renderData("death", country[1].Deaths);
  renderData("recovered", country[1].Recovered);
  document.getElementById("actives-title").innerHTML = "Ativos";
  renderData("active", country[1].Active);
  
  renderData("diary-confirmed", country[1].Confirmed-country[0].Confirmed, "Diário");
  renderData("diary-death", country[1].Deaths-country[0].Deaths, "Diário");
  renderData("diary-recovered", country[1].Recovered-country[0].Recovered, "Diário");
 renderData("diary-active", country[1].Active-country[0].Active, "Diário");
}

