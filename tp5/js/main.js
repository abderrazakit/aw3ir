var app;
const API_KEY = "0ada432b59deb9716c357092c5f79be6"; // Remplacez par votre clé API OpenWeatherMap si besoin

window.onload = function () {
  app = new Vue({
    el: "#weatherApp",
    data: {
      // Indicateur de chargement de l'application
      loaded: false,

      // Variable liée au champ de saisie via v-model
      formCityName: "",

      message: "WebApp Loaded.",
      messageForm: "",
      weatherError: "",

      // Liste des villes saisies (initialisée avec Paris)
      cityList: [
        {
          name: "Paris",
        },
      ],

      // Données météo reçues depuis OpenWeatherMap
      cityWeather: null,

      // Indicateur de chargement de la requête météo
      cityWeatherLoading: false,
    },

    mounted: function () {
      this.loaded = true;
      this.readData();
    },

    methods: {
      readData: function () {
        console.log("JSON.stringify(this.cityList):", JSON.stringify(this.cityList));
        console.log("this.loaded:", this.loaded);
      },

      // Vérifie si la ville est déjà présente dans cityList
      isCityExist: function (_cityName) {
        return (
          this.cityList.filter(
            (item) => item.name.trim().toUpperCase() === _cityName.trim().toUpperCase()
          ).length > 0
        );
      },

      // Ajoute une ville à la liste
      addCity: function (event) {
        event.preventDefault();

        const cityName = this.formCityName.trim();
        if (!cityName) return;

        if (this.isCityExist(cityName)) {
          this.messageForm = "existe déjà";
        } else {
          const newCity = { name: cityName };
          this.cityList.push(newCity);
          this.messageForm = "";
          this.formCityName = "";

          // Charge directement la météo de la ville ajoutée
          this.meteo(newCity);
        }
      },

      // Supprime une ville de la liste
      remove: function (_city) {
        this.cityList = this.cityList.filter((item) => item.name !== _city.name);

        // Si la ville supprimée est celle affichée, on réinitialise la carte météo
        if (
          this.cityWeather &&
          this.cityWeather.name.toUpperCase() === _city.name.toUpperCase()
        ) {
          this.cityWeather = null;
        }
      },

      // Récupère la météo d'une ville via l'API OpenWeatherMap
      meteo: function (_city) {
        this.cityWeatherLoading = true;
        this.weatherError = "";

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          _city.name
        )}&units=metric&lang=fr&appid=${API_KEY}`;

        fetch(url)
          .then(function (response) {
            return response.json();
          })
          .then(function (json) {
            app.cityWeatherLoading = false;

            if (json.cod == 200) {
              app.cityWeather = json;
              app.message = null;
              app.weatherError = "";
            } else {
              app.cityWeather = null;
              app.weatherError =
                "Météo introuvable pour " + _city.name + " (" + json.message + ")";
            }
          })
          .catch(function (error) {
            app.cityWeatherLoading = false;
            app.cityWeather = null;
            app.weatherError = "Erreur réseau lors de la récupération de la météo.";
            console.error(error);
          });
      },

      // BONUS : Récupère la météo via la géolocalisation GPS HTML5
      getMyPosition: function () {
        if (!navigator.geolocation) {
          this.weatherError = "La géolocalisation n'est pas supportée par votre navigateur.";
          return;
        }

        this.cityWeatherLoading = true;
        this.weatherError = "";

        navigator.geolocation.getCurrentPosition(
          function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`;

            fetch(url)
              .then((response) => response.json())
              .then((json) => {
                app.cityWeatherLoading = false;

                if (json.cod == 200) {
                  app.cityWeather = json;
                  app.message = null;

                  // Ajoute la ville détectée à la liste si elle n'y est pas déjà
                  if (json.name && !app.isCityExist(json.name)) {
                    app.cityList.push({ name: json.name });
                  }
                } else {
                  app.weatherError = "Impossible de récupérer la météo pour votre position.";
                }
              })
              .catch(() => {
                app.cityWeatherLoading = false;
                app.weatherError = "Erreur réseau lors de la géolocalisation météo.";
              });
          },
          function (error) {
            app.cityWeatherLoading = false;
            switch (error.code) {
              case error.PERMISSION_DENIED:
                app.weatherError = "Accès à la position GPS refusé par l'utilisateur.";
                break;
              case error.POSITION_UNAVAILABLE:
                app.weatherError = "Position GPS indisponible.";
                break;
              case error.TIMEOUT:
                app.weatherError = "Délai d'attente GPS dépassé.";
                break;
              default:
                app.weatherError = "Erreur inconnue lors de la géolocalisation.";
                break;
            }
          }
        );
      },
    },

    computed: {
      cityWheaterDate: function () {
        if (this.cityWeather !== null) {
          var date = new Date(this.cityWeather.dt * 1000);
          var minutes =
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          return date.getHours() + ":" + minutes;
        }
        return "";
      },

      cityWheaterSunrise: function () {
        if (this.cityWeather !== null) {
          var date = new Date(this.cityWeather.sys.sunrise * 1000);
          var minutes =
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          return date.getHours() + ":" + minutes;
        }
        return "";
      },

      cityWheaterSunset: function () {
        if (this.cityWeather !== null) {
          var date = new Date(this.cityWeather.sys.sunset * 1000);
          var minutes =
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          return date.getHours() + ":" + minutes;
        }
        return "";
      },

      // Calcul de la zone d'affichage de la carte OpenStreetMap
      openStreetMapArea: function () {
        if (this.cityWeather !== null) {
          const zoom = 8;
          const delta = 0.05 / Math.pow(2, zoom - 10);

          const bboxEdges = {
            south: this.cityWeather.coord.lat - delta,
            north: this.cityWeather.coord.lat + delta,
            west: this.cityWeather.coord.lon - delta,
            east: this.cityWeather.coord.lon + delta,
          };

          return `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
        }
        return "";
      },
    },
  });
};