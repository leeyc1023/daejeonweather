function updateTemperature() {
    fetchWeatherData()
    .then((data) => {
        const tempValue = data.main.temp;
        document.getElementById("temperature").textContent = "온도 : " + tempValue + " °C";
    })
    .catch((error) => console.log("Error (temperature):", error));
}

function updateWind() {
    fetchWeatherData()
    .then((data) => {
        const windSpeed = data.wind.speed;
        document.getElementById("wind").textContent = "풍속 : " + windSpeed + " m/s";
    })
    .catch((error) => console.log("Error (wind):", error));
}

function updateWeatherDescription() {
    fetchWeatherData()
    .then((data) => {
        const desc = data.weather[0].description;
        const translated = translateWeatherDescription(desc);
        document.getElementById("description").textContent = "날씨 : " + translated;

        // 배경 변경
        setWeatherBackground(desc);

        // ✅ 구름·비 연출 추가
        updateWeatherEffects(data.weather[0], data.clouds.all);
    })
    .catch((error) => console.log("Error (description):", error));
}


function translateWeatherDescription(desc) {
    const map = {
        "clear sky": "맑음",
        "few clouds": "구름 조금",
        "scattered clouds": "흩어진 구름",
        "broken clouds": "부분 흐림",
        "overcast clouds": "흐림",
        "light rain": "약한 비",
        "moderate rain": "보통 비",
        "heavy intensity rain": "강한 비",
        "shower rain": "소나기",
        "rain": "비",
        "thunderstorm": "천둥번개",
        "snow": "눈",
        "mist": "안개"
    };
    return map[desc.toLowerCase()] || desc;
    
}

function fetchWeatherData() {
    return fetch('https://api.openweathermap.org/data/2.5/weather?q=daejeon&appid=e41cf0c17e49cd33c9b09da20ff7acb7&units=metric')
        .then((response) => response.json());
}

function updateClock() {
    const Target = document.getElementById("clock");
    const time = new Date();

    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const day = time.getDay();
    const week = ['일', '월', '화', '수', '목', '금', '토'];

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    Target.innerText =
        `${year}년 ${month}월 ${date}일 ${week[day]}요일 ` +
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function setWeatherBackground(desc) {
    const body = document.body;

    // 먼저 기존 날씨 클래스 제거
    body.classList.remove("sunny", "cloudy", "rainy", "snowy", "thunder");

    const lower = desc.toLowerCase();

    if (
        lower.includes("cloud") || 
        lower.includes("overcast") || 
        lower.includes("scattered")
    ) {
        body.classList.add("cloudy");
    } else if (lower.includes("clear")) {
        body.classList.add("sunny");
    } else if (lower.includes("rain")) {
        body.classList.add("rainy");
    } else if (lower.includes("snow")) {
        body.classList.add("snowy");
    } else if (lower.includes("thunder")) {
        body.classList.add("thunder");
    }
}


function toggleMenu(btn) {
  const menu = document.getElementById("slide-menu");
  btn.classList.toggle("active");
  menu.classList.toggle("open");
}

function copyEmail() {
  const email = "maenkatvkeo@gmail.com";

  // 클립보드에 복사
  navigator.clipboard.writeText(email).then(() => {
    alert("이메일 주소가 복사되었습니다!");
  }).catch((err) => {
    console.error("복사 실패:", err);
  });
}
function toggleMenu(btn) {
  const menu = document.getElementById("slide-menu");
  const label = document.querySelector(".menu-label");

  btn.classList.toggle("active");
  menu.classList.toggle("open");

  // 텍스트 표시 전환
  if (label) label.classList.toggle("visible");
}
function toggleFAQ() {
  const answer = document.getElementById("faq-answer");
  if (answer) {
    answer.classList.toggle("open");
    answer.style.display = answer.classList.contains("open") ? "block" : "none";
  }
}
function toggleFAQ2() {
  const answer = document.getElementById("faq-answer1");
  if (answer) {
    answer.classList.toggle("open");
    answer.style.display = answer.classList.contains("open") ? "block" : "none";
  }
}
function showMoonAtNight() {
  const hour = new Date().getHours();
  const moon = document.getElementById("moon");
  const sun = document.getElementById("sun");

  const isNight = (hour >= 19 || hour <= 6);

  if (moon) moon.style.display = isNight ? "block" : "none";
  if (sun) sun.style.display = isNight ? "none" : "block";
}
function updateSkyBySunTimes(sunrise, sunset) {
  const now = Math.floor(Date.now() / 1000); // 현재 UNIX 시간 (초)
  const isNight = now < sunrise || now > sunset;

  const moon = document.getElementById("moon");
  const sun = document.getElementById("sun");
  const stars = document.getElementById("stars");
  const body = document.body;

  if (isNight) {
    generateRandomStars(100); // 밤일 때만 별 생성
    document.body.classList.add("night");
  } else {
    document.getElementById("star-container").innerHTML = ""; // 낮엔 제거
    document.body.classList.remove("night");
    }

}

function fetchSunTimesAndUpdateSky() {
  fetch('https://api.openweathermap.org/data/2.5/weather?q=daejeon&appid=e41cf0c17e49cd33c9b09da20ff7acb7')
    .then(res => res.json())
    .then(data => {
      const sunrise = data.sys.sunrise; // UNIX 시간
      const sunset = data.sys.sunset;
      updateSkyBySunTimes(sunrise, sunset);
    })
    .catch(err => console.error("일출/일몰 가져오기 실패:", err));
}

function generateRandomStars(count = 100) {
  const container = document.getElementById("star-container");
  if (!container) return;

  // 기존 별 삭제
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.opacity = 0.3 + Math.random() * 0.5;
    star.style.width = star.style.height = `${0.7 + Math.random() * 1.3}px`;
    container.appendChild(star);
  }
}
function toggleMusic() {
  const music = document.getElementById("mainMusic");
  const button = document.getElementById("musicBtn");

  if (!music || !button) return;

  if (music.paused) {
    music.play()
      .then(() => {
        button.textContent = "🎵 음악 중지";
      })
      .catch(err => {
        console.warn("재생 오류:", err);
        alert("브라우저가 음악 재생을 차단했거나 오류가 발생했습니다.");
      });
  } else {
    music.pause();
    button.textContent = "🎵 음악 시작";
  }
}

function updateWeatherEffects(weather, clouds) {
  const rainLayer = document.getElementById("rain-layer");
  const cloudElements = document.querySelectorAll(".cloud");

  // 구름 많음 (60% 이상)
  const isCloudy = clouds >= 60;

  // 비 (main: "Rain" 또는 description 포함)
  const isRaining = weather.main === "Rain" || weather.description.includes("rain");

  // 구름 레이어 표시
  cloudElements.forEach(cloud => {
    cloud.style.opacity = isCloudy ? 1 : 0.5;
  });

  // 비 표시
  if (isRaining) {
  createRainParticles();
  } else {
    const container = document.getElementById('rain-particles');
    if (container) {
      const drops = container.querySelectorAll('.raindrop');
      drops.forEach(drop => {
        drop.classList.add('fade-out');
        drop.addEventListener('animationend', () => drop.remove());
      });
    }
  }


}

function fetchForecast() {
  fetch('https://api.openweathermap.org/data/2.5/forecast?lat=36.35&lon=127.38&appid=de25b0ba6f000d131cc5acc9bea0077c&units=metric')
    .then(res => res.json())
    .then(data => {
      // ---- 1. 일별 최고/최저 기온 요약 ----
      const container = document.getElementById('forecast');
      container.innerHTML = '';

      const dailyTemps = {};

      data.list.forEach(item => {
        const utcDate = new Date(item.dt * 1000);
        const dateStr = utcDate.toISOString().split("T")[0];

        if (!dailyTemps[dateStr]) dailyTemps[dateStr] = [];

        dailyTemps[dateStr].push({
          min: item.main.temp_min,
          max: item.main.temp_max,
          icon: item.weather[0].icon,
          desc: item.weather[0].description,
          dt: item.dt
        });
      });

      const todayUTC = new Date().toISOString().split("T")[0];

      const summary = Object.entries(dailyTemps)
        .filter(([date, _]) => date !== todayUTC)
        .slice(0, 5)
        .map(([date, temps]) => {
          const minTemp = Math.min(...temps.map(t => t.min));
          const maxTemp = Math.max(...temps.map(t => t.max));
          const first = temps.sort((a, b) => a.dt - b.dt)[0];

          const dateObj = new Date(date);
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1;
          const day = dateObj.getDate();
          const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
          const formattedDate = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;

          return {
            date: formattedDate,
            minTemp,
            maxTemp,
            icon: first.icon,
            desc: first.desc
          };
        });


      summary.forEach(day => {
        container.innerHTML += `
          <div style="margin-bottom: 10px;">
            <strong>${day.date}</strong>: 최저온도 ${day.minTemp.toFixed(1)}°C ~ 최고온도 ${day.maxTemp.toFixed(1)}°C, ${translateWeatherDescription(day.desc)}
            <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.desc}">
          </div>
        `;
      });

      // ---- 2. 3시간 간격 예보 ----
      const hourlyContainer = document.getElementById("hourly-forecast");
      hourlyContainer.innerHTML = ""; // <h3>는 HTML에서 따로 넣기

      const upcomingHours = data.list
        .filter(item => new Date(item.dt * 1000) > new Date())
        .slice(0, 8);

      upcomingHours.forEach(item => {
        const time = new Date(item.dt * 1000);
        const hourLabel = `${time.getMonth() + 1}월 ${time.getDate()}일 ${time.getHours()}시`;
        const temp = item.main.temp.toFixed(1);
        const desc = translateWeatherDescription(item.weather[0].description);
        const icon = item.weather[0].icon;

        hourlyContainer.innerHTML += `
          <div class="hourly-box">
            <div><strong>${hourLabel}</strong></div>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
            <div>${temp}°C, ${desc}</div>
          </div>
        `;
      });
    })
    .catch(error => console.error('날씨 데이터 불러오기 오류:', error));
}


