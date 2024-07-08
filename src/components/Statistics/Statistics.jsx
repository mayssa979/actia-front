import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Statistics.css';

const Statistics = () => {
  const [selectedView, setSelectedView] = useState('weekly');
  const [data, setData] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState({ co2: true, hcho: false, tvoc: false, temp: false, humidity: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get("http://localhost:8080/frame1");
        const response2 = await axios.get("http://localhost:8080/frame2");
        handleViewChange(selectedView, response1.data, response2.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedView]);

  const handleViewChange = (view, rawData1, rawData2) => {
    setSelectedView(view);
    let processedData = [];

    switch (view) {
      case 'daily':
        processedData = processDailyData(rawData1, rawData2);
        break;
      case 'yearly':
        processedData = processMonthlyData(rawData1, rawData2);
        break;
      case 'monthly':
        processedData = processMonthlyPerDayData(rawData1, rawData2);
        break;
      case 'weekly':
      default:
        processedData = processWeeklyData(rawData1, rawData2);
        break;
    }

    setData(processedData);
  };

  const processWeeklyData = (rawData1, rawData2) => {
    if (!rawData1 || !rawData2) {
      return [];
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const data = [];
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const countPerDay = {};

    daysOfWeek.forEach(day => {
      const entry = { day, co2: 0, hcho: 0, tvoc: 0, temp: 0, humidity: 0 };
      data.push(entry);
      countPerDay[day] = 0;
    });

    rawData1.forEach(entry1 => {
      const date1 = new Date(entry1.date);
      const day = daysOfWeek[date1.getDay()];

      if (date1 >= firstDayOfWeek) {
        data[daysOfWeek.indexOf(day)].co2 += entry1.co2 || 0;
        data[daysOfWeek.indexOf(day)].hcho += entry1.hcho || 0;
        data[daysOfWeek.indexOf(day)].tvoc += entry1.tvoc || 0;
        countPerDay[day]++;
      }
    });

    rawData2.forEach(entry2 => {
      const date2 = new Date(entry2.date);
      const day = daysOfWeek[date2.getDay()];

      if (date2 >= firstDayOfWeek) {
        data[daysOfWeek.indexOf(day)].temp += entry2.temp || 0;
        data[daysOfWeek.indexOf(day)].humidity += entry2.humidity || 0;
      }
    });

    daysOfWeek.forEach(day => {
      if (countPerDay[day] > 0) {
        data[daysOfWeek.indexOf(day)].co2 /= countPerDay[day];
        data[daysOfWeek.indexOf(day)].hcho /= countPerDay[day];
        data[daysOfWeek.indexOf(day)].tvoc /= countPerDay[day];
        data[daysOfWeek.indexOf(day)].temp /= countPerDay[day];
        data[daysOfWeek.indexOf(day)].humidity /= countPerDay[day];
      }
    });

    return data;
  };

  const processDailyData = (rawData1, rawData2) => {
    if (!rawData1 || !rawData2) {
      return [];
    }

    const data = [];
    const now = new Date();
    const today = now.toDateString();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    hours.forEach(hour => {
      const time = `${hour}:00`;
      const entry = { time, co2: 0, hcho: 0, tvoc: 0, temp: 0, humidity: 0 };
      data.push(entry);
    });

    rawData1.forEach(entry1 => {
      const date1 = new Date(entry1.date);
      if (date1.toDateString() === today) {
        const hour = date1.getHours();
        data[hour].co2 += entry1.co2 || 0;
        data[hour].hcho += entry1.hcho || 0;
        data[hour].tvoc += entry1.tvoc || 0;
      }
    });

    rawData2.forEach(entry2 => {
      const date2 = new Date(entry2.date);
      if (date2.toDateString() === today) {
        const hour = date2.getHours();
        data[hour].temp += entry2.temp || 0;
        data[hour].humidity += entry2.humidity || 0;
      }
    });

    return data;
  };

  const processMonthlyData = (rawData1, rawData2) => {
    if (!rawData1 || !rawData2) {
      return [];
    }

    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en-US', { month: 'long' }));
    const data = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const countPerMonth = {};

    months.forEach(month => {
      const entry = { month, co2: 0, hcho: 0, tvoc: 0, temp: 0, humidity: 0 };
      data.push(entry);
      countPerMonth[month] = 0;
    });

    rawData1.forEach(entry1 => {
      const date1 = new Date(entry1.date);
      const month = months[date1.getMonth()];

      if (date1.getFullYear() === currentYear) {
        data[months.indexOf(month)].co2 += entry1.co2 || 0;
        data[months.indexOf(month)].hcho += entry1.hcho || 0;
        data[months.indexOf(month)].tvoc += entry1.tvoc || 0;
        countPerMonth[month]++;
      }
    });

    rawData2.forEach(entry2 => {
      const date2 = new Date(entry2.date);
      const month = months[date2.getMonth()];

      if (date2.getFullYear() === currentYear) {
        data[months.indexOf(month)].temp += entry2.temp || 0;
        data[months.indexOf(month)].humidity += entry2.humidity || 0;
      }
    });

    months.forEach(month => {
      if (countPerMonth[month] > 0) {
        data[months.indexOf(month)].co2 /= countPerMonth[month];
        data[months.indexOf(month)].hcho /= countPerMonth[month];
        data[months.indexOf(month)].tvoc /= countPerMonth[month];
        data[months.indexOf(month)].temp /= countPerMonth[month];
        data[months.indexOf(month)].humidity /= countPerMonth[month];
      }
    });

    return data;
  };

  const processMonthlyPerDayData = (rawData1, rawData2) => {
    if (!rawData1 || !rawData2) {
      return [];
    }

    const data = [];
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      data.push({ day: i.toString(), co2: 0, hcho: 0, tvoc: 0, temp: 0, humidity: 0 });
    }

    const countPerDay = Array(daysInMonth).fill(0);

    rawData1.forEach(entry1 => {
      const date1 = new Date(entry1.date);
      if (date1.getMonth() === now.getMonth() && date1.getFullYear() === now.getFullYear()) {
        const day = date1.getDate();
        data[day - 1].co2 += entry1.co2 || 0;
        data[day - 1].hcho += entry1.hcho || 0;
        data[day - 1].tvoc += entry1.tvoc || 0;
        countPerDay[day - 1]++;
      }
    });

    rawData2.forEach(entry2 => {
      const date2 = new Date(entry2.date);
      if (date2.getMonth() === now.getMonth() && date2.getFullYear() === now.getFullYear()) {
        const day = date2.getDate();
        data[day - 1].temp += entry2.temp || 0;
        data[day - 1].humidity += entry2.humidity || 0;
      }
    });

    for (let i = 0; i < daysInMonth; i++) {
      if (countPerDay[i] > 0) {
        data[i].co2 /= countPerDay[i];
        data[i].hcho /= countPerDay[i];
        data[i].tvoc /= countPerDay[i];
        data[i].temp /= countPerDay[i];
        data[i].humidity /= countPerDay[i];
      }
    }

    return data;
  };

  const getXAxisKey = () => {
    switch (selectedView) {
      case 'daily':
        return 'time';
      case 'yearly':
        return 'month';
      case 'monthly':
        return 'day';
      case 'weekly':
      default:
        return 'day';
    }
  };

  const handleMetricChange = (metric) => {
    setSelectedMetrics(prevSelectedMetrics => ({
      ...prevSelectedMetrics,
      [metric]: !prevSelectedMetrics[metric]
    }));
  };

  return (
    <div className="statistics-container">
      <div className="chart">
        <h1 className='title-stat'>{selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Metrics Evolution</h1>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getXAxisKey()} />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedMetrics.co2 && <Line type="monotone" dataKey="co2" stroke="#8884d8" activeDot={{ r: 8 }} />}
            {selectedMetrics.hcho && <Line type="monotone" dataKey="hcho" stroke="#fe6c00" activeDot={{ r: 8 }} />}
            {selectedMetrics.tvoc && <Line type="monotone" dataKey="tvoc" stroke="#019e3d" activeDot={{ r: 8 }} />}
            {selectedMetrics.temp && <Line type="monotone" dataKey="temp" stroke="#1e1611" activeDot={{ r: 8 }} />}
            {selectedMetrics.humidity && <Line type="monotone" dataKey="humidity" stroke="#E91E63" activeDot={{ r: 8 }} />}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='side'>
      <div className="view-selector">
        <label htmlFor="view">View: </label>
        <select id="view" value={selectedView} onChange={(e) => handleViewChange(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="checkboxes">
        <div className='metric'>Select Metric(s) to Display: </div>
        <label>
          <input type="checkbox" checked={selectedMetrics.co2} onChange={() => handleMetricChange('co2')} />
          <div  className='co2'>CO2</div>
        </label>
        <label>
          <input type="checkbox" checked={selectedMetrics.hcho} onChange={() => handleMetricChange('hcho')} />
          <div  className='hcho'>HCHO</div>
        </label>
        <label>
          <input type="checkbox" checked={selectedMetrics.tvoc} onChange={() => handleMetricChange('tvoc')} />
          <div  className='tvoc'>TVOC</div>
        </label>
        <label>
          <input type="checkbox" checked={selectedMetrics.temp} onChange={() => handleMetricChange('temp')} />
          <div  className='temperature'>Temperature</div>
        </label>
        <label>
          <input type="checkbox" checked={selectedMetrics.humidity} onChange={() => handleMetricChange('humidity')} />
          <div  className='humidity'>Humidity</div>
        </label>
      </div>
      </div>
    </div>
  );
};

export default Statistics;
