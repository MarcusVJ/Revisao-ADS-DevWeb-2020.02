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
async function getCountries() {
  let paises = [];
  showLoading('loadingCountry');
  try {
    const response = await axios.get(
      'http://api.geonames.org/countryInfoJSON?formatted=true&lang=pt&username=marcusvj&style=full'
    );
    for (let i = 0; i < response.data.geonames.length; i = i + 1) {
      paises.push({
        id: response.data.geonames[i].geonameId,
        name: response.data.geonames[i].countryName,
      });
    }
    paises.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    populateCountries(paises);
  } catch (error) {
    alert('Houve um erro ao fazer a requisição.');
    console.log('Erro: ' + error);
  }
  hideLoading('loadingCountry');
}

async function getStates() {
  let estados = [];
  showLoading('loadingState');
  try {
    const response = await axios.get(
      `http://www.geonames.org/childrenJSON?geonameId=${countrySelector.value}&username=marcusvj`
    );
    for (let i = 0; i < response.data.geonames.length; i = i + 1) {
      estados.push({
        id: response.data.geonames[i].geonameId,
        name: response.data.geonames[i].toponymName,
      });
    }
    estados.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    populateStates(estados);
  } catch (error) {
    alert('Houve um erro ao fazer a requisição.');
    console.log('Erro: ' + error);
  }
  hideLoading('loadingState');
}

async function getCities() {
  let cidades = [];
  showLoading('loadingCity');
  try {
    const response = await axios.get(
      `http://www.geonames.org/childrenJSON?geonameId=${stateSelector.value}&username=marcusvj&maxRows=1000`
    );
    for (let i = 0; i < response.data.geonames.length; i = i + 1) {
      cidades.push({
        id: response.data.geonames[i].geonameId,
        name: response.data.geonames[i].toponymName,
      });
    }
    cidades.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    populateCities(cidades);
  } catch (error) {
    alert('Houve um erro ao fazer a requisição.');
    console.log('Erro: ' + error);
  }
  hideLoading('loadingCity');
}

//populando os campos
function populateCountries(countries) {
  stateSelector.innerHTML = '';
  citySelector.innerHTML = '';
  countries.forEach((country) => {
    const newOption = document.createElement('OPTION');
    newOption.setAttribute('value', country.id);
    let text = document.createTextNode(`${country.name}`);
    newOption.appendChild(text);
    countrySelector.appendChild(newOption);
  });
  countrySelector.disabled = false;
}

function populateStates(states) {
  stateSelector.innerHTML = '';
  citySelector.innerHTML = '';
  citySelector.disabled = true;
  states.forEach((state) => {
    const newOption = document.createElement('OPTION');
    newOption.setAttribute('value', state.id);
    let text = document.createTextNode(`${state.name}`);
    newOption.appendChild(text);
    stateSelector.appendChild(newOption);
  });
  stateSelector.disabled = false;
}

function populateCities(cities) {
  citySelector.innerHTML = '';
  cities.forEach((city) => {
    const option = document.createElement('OPTION');
    option.setAttribute('value', city.id);
    let text = document.createTextNode(`${city.name}`);
    option.appendChild(text);
    citySelector.appendChild(option);
  });
  citySelector.disabled = false;
}

//escrever no banco de dados
function postEntry() {
  let name = nameInput.value;
  let birthday = birthdayInput.value;
  let country =
    countrySelector.selectedIndex > -1
      ? countrySelector.options[countrySelector.selectedIndex].text
      : '';
  let state =
    stateSelector.selectedIndex > -1
      ? stateSelector.options[stateSelector.selectedIndex].text
      : '';
  let city =
    citySelector.selectedIndex > -1
      ? citySelector.options[citySelector.selectedIndex].text
      : '';
  let neighborhood = neighborhoodInput.value;
  let address = addressInput.value;

  if (
    (name === '' ||
      birthday === '' ||
      country === '' ||
      state === '' ||
      neighborhood === '' ||
      city === '',
    address === '')
  ) {
    alert('Todos os campos devem ser preenchidos!');
    event.preventDefault();
  }

  let newEntry = {
    name: name,
    birthday: birthday,
    country: country,
    state: state,
    city: city,
    neighborhood: neighborhood,
    address: address,
  };

  axios
    .post('http://localhost:3000/cadastros', newEntry)
    .then((resp) => {
      alert('Cadastro salvo com sucesso!');
      console.log(resp.data);
    })
    .catch((error) => {
      alert('Houve um erro ao fazer a requisição.');
      console.log('Erro: ' + error);
    });
}

function hideLoading(element) {
  const loading = document.querySelector(`.${element}`);
  loading.style.visibility = 'hidden';
}

function showLoading(element) {
  const loading = document.querySelector(`.${element}`);
  loading.style.visibility = 'visible';
}
