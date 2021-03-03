const wheatherModule = (function() {
    class WheatherWidgetView {
        wheatherWidgetContainer = null;
        daysArr = [];
        sideBtn = document.querySelector("#side-button");
        dayAll = null;
        dayFirst = null;
        daySecond = null;
        dayThird = null;
        btnMore = null;
        btnHideMore = null;
        loader = null;

        init(field) {
            this.wheatherWidgetContainer = field;
            this.dayFirst = this.wheatherWidgetContainer.querySelector("#day-one");
            this.daySecond = this.wheatherWidgetContainer.querySelector("#day-two");
            this.dayThird = this.wheatherWidgetContainer.querySelector("#day-three");
            this.dayAll = this.wheatherWidgetContainer.querySelector("#more-days");
            this.btnMore = this.wheatherWidgetContainer.querySelector("#show-more");
            this.btnHideMore = this.wheatherWidgetContainer.querySelector("#hide-more");
            this.loader = this.wheatherWidgetContainer.querySelector("#loader");
        }

        getWeatherData(data) {
            const location = this.wheatherWidgetContainer.querySelector("#location");
            const temp = this.wheatherWidgetContainer.querySelector("#temp");
            const descrip = this.wheatherWidgetContainer.querySelector("#descr");
            const icon = this.wheatherWidgetContainer.querySelector("#temp-with-icon");
            const wind = this.wheatherWidgetContainer.querySelector("#wind");
            
            location.textContent = data.name;
            temp.textContent = `Температура ${data.main.temp}°C;`;
            descrip.textContent = `Ощущается как ${data.main.feels_like}°C;`;
            icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png"><p>, ${data.weather[0].description}</p>`;
            icon.lastChild.style.lineHeight = `50px`;
            wind.textContent = `Ветер: ${data.wind.speed}м/с;`;

            this.showWeather();
        }

        getWeatherDataMore(data) {
            this.daysArr.push(data[2]);
            
            if (this.daysArr.length == 3) {
                const dayFirstDate = this.dayFirst.querySelector("#date");
                const daySecondDate = this.daySecond.querySelector("#date");
                const dayThirdtDate = this.dayThird.querySelector("#date");

                dayFirstDate.textContent = this.daysArr[0].applicable_date;
                daySecondDate.textContent = this.daysArr[1].applicable_date;
                dayThirdtDate.textContent = this.daysArr[2].applicable_date;

                const dayFirstIcon = this.dayFirst.querySelector("#temp-with-icon");
                const daySecondIcon = this.daySecond.querySelector("#temp-with-icon");
                const dayThirdIcon = this.dayThird.querySelector("#temp-with-icon");

                dayFirstIcon.innerHTML = `<img src="https://www.metaweather.com/static/img/weather/${this.daysArr[0].weather_state_abbr}.svg" width="70">`;
                daySecondIcon.innerHTML = `<img src="https://www.metaweather.com/static/img/weather/${this.daysArr[1].weather_state_abbr}.svg" width="70">`;
                dayThirdIcon.innerHTML = `<img src="https://www.metaweather.com/static/img/weather/${this.daysArr[2].weather_state_abbr}.svg" width="70">`;

                const dayFirstTemp = this.dayFirst.querySelector("#temp");
                const daySecondTemp = this.daySecond.querySelector("#temp");
                const dayThirdTemp = this.dayThird.querySelector("#temp");

                dayFirstTemp.textContent = `Температура ${this.daysArr[0].the_temp}°C;`;
                daySecondTemp.textContent = `Температура ${this.daysArr[1].the_temp}°C;`;
                dayThirdTemp.textContent = `Температура ${this.daysArr[2].the_temp}°C;`;

                const dayFirstWind = this.dayFirst.querySelector("#wind");
                const daySecondWind = this.daySecond.querySelector("#wind");
                const dayThirdWind = this.dayThird.querySelector("#wind");

                dayFirstWind.textContent = `Ветер: ${Math.round(this.daysArr[0].wind_speed)}м/с;`;
                daySecondWind.textContent = `Ветер: ${Math.round(this.daysArr[1].wind_speed)}м/с;`;
                dayThirdWind.textContent = `Ветер: ${Math.round(this.daysArr[2].wind_speed)}м/с;`;

                this.loader.classList.add("loader__hide");
                this.dayAll.classList.remove("more-days__hide");
            }
        }

        showWeather() {
            this.wheatherWidgetContainer.classList.add("show-weather");
        }

        hideWeather() {
            this.wheatherWidgetContainer.classList.remove("show-weather");
        }

        showSideButton() {
            this.sideBtn.classList.add("show__side-button")
        }

        hideSideButton() {
            this.sideBtn.classList.remove("show__side-button")
        }

        toggleBtnMore() {
            this.btnMore.classList.add("hide-button");
            this.btnHideMore.classList.remove("hide-button");
        }

        toggleBtnHideMore() {
            this.btnMore.classList.remove("hide-button");
            this.btnHideMore.classList.add("hide-button");
            this.dayAll.classList.add("more-days__hide");
            this.daysArr = [];
        }
        
        loaderCreate() {
            this.loader.classList.remove("loader__hide");
        }
    }

    class WheatherWidgetModal {
        wheatherWidgetView = null;
        cityID = null;
        apiKey = "984acb2c34fc9539d85d6d6683156fc3";

        init(view, _cityID) {
            this.wheatherWidgetView = view;
            this.cityID = _cityID;
            this.getWeather();
        }

        async getWeather() {
            let apiUrl = "https://api.openweathermap.org/data/2.5";
            let apiRequest = apiUrl + "/weather?id=" + this.cityID + "&units=metric&lang=ru&appid=" + this.apiKey;

            try {
                const response = await fetch(apiRequest);
                const data = await response.json();
                this.wheatherWidgetView.getWeatherData(data);
            } catch(error) {
                console.error("Ошибка получение погоды. Причина: " + error)  
            }
        }

        async getMoreWeather() {
            let date = new Date();
            let apiRequest;

            for(let i = 0; i < 3; i++) {
                date.setDate(date.getDate() + 1);

                apiRequest = `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/834463/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/`;

                try {
                    const response = await fetch(apiRequest);
                    const data = await response.json();
                    this.wheatherWidgetView.getWeatherDataMore(data);
                } catch(error) {
                    console.error("Ошибка получение погоды. Причина: " + error)  
                }
            }
        }

        showWeather() {
            this.wheatherWidgetView.showWeather();
        }

        hideWeather() {
            this.wheatherWidgetView.hideWeather();
        }

        showSideButton() {
            this.wheatherWidgetView.showSideButton();
        }

        hideSideButton() {
            this.wheatherWidgetView.hideSideButton();
        }

        toggleBtnMore() {
            this.wheatherWidgetView.toggleBtnMore();
        }

        toggleBtnHideMore() {
            this.wheatherWidgetView.toggleBtnHideMore();
        }

        loader() {
            this.wheatherWidgetView.loaderCreate(); 
        }
    }

    class WheatherWidgetController {
        wheatherWidgetModal = null;
        wheatherWidgetContainer = null;
        sideBtn = document.querySelector("#side-button");

        init(modal, field) {    
            this.wheatherWidgetModal = modal;
            this.wheatherWidgetContainer = field;

            this.btnBinds();
        }

        btnBinds() {
            const btnMore = this.wheatherWidgetContainer.querySelector("#show-more");
            const btnHideMore = this.wheatherWidgetContainer.querySelector("#hide-more")
            const btnHide = this.wheatherWidgetContainer.querySelector("#widget-close");   
            
            btnHide.addEventListener("click", () => {
                this.wheatherWidgetModal.hideWeather();
                this.wheatherWidgetModal.showSideButton();
            });

            this.sideBtn.addEventListener("click", () => {
                this.wheatherWidgetModal.showWeather();
                this.wheatherWidgetModal.hideSideButton();
            });

            btnMore.addEventListener("click", () => {
                this.wheatherWidgetModal.getMoreWeather();
                this.wheatherWidgetModal.toggleBtnMore();
                this.wheatherWidgetModal.loader();
            });

            btnHideMore.addEventListener("click", () => {
                this.wheatherWidgetModal.toggleBtnHideMore();
            });
        }
    }

    const wheatherMinskContainer = document.querySelector("#weather-widget")
    
    return {
        init: function() {
            const wheatherMinskModal = new WheatherWidgetModal();
            const wheatherMinskView = new WheatherWidgetView();
            const wheatherMinskController = new WheatherWidgetController();

            wheatherMinskView.init(wheatherMinskContainer);
            wheatherMinskModal.init(wheatherMinskView, 625144);
            wheatherMinskController.init(wheatherMinskModal, wheatherMinskContainer);
        }
    }
})();