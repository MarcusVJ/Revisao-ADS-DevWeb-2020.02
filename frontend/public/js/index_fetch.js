window.onload = () => {
  this.getCountries();
};

//inputs
const nameInput = document.querySelector('[name="name"]');
const birthdayInput = document.querySelector('[name="birthday"]');
const countrySelector = document.querySelector('[name="country"]');
const stateSelector = document.querySelector('[name="state"]');
const citySelector = document.querySelector('[name="city"]');
const neighborhoodInput = document.querySelector('[name="neighborhood"]');
const addressInput = document.querySelector('[name="address"]');

//relacionados à API GeoNames
function getCountries() {
  let paises = [];
  fetch(
    'http://api.geonames.org/countryInfoJSON?formatted=true&lang=pt&username=marcusvj&style=full'
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.geonames.length; i = i + 1) {
        paises.push({
          id: data.geonames[i].geonameId,
          name: data.geonames[i].countryName,
        });
      }
      paises.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      return paises;
      //populateCountries(paises);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getStates() {
  let estados = [];
  fetch(
    `http://www.geonames.org/childrenJSON?geonameId=${countrySelector.value}&username=marcusvj`
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.geonames.length; i = i + 1) {
        estados.push({
          id: data.geonames[i].geonameId,
          name: data.geonames[i].toponymName,
        });
      }
      estados.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      populateStates(estados);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getCities() {
  let cidades = [];
  fetch(
    `http://www.geonames.org/childrenJSON?geonameId=${stateSelector.value}&username=marcusvj&maxRows=1000`
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.geonames.length; i = i + 1) {
        cidades.push({
          id: data.geonames[i].geonameId,
          name: data.geonames[i].toponymName,
        });
      }
      cidades.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      populateCities(cidades);
    })
    .catch((err) => {
      console.log(err);
    });
}
