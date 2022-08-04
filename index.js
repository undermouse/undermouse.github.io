// constants
const settings = document.querySelector('.settings-ico');
const settPopup = document.querySelector('.settings-popup');
const settListItem = document.querySelectorAll('.settings-list-item');
const flag = document.querySelector('.flag');
const timeEl   = document.querySelector('.time');
const dateEl   = document.querySelector('.date');
const cityEl   = document.querySelector('.city');
const greetEl  = document.querySelector('.greeting');
const greetCont  = document.querySelector('.greeting-container');
const nameEl   = document.querySelector('.name');
const slideNext= document.querySelector('.slide-next');
const slidePrev= document.querySelector('.slide-prev');;
const LS       = window.localStorage;
const quoteT   = document.querySelector('.quote');
const quoteA   = document.querySelector('.author');
const weather = document.querySelector('.weather');
const changeQuote = document.querySelector('.change-quote');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherError = document.querySelector('.weather-error');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherDescription = document.querySelector('.weather-description');

// Player consts
const player = document.querySelector('.audio-player');
const playListUl = document.querySelector('.play-list');
const selectedSong = document.querySelector('.play-item');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const playBtn  = document.getElementById('play-btn');
const musicName = document.querySelector('.music-name');
const musicLength = document.querySelector('.length');
const volume = document.querySelector('.volume');
//

const footerCont = document.querySelector('.footer-container');
const photoRadio = document.getElementById('photo-radio');
const apiTags = document.querySelector('.tags');
const mainGoalContainer = document.querySelector('.main-goal-container');
const mainGoalInput = document.querySelector('.main-goal-input');
const mainGoalReset = document.querySelector('.mg-reset');
const mainGoalHeader = document.querySelector('.mg-heading');
const secretHeading = document.querySelector('.secret-heading');



let isPlay = false;
let playNum = 0;
let photoSource = 'github-radio';
let photoSourceRadio = document.querySelector('#photo-radio');
photoSourceRadio.onchange = (e) => {
  photoSource = e;
} 

// Base 
const getUserLang = () => { 
  let navLang = navigator.language.slice(0, 2);
  return navLang;
}

const checkLangInLocalStorage = () => {
  let userLang = '';
  if (LS.getItem('lang') !== null) {
    userLang = LS.getItem('lang');
  } else {
    userLang = getUserLang();
  };
  return userLang;
}

let userLang = checkLangInLocalStorage();

const setUserFlag = (lang) => {
  if (lang === 'ru') {
    flag.classList.remove('flag-en');
    flag.classList.add('flag-ru');
    LS.setItem('lang', 'ru');
  } else if (lang === 'en') {
    flag.classList.remove('flag-ru');
    flag.classList.add('flag-en');
    LS.setItem('lang', 'en');
  }
}

setUserFlag(userLang)

flag.onclick = () => {
  if (userLang === 'en') {
    userLang = 'ru';
    flag.classList.remove('flag-en');
    flag.classList.add('flag-ru');
    LS.setItem('lang', 'ru');
    if (!LS.getItem('city')) {
      LS.setItem('city', 'Washington');
    }
    getWeather(cityEl.value);
    getQuote(userLang);
    setMainGoal();
    dateEl.textContent = getDate();
    greetEl.textContent = setGreeting();

  } else if (userLang === 'ru') {
    userLang = 'en';
    flag.classList.remove('flag-ru');
    flag.classList.add('flag-en');
    LS.setItem('lang', 'en');
    getWeather(cityEl.value);
    getQuote(userLang);
    setMainGoal();
    dateEl.textContent = getDate();
    greetEl.textContent = setGreeting();
  }
}

import playList from "./playList.js";
// Audio Player
const audio = new Audio(); 
audio.src = playList[playNum].src;
musicLength.textContent = playList[0].duration;
musicName.textContent = playList[0].title;


const toggleAudio = () => {
  if (isPlay === false) {
    audio.play();
    audio.currentTime = 0;
    isPlay = true;
    musicName.textContent = playList[playNum].title;

    if (playListUl.children[playNum].innerText === playList[playNum].title) {
      playListUl.children[playNum].classList.add('now-playing')
    }
  } else {
    audio.pause();
    audio.currentTime = 0;
    isPlay = false;
  }
}

audio.addEventListener(
  "loadeddata",
  () => {
    document.querySelector(".length").textContent = getTimeCodeFromNum(
      audio.duration
    );
    audio.volume = .75;
  },
  false
);

const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  document.querySelector(".volume-percentage").style.width = newVolume * 100 + '%';
}, false);

