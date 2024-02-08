const input = document.querySelector('.search-input');
const result = document.querySelector('.search-results');
const weather = document.querySelector('.weather-card')
const weatherInfo = document.querySelector('.weather-card-container')
const myAPIkey = "4201aad943feb7c50d1cb5ad0de0ca52";
// let parsedData = [];
const icons = {'01d':'icon-clear-day', 
'01n':'icon-clear-night', 
'03d':'icon-cloudy', 
'03n':'icon-cloudy', 
'02d':'icon-cloudy', 
'02n':'icon-cloudy', 
'04d':'icon-cloudy', 
'04n':'icon-cloudy', 
'09d':'icon-rain', 
'09n':'icon-rain', 
'10d':'icon-rainy-day', 
'10n':'icon-rainy-night', 
'11d':'icon-thunderstorm', 
'11n':'icon-thunderstorm', 
'13d':'icon-snow', 
'13n':'icon-snow', 
'50d':'icon-mist', 
'50n':'icon-mist'
};


result.classList.add('hide');
hideWeather();

input.addEventListener('keyup', (e) => {
    const value = e.target.value.toLowerCase();
    if(value == "")
    {
        clearChildren();
        return;
    }
    if(e.key == 'Enter')
    {
        hideWeather();
        result.classList.remove('hide');
        getCoordinates(value,  createLi);
    }
});

function showError()
{
    console.log(1);
    let error = document.createElement('li');
    error.innerText = "Invalid city name. Please try again!";
    error.classList.add("search-error");
    error.classList.add('error');
    hideWeather();
    result.appendChild(error);
}

function clearChildren()
{
    while(result.firstChild)
    {
        result.removeChild(result.firstChild);
    }
}

function getCoordinates(cityName)
{
    clearChildren();
    if(cityName == "") return;
    const limit = 5;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${myAPIkey}`
    fetch(url).then(res => res.json()).then(data => {
        parseData(data);
        result.firstChild == null && showError();
    });
}

function parseData(resultData)
{
    resultData.map(i => {
        let name = `${i.name}, ${i.state}, ${i.country}`;
        name = name.replace("undefined,", "");
        name = name.replace(/ {2,}/g, ' ');
        createLi(name, i.lat, i.lon, 'search-result');
    });
}

result.addEventListener('click', (e) => {
    if(e.target.classList.contains('search-result'))
    {
        result.classList.add('hide');
        resetUI();
        getWeather(e.target);
    }
})

function getWeather(element)
{
    let lat = element.getAttribute('data-lat');
    let lon = element.getAttribute('data-lon');
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${myAPIkey}`
    fetch(url).then(res => res.json()).then(data => {
        let weatherData = {temperature: Math.round(data.main.temp), name: element.innerText, humidity:data.main.humidity, temperature:Math.round(data.main.feels_like), windspeed:Math.round(data.wind.speed), weather:data.weather[0].main, icon:icons[data.weather[0].icon]};
        loadElement(weatherData);
    })
}

function resetUI()
{
    document.querySelector('.weather-cards').innerHTML = '';
    document.querySelector('.sprite-container>div').classList = ['icon'];
}

function loadElement(element)
{
    showWeather();
    const icon = document.querySelector('.icon');
    icon.classList.add(element.icon);

    const temp = document.querySelector('.weather-temp-info>h2');
    temp.innerText = `${element.temperature}°C`;

    const status = document.querySelector('.weather-temp-info>p');
    status.innerText = element.weather;

    const img = document.querySelector('.weather-location-info>img');
    img.src = './assets/location.png';

    const title = document.querySelector('.weather-location-info>h1');
    title.innerText = element.name;

    const div = document.querySelector('.weather-cards');

    const humidityCard = createWeatherCard('./assets/humidity.png', 'Humidity', `${element.humidity}%`);
    div.appendChild(humidityCard);

    const temperatureCard = createWeatherCard('./assets/temperature.png', 'Feels Like', `${element.temperature}°C`);
    div.appendChild(temperatureCard);
    
    const windCard = createWeatherCard('./assets/wind.png', 'Wind', `${element.windspeed}m/s`);
    div.appendChild(windCard);
}

function showWeather()
{
    weather.classList.remove('hide');
    weatherInfo.classList.remove('hide');
}

function hideWeather()
{
    weather.classList.add('hide');
    weatherInfo.classList.add('hide');
}

function createWeatherCard(image, value, item)
{
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('weather-info-card');

    const img = document.createElement('img');
    img.src = image;

    const subDiv = document.createElement('div');

    const val = document.createElement('h3');
    val.innerText = value;

    const it = document.createElement('p');
    it.innerText = item;

    subDiv.appendChild(val);
    subDiv.appendChild(it);
    mainDiv.appendChild(img);
    mainDiv.appendChild(subDiv);

    return mainDiv;
}

function createLi(cityName, lat, lon, className)
{
    const li = document.createElement('li');
    li.classList.add(className);
    li.setAttribute('data-lat', lat);
    li.setAttribute('data-lon', lon);
    li.innerHTML = cityName;
    result.appendChild(li);
}