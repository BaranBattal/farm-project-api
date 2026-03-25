const axios = require("axios");

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

function getPast30DaysRange() {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 30);

    return {
        start_date: formatDate(start),
        end_date: formatDate(today),
    };
}

async function getPast30Days(lat, lon) {
    const { start_date, end_date } = getPast30DaysRange();

    const response = await axios.get(
        "https://archive-api.open-meteo.com/v1/archive",
        {
            params: {
                latitude: lat,
                longitude: lon,
                start_date,
                end_date,
                daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
                timezone: "auto",
            },
        },
    );

    return response.data;
}

async function getNextForecast(lat, lon) {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
            latitude: lat,
            longitude: lon,
            daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
            forecast_days: 16,
            timezone: "auto",
        },
    });

    return response.data;
}

async function getWeatherSummary(lat, lon) {
    const [past, future] = await Promise.all([
        getPast30Days(lat, lon),
        getNextForecast(lat, lon),
    ]);

    return { past, future };
}

/*getWeatherSummary(36.50833, 36.86917)
    .then((data) => console.log(JSON.stringify(data, null, 2)))
    .catch((err) => console.error(err.message));
*/