setInterval(() => {
  const progressBar = document.querySelector(".progress");
  progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
  document.querySelector(".play-time .current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
}, 500);

volume.onclick = () => {
  const sliderW = document.querySelector(".volume-percentage");
  if (audio.volume !== 0) {
    audio.volume = 0;
    volume.classList.remove('vol-ico');
    volume.classList.add('mute-ico');
    sliderW.style.display = 'none';
    
  } else {
    audio.volume = 0.75;
    volume.classList.remove('mute-ico');
    volume.classList.add('vol-ico');
    sliderW.style.display = 'flex';
  }

  
}

playBtn.onclick = () => {
  toggleAudio();
  playBtn.classList.toggle('pause');
}

playNextBtn.addEventListener('click', () => {
  audio.pause();
  if (playNum < playList.length - 1) {
    playNum += 1;
  } else {
    playNum = 0;
  }
  audio.src = playList[playNum].src;
  musicName.textContent = playList[playNum].title;
  for (let i = 0; i < playListUl.children.length; i++) {
    playListUl.children[i].classList.remove('now-playing')
  }
  if (playListUl.children[playNum].innerText === playList[playNum].title) {
    playListUl.children[playNum].classList.add('now-playing');
  }
  audio.play();
})


playPrevBtn.addEventListener('click', () => {
  audio.pause();
  if (playNum > 0) {
    playNum -= 1;
  } else {
    playNum = playList.length - 1;
  }
  audio.src = playList[playNum].src;
  //musicLength.textContent = playList[playNum].duration;
  musicName.textContent = playList[playNum].title;
  for (let i = 0; i < playListUl.children.length; i++) {
    playListUl.children[i].classList.remove('now-playing')
  }
  if (playListUl.children[playNum].innerText === playList[playNum].title) {
    playListUl.children[playNum].classList.add('now-playing')
  }
  audio.play();
  
})

// Timeline and Volume
function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

const timeline = document.querySelector(".timeline");
timeline.addEventListener("click", e => {
  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
  audio.currentTime = timeToSeek;
}, false);


function createPlayList() {
        playList.forEach(function (el) {
            const li = document.createElement('li');
            li.classList.add('play-item');
            li.innerHTML = el.title;

            li.addEventListener('click', (e) => {
                          
              for (let i = 0; i < playList.length; i++) {
                playListUl.children[i].classList.remove('now-playing')
              }
              audio.src = el.src;
              isPlay = true;
              audio.currentTime = 0;
              
              li.classList.add('now-playing');
              e.target.classList.add('now-playing');
              musicName.textContent = el.title;
              
              audio.play();
              playBtn.classList.add('pause');
            })
             playListUl.append(li);
      })
    }
           
            


createPlayList();



// Additional funcs
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  let num = Math.floor(Math.random() * (max - min)) + min;
  if (num < 10) {
    return String(num).padStart(2, 0);
  }
  return String(num);
} // min 1, max 20

let randomNum  = getRandomInt(1, 20);


// Date, Time, greeting funcs
const getTimeOfDay = () => {
  let now = new Date();
  return now.toLocaleTimeString();
}

const getDate = () => {
  let now = new Date();
  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  
  if (userLang === 'ru') {
    return now.toLocaleString("ru-RU", options);
  } else {
    return now.toLocaleString("en-US", options);
  }
}

const getTimeName = () => {
  let now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  let timeName = '';

  if (h > 6 && h < 12 && m <= 59) {
    timeName = 'morning';
  } else if (h >= 12 && h < 17 && m <= 59) {
    timeName = 'afternoon';
  } else if (h >= 18 && h < 25 && m <= 59) {
    timeName = 'evening';
  } else if (h >= 0 &&  h < 6 && m <= 59) {
    timeName = 'night';
  } 
  
  return timeName;
}

const setGreeting = () => {

  const greet = getTimeName();
  if (userLang === 'ru') {
    switch (greet) {
      case 'morning':
        return 'Доброе утро, '
        break;
      case 'afternoon':
        return 'Добрый день, '
        break;
      case 'evening':
        return 'Добрый вечер, '
        break;
      case 'night':
        return 'Доброй ночи, '
        break;
    }
  } else {
    return `Good ${greet}, `
  }
}



// Background 
if (LS.getItem('tags') !== null) {
  apiTags.value = LS.getItem('tags');
}

apiTags.onchange = () => {
  LS.setItem('tags', apiTags.value);
}

const setBg = (bgNum) => {

  if (photoSource === 'github-radio') {
    let timeOfDay = getTimeName();
    let bgUrl = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    let body = document.getElementById('body');
    const img = new Image();
    img.src = bgUrl;
    img.onload = () => {
      body.style.backgroundImage = `url('${img.src}')`;
    }
  } else if (photoSource === 'api-radio') {
    setBgFromApi();
  }

}

const setBgFromApi = (offset) => {

    let timeOfDay = getTimeName();
    let width = window.innerWidth;
    let height = window.innerHeight;
    let tags = apiTags.value;

    const img = new Image();
    let bgUrl = `https://source.unsplash.com/random/${width}x${height}/?${tags},${timeOfDay}`;

    img.src = bgUrl;
    img.onload = () => {
      body.style.backgroundImage = `url('${img.src}')`;
    }

    
}
// Slides switchers
slideNext.addEventListener('click', () => {
  getSlideNext();
})

slidePrev.addEventListener('click', () => {
  getSlidePrev();
})

const getSlideNext = () => {
  if (photoSource === 'github-radio') {
    randomNum = Number(randomNum);
    if (randomNum < 20) {
      randomNum += 1;
    } else {
      randomNum = 1;
    }
    let nextBg = String(randomNum).padStart(2, 0);
    setBg(nextBg);
  } else {
    setBgFromApi(1);
  }
};

const getSlidePrev = () => {
  if (photoSource === 'github-radio') {
    randomNum = Number(randomNum);
    if (randomNum > 1) {
      randomNum -= 1;
    } else {
      randomNum = 20;
    }
    let prevBg = String(randomNum).padStart(2, 0);
    setBg(prevBg);
  } else {
    setBgFromApi(1);
  }
}

// Weather widget
async function getWeather(city) {  
  const lang = userLang;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=c20745821d8e3b80497a536dcc27c903&units=metric`;
  const res = await fetch(url);
  const data = await res.json(); 

  
  if (data.cod === "404") {
    weatherError.textContent = 'Error 404: not found'
  } else {
    weatherError.classList.remove('visible');
    weatherError.classList.add('transparent');
  }
  
  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.floor(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = Math.ceil(data.wind.speed) + ' m/s ' + windDescription(data.wind.deg);
  if (userLang === 'ru') {
   humidity.textContent = `${data.main.humidity}% влажность`;
  } else {
    humidity.textContent = `${data.main.humidity}% humidity`;
  }
}

const windDescription = (windDirection) => {
  if (windDirection >= 0 && windDirection < 45) {
    return 'N';
  } else if (windDirection >= 45 && windDirection < 90) {
    return 'N-W';
  } else if (windDirection >= 90 && windDirection < 135) {
    return 'W';
  } else if (windDirection >= 135 && windDirection < 180) {
    return 'S-W';
  } else if (windDirection >= 180 && windDirection < 225) {
    return 'S';
  } else if (windDirection >= 225 && windDirection < 270) {
    return 'S-E';
  } else if (windDirection >= 270 && windDirection < 315) {
    return 'N-E';
  } else if (windDirection >= 315 && windDirection < 359) {
    return 'N-E';
  }
}

// Quotes widget
async function getQuote(lang) {  
  const quotes = `./quotes/quotes_${lang}.json`;
  
  const res = await fetch(quotes);
  const data = await res.json(); 
  
  let randomQuoteNum = Number(getRandomInt(1, data.length));
  

  quoteT.textContent = (data[randomQuoteNum].text);
  quoteA.textContent = (data[randomQuoteNum].author);
  
}

// Settings
const loadOnlyVisibleStuff = () => {
  
  settListItem.forEach((el) => {
    let blockToHide = document.getElementById(el.id);
    if (LS.getItem(`${el.id}`) !== null) {
      blockToHide.classList.remove('visible');
      blockToHide.classList.add('transparent');
      el.classList.add('line-through');
    };
  })
}

let isVisible = false;
settings.onclick = () => {
  setSettingsLang(userLang);
  if (!isVisible) {
    settPopup.classList.remove('nodisplay');
    settPopup.classList.remove('transparent');
    settPopup.classList.add('visible');
    isVisible = true;
  } else {
    settPopup.classList.remove('visible');
    settPopup.classList.add('transparent');
    settPopup.classList.add('nodisplay');
    isVisible = false;
  }
}

document.querySelector('.main').onclick = () => {
  settPopup.classList.remove('visible');
  settPopup.classList.add('transparent');
  settPopup.classList.add('nodisplay');
} 
document.querySelector('.header').onclick = () => {
  settPopup.classList.remove('visible');
  settPopup.classList.add('transparent');
  settPopup.classList.add('nodisplay');
}
document.querySelector('.footer').onclick = () => {
  settPopup.classList.remove('visible');
  settPopup.classList.add('transparent');
  settPopup.classList.add('nodisplay');
}



let blockVisible = true;
settListItem.forEach((el) => {
  el.onclick = () => {
    let blockToHide = document.getElementById(el.id);


    if (blockVisible) {

      blockToHide.classList.remove('visible');
      blockToHide.classList.add('transparent')
      el.classList.add('line-through');
      LS.setItem(`${el.id}`, 'hidden');
      blockVisible = false;

    } else {

      blockToHide.classList.remove('transparent');
      blockToHide.classList.add('visible')
      el.classList.remove('line-through');
      LS.removeItem(`${el.id}`, 'hidden');
      blockVisible = true;
    }  
  }

})



const setSettingsLang = (lang) => {

  if (lang === 'ru') {
    document.querySelector('#settHead').textContent = 'Клик - скрыть';
    document.querySelector('#playerText').textContent = 'Плеер';
    document.querySelector('#weatherText').textContent = 'Погода';
    document.querySelector('#clockText').textContent = 'Часы';
    document.querySelector('#dateText').textContent = 'Дата';
    document.querySelector('#greetingText').textContent = 'Приветствие';
    document.querySelector('#photo-heading').textContent = 'Источник обоев';
  }
}


photoRadio.onchange = (e) => {
  photoSource = e.target.id;
  
  if (e.target.id === 'api-radio') {
    apiTags.disabled = false;
  } else {
    apiTags.disabled = true;
  }
  setBg(randomNum);  
}




// Time every second
setInterval(() => {
  timeEl.textContent = getTimeOfDay();
}, 1000);

// Setting proper time-of-day greeting every minute
setInterval(() => {
  greetEl.textContent = setGreeting();
}, 60000);

// Setiing date(), greeting, loading username 
window.addEventListener('load', () => {
    nameEl.value = `${LS.getItem('name')}!`
    greetEl.textContent = setGreeting();
    dateEl.textContent = getDate();
    timeEl.textContent = getTimeOfDay();
    if (!LS.getItem('city')) {
      cityEl.value = 'Минск';
      getWeather('Минск');
    } else {
      cityEl.value = LS.getItem('city');
      getWeather(cityEl.value);
    }
    
    setBg(randomNum);
    getQuote(userLang);

    loadOnlyVisibleStuff();

  }); 
  

// Saving username
nameEl.addEventListener('input', () => {
  LS.setItem('name', nameEl.value);
})

cityEl.addEventListener('change', () => {
  getWeather(cityEl.value);
  LS.setItem('city', cityEl.value)
})



changeQuote.addEventListener('click', () => {
  getQuote(userLang);
})

//ToDo widget 

if (LS.getItem('maingoal')) {
  mainGoalInput.value = LS.getItem('maingoal');

  let val = mainGoalInput.value;
  mainGoalInput.classList.add('nodisplay');
  secretHeading.classList.remove('nodisplay');
  secretHeading.textContent = val;

  if (userLang === 'ru') {
    mainGoalHeader.textContent = 'СЕГОДНЯ';
  } else if (userLang === 'en') {
    mainGoalHeader.textContent = 'TODAY';
  }
}

const setMainGoal = () => {
  if (userLang === 'ru') {
    mainGoalHeader.textContent = 'Твоя главная цель на сегодня';
  } else if (userLang === 'en') {
    mainGoalHeader.textContent = 'Your main goal for today';
  }
}

setMainGoal();



mainGoalInput.onchange = () => {
  LS.setItem('maingoal', mainGoalInput.value);
  
  if (userLang === 'ru') {
    mainGoalHeader.textContent = 'СЕГОДНЯ';
  } else if (userLang === 'en') {
    mainGoalHeader.textContent = 'TODAY';
  }

  let val = mainGoalInput.value;
  mainGoalInput.classList.add('nodisplay');
  secretHeading.classList.remove('nodisplay');
  secretHeading.textContent = val;
  
}


mainGoalReset.onclick = () => {
  if (userLang === 'ru') {
    mainGoalHeader.textContent = 'Твоя главная цель на сегодня';
    LS.removeItem('maingoal');
    mainGoalInput.classList.remove('nodisplay');
    secretHeading.classList.add('nodisplay');
  } else if (userLang === 'en') {
    mainGoalHeader.textContent = 'Your main goal for today';
    LS.removeItem('maingoal');
    mainGoalInput.classList.remove('nodisplay');
    secretHeading.classList.add('nodisplay');
  }
  mainGoalInput.value = '';
}


const github = document.querySelector('.github');
const codewars = document.querySelector('.codewars');
const rs = document.querySelector('.rs');

github.onclick = () => {
  window.open('https://github.com/undermouse/momentum', '_blank').focus();
}
codewars.onclick = () => {
  window.open('https://www.codewars.com/users/undermouse', '_blank').focus();
}
rs.onclick = () => {
  window.open('https://rs.school/js/', '_blank').focus();
}


