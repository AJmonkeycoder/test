import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import SummaryTable from './SummaryTable';

function BarChart() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(24); // Default duration is 24 hours
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetchData();
  }, [duration]); // Refetch data when duration changes

  const fetchData = async () => {
    try {
        const lastRecord  = await axios.get('http://localhost:5000/api/lastdata');
        
      //  start and end timestamps based on the selected duration
      var endtimestamp=0;
      for (const item of lastRecord.data) {
        endtimestamp = moment(item.ts);
        
      }
      
      const endTime = endtimestamp; 
      const startTime = endtimestamp.subtract(duration, 'hours'); // Start time is end time minus duration
      
    //   console.log('Start Time:', startTime.format('YYYY-MM-DD HH:mm:ss'));
    //   console.log('End Time:', endTime.format('YYYY-MM-DD HH:mm:ss'));

      const response = await axios.get('http://localhost:5000/api/data');
    
      console.log('API Response:', response);

      // Process data to generate dataset for the bar chart
      const labels = [];
      const machineStatusData = [];
      const backgroundColors = [];

      // Counters for summary
      let onesCount = 0;
      let zerosCount = 0;
      let continuousZerosCount = 0;
      let continuousOnesCount = 0;
      let previousStatus = null;

     
      let previousTimestamp = null;
      for (const item of response.data) {
        const timestamp = moment(item.ts);
        if(timestamp.isAfter(startTime)){
        labels.push(timestamp.format('HH:mm:ss')); // Extract only the time part

        // Check for missing data
        if (previousTimestamp && timestamp.diff(previousTimestamp, 'seconds') > 1) {
          machineStatusData.push(1); // Missing data
          backgroundColors.push('red'); // Red color for missing data
        } else {
          
          // Assign colors based on machine status
          if(item.machine_status === 1 ){
            machineStatusData.push(item.machine_status);
            backgroundColors.push('green');
          }
          else{
            machineStatusData.push(1);
            backgroundColors.push('yellow');
          }
        
        }
    }

       // Update summary counters
       if (item.machine_status === 1) {
        onesCount++;
        continuousOnesCount++;
        continuousZerosCount = 0; // Reset continuous zeros count
      } else {
        zerosCount++;
        continuousZerosCount++;
        continuousOnesCount = 0; // Reset continuous ones count
      }

      // Update continuous variations count
      if (previousStatus !== null && item.machine_status !== previousStatus) {
        if (item.machine_status === 1) {
          continuousOnesCount = 1; // Start a new sequence of continuous ones
        } else {
          continuousZerosCount = 1; // Start a new sequence of continuous zeros
        }
      }

      previousStatus = item.machine_status;
      previousTimestamp = timestamp;
    }

    // Update summary state
    setSummary({
      onesCount,
      zerosCount,
      continuousOnesCount,
      continuousZerosCount
    });

      setData({
        labels: labels,
        datasets: [{
          label: 'Machine Status',
          data: machineStatusData,
          backgroundColor: backgroundColors
        }]
      });
      setLoading(false); // Set loading to false after data is fetched and processed
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const options = {
    scales: {
     
      y: {
        display: false, // Hide the vertical axis
        beginAtZero: true
      }
    }
  };
 

  const handleDurationChange = (hours) => {
    setDuration(hours);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Machine Status Bar Chart</h2>
      <div>
        <button onClick={() => handleDurationChange(1)}>1 Hour</button>
        <button onClick={() => handleDurationChange(8)}>8 Hours</button>
        <button onClick={() => handleDurationChange(24)}>24 Hours</button>
      </div>
      <div className="chart">
        <Bar data={data} options={options} />
      </div>
      <SummaryTable {...summary} /> 
    </div>
  );
}

export default BarChart;