// 📅 일기예보 모달 열기/닫기 처리
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-weather");
  const modal = document.getElementById("weather-modal");
  const closeBtn = modal.querySelector(".close");

  if (openBtn && modal && closeBtn) {
    openBtn.addEventListener("click", () => {
      modal.style.display = "block";
      document.documentElement.classList.add("modal-open"); // <html> 태그
      openForecastModal();
    });


    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");  // ✅ 스크롤 다시 허용
      closeForecastModal();
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
        closeForecastModal(); // 여기서도 함수 사용
      }
    });

  }
});

function openForecastModal() {
  document.getElementById('weather-modal').style.display = 'block';
  document.body.style.overflow = 'hidden'; // ✅ 외부 스크롤 막기
}

function closeForecastModal() {
  document.getElementById('weather-modal').style.display = 'none';
  document.body.style.overflow = 'auto';   // ✅ 외부 스크롤 다시 허용
}


function createRainParticles() {
  const container = document.getElementById('rain-particles');
  if (!container) return;


  for (let i = 0; i < 120; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    
    drop.style.left = Math.random() * 100 + 'vw';

    // ❗ 비 입자가 상단에서 일제히 시작하지 않도록
    drop.style.top = (Math.random() * -1000) + 'px';

    // 속도·타이밍 랜덤 설정
    drop.style.animationDuration = 0.5 + Math.random() * 1.5 + 's';
    drop.style.animationDelay = Math.random() * 1 + 's';

    container.appendChild(drop);
  }
}





// 최초 실행
fetchForecast();

// 10분마다 갱신 (600,000ms)
setInterval(fetchForecast, 600000);



// 페이지 로드시 1회 실행
fetchSunTimesAndUpdateSky();

// 매 5분마다 재확인
setInterval(fetchSunTimesAndUpdateSky, 5 * 60 * 1000);


// 페이지 로드 시 1회 실행
showMoonAtNight();

// 시간 변화 반영 (선택 사항)
setInterval(showMoonAtNight, 60000); // 매 분마다 체크



// 초기 실행
updateTemperature();
updateWind();
updateWeatherDescription();
updateClock();

// 반복 실행
setInterval(updateTemperature, 1000);
setInterval(updateWind, 1000);
setInterval(updateWeatherDescription, 1000);
setInterval(updateClock, 1000);
