import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [latestData, setLatestData] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/websocket-endpoint');

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
            try {
                const newData = JSON.parse(event.data);
                setLatestData(newData); 
            } catch (error) {
                console.error('Error parsing message data:', error);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>Real-Time Dashboard</h1>
            {latestData && (
                <ul>
                    <li>
                        CO2: {latestData.co2}, HCHO: {latestData.hcho}, TVOC: {latestData.tvoc}, Date: {new Date(latestData.date).toLocaleString()}
                    </li>
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
