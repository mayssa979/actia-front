import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Statistics.css';

const Statistics = () => {
  const [co2Data, setCo2Data] = useState([]);
  const [tvocHchoDataThisWeek, setTvocHchoDataThisWeek] = useState([]);
  const [temperatureDataThisWeek, setTemperatureDataThisWeek] = useState([]);
  const [humidityDataThisWeek, setHumidityDataThisWeek] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CO2, TVOC, and HCHO data
        const response1 = await axios.get("http://localhost:8080/frame1");
        console.log('Raw CO2, TVOC, HCHO data:', response1.data);
        const processedData1 = processData(response1.data);
        console.log('Processed CO2, TVOC, HCHO data:', processedData1);
        setCo2Data(processedData1.co2Data);
        setTvocHchoDataThisWeek(processedData1.tvocHchoDataThisWeek);

        // Fetch temperature and humidity data
        const response2 = await axios.get("http://localhost:8080/frame2");
        console.log('Raw temperature and humidity data:', response2.data);
        const processedData2 = processTemperatureAndHumidityData(response2.data);
        console.log('Processed temperature and humidity data:', processedData2);
        setTemperatureDataThisWeek(processedData2.temperatureDataThisWeek);
        setHumidityDataThisWeek(processedData2.humidityDataThisWeek);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const processData = (rawData) => {
    if (!Array.isArray(rawData)) {
      console.error('Invalid data format:', rawData);
      return { co2Data: [], tvocHchoDataThisWeek: [] };
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const co2Data = [];
    const tvocHchoDataThisWeek = [];

    // Get the current date
    const now = new Date();
    // Get the first day of the current week (Sunday)
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Initialize data arrays with placeholders for all days of the week
    daysOfWeek.forEach(day => {
      co2Data.push({ day, co2: 0 });
      tvocHchoDataThisWeek.push({ day, tvoc: 0, hcho: 0 });
    });

    // Count entries per day for averaging
    const countPerDay = {};
    daysOfWeek.forEach(day => {
      countPerDay[day] = 0;
    });

    // Fill data arrays with actual data for the current week
    rawData.forEach(entry => {
      const date = new Date(entry.date);
      const day = daysOfWeek[date.getDay()];

      // CO2 Data (current week only)
      if (date >= firstDayOfWeek) {
        co2Data[daysOfWeek.indexOf(day)].co2 += entry.co2;
        countPerDay[day]++;
      }

      // TVOC & HCHO Data (current week only)
      if (date >= firstDayOfWeek) {
        tvocHchoDataThisWeek[daysOfWeek.indexOf(day)].tvoc += entry.tvoc;
        tvocHchoDataThisWeek[daysOfWeek.indexOf(day)].hcho += entry.hcho;
      }
    });

    // Calculate averages
    daysOfWeek.forEach(day => {
      if (countPerDay[day] > 0) {
        co2Data[daysOfWeek.indexOf(day)].co2 /= countPerDay[day];
        tvocHchoDataThisWeek[daysOfWeek.indexOf(day)].tvoc /= countPerDay[day];
        tvocHchoDataThisWeek[daysOfWeek.indexOf(day)].hcho /= countPerDay[day];
      }
    });

    return { co2Data, tvocHchoDataThisWeek };
  };

  const processTemperatureAndHumidityData = (rawData) => {
    if (!Array.isArray(rawData)) {
      console.error('Invalid temperature and humidity data format:', rawData);
      return { temperatureDataThisWeek: [], humidityDataThisWeek: [] };
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const temperatureDataThisWeek = [];
    const humidityDataThisWeek = [];

    // Get the current date
    const now = new Date();
    // Get the first day of the current week (Sunday)
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Count entries per day for averaging
    const countPerDay = {};
    daysOfWeek.forEach(day => {
      countPerDay[day] = 0;
    });

    // Initialize temperature and humidity data arrays with placeholders for all days of the week
    daysOfWeek.forEach(day => {
      temperatureDataThisWeek.push({ day, temperature: 0 });
      humidityDataThisWeek.push({ day, humidity: 0 });
    });

    // Fill temperature and humidity data arrays with actual data for the current week
    rawData.forEach(entry => {
      const date = new Date(entry.date);
      const day = daysOfWeek[date.getDay()];

      if (date >= firstDayOfWeek) {
        temperatureDataThisWeek[daysOfWeek.indexOf(day)].temperature += entry.temp;
        humidityDataThisWeek[daysOfWeek.indexOf(day)].humidity += entry.humidity;
        countPerDay[day]++;
      }
    });

    // Calculate averages
    daysOfWeek.forEach(day => {
      if (countPerDay[day] > 0) {
        temperatureDataThisWeek[daysOfWeek.indexOf(day)].temperature /= countPerDay[day];
        humidityDataThisWeek[daysOfWeek.indexOf(day)].humidity /= countPerDay[day];
      }
    });

    return { temperatureDataThisWeek, humidityDataThisWeek };
  };

  return (
    <div className="statistics-container">
      <div className="chart1">
        <h2>CO2 Levels This Week (PPM)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={co2Data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="co2" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart2">
        <h2>TVOC & HCHO Levels This Week (mg/m³)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={tvocHchoDataThisWeek}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tvoc" stroke="#019e3d" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="hcho" stroke="#fe6c00" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart3">
        <h2>Temperature This Week (°C)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={temperatureDataThisWeek}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#3333FF" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart4">
        <h2>Humidity This Week (%)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={humidityDataThisWeek}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="humidity" stroke="#E91E63" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;
