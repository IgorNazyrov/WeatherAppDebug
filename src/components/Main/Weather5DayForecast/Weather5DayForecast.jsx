import { useState, useEffect, useContext, useCallback } from "react";
import WeatherIcon from "../../WeatherIcon/WeatherIcon";
import styles from "./Weather5DayForecast.module.css";
import { TemperatureContext } from "../../TemperatureContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import "swiper/css";

export default function Weather5DayForecast({ data }) {
  const { getTemperature } = useContext(TemperatureContext);

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long" };
    return date.toLocaleDateString("ru-RU", options);
  };

  const [forecastData, setForecastData] = useState([]);

  const processForecastData = useCallback(() => {
    const dailyData = [];
    const today = new Date();

    for (let i = 1; i <= 5; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(nextDay.getDate() + i);
      const nextDayString = nextDay.toISOString().slice(0, 10);

      if (!data || !data.list) {
        console.error("data не передались");
        return [];
      }

      const dailyForecasts = data.list.filter((item) => {
        const itemDate = new Date(item.dt_txt);
        const itemDateString = itemDate.toISOString().slice(0, 10);

        if (!item || !item.dt_txt) {
          console.error("Item или dt_txt не передались:", item);
        }

        return itemDateString === nextDayString;
      });

      if (dailyForecasts.length > 0) {
        const weather = dailyForecasts[0].weather[0].main;
        let minTemp = dailyForecasts[0].main.temp;
        let maxTemp = dailyForecasts[0].main.temp;
        dailyForecasts.forEach((forecast) => {
          const temp = forecast.main.temp;

          if (temp < minTemp) {
            minTemp = temp;
          }

          if (temp > maxTemp) {
            maxTemp = temp;
          }
        });
        dailyData.push({
          date: nextDayString,
          minTemp: minTemp,
          maxTemp: maxTemp,
          weather: weather,
        });
      } else {
        dailyData.push(null);
      }
    }
    // console.log(dailyData);
    return dailyData;
  }, [data]);

  useEffect(() => {
    const data = processForecastData();
    setForecastData(data);
  }, [data, processForecastData]);

  return (
    <>
      {forecastData ? (
        <div className={styles.container5Day}>
          <h2 className={styles.h2Title}>Пятидневный прогноз</h2>
          <Swiper
            className={styles.list5DayForecasts}
            spaceBetween={10}
            slidesPerView={"auto"}
            freeMode={true}
            loop={false}
            modules={[A11y]}
            speed={1000}
            wrapperClass={styles.mySwiperClass}
          >
            {forecastData.map((forecast, index) => (
              <SwiperSlide className={styles.swiperSlide} key={index}>
                <div className={styles.forecastContent}>
                  <div className={styles.date5Day}>
                    {getDayOfWeek(forecast.date)}
                  </div>
                  <div className={styles.weatherIcon5Day}>
                    <WeatherIcon width={"55px"} weather={forecast.weather} />
                  </div>
                  <div className={styles.temperature5Day}>
                    <div className={styles.maxTemp}>
                      {getTemperature(Math.round(forecast.maxTemp - 273))}  
                    </div>
                    <div>
                      {getTemperature(Math.round(forecast.minTemp - 273))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
