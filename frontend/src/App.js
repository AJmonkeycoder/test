import logo from './logo.svg';
import './App.css';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';

import BarChart from './component/colouredlinechart';
import WeatherComponent from './component/weather';

Chart.register(...registerables);

function App() {
  return (
     <>
    <div>
     <BarChart/>
     <WeatherComponent latitude={18.5204} longitude={73.8567} />
    </div>
    </>
  );
}

export default App;
