import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarChart from './charts/BarChart'
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChar';
import LineChart2 from './charts/LineChart2';
import BarChart2 from './charts/BarChart2';
import 'bootstrap/dist/css/bootstrap.min.css';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please try again later.</p>;
    }

    return this.props.children;
  }
}

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Calculate the frequency of each unique intensity value
  const intensityFrequency = data.reduce((acc, item) => {
    const intensity = item.intensity;
    acc[intensity] = (acc[intensity] || 0) + 1;
    return acc;
  }, {});

  // Calculate the frequency of each unique relevance value
  const relevanceFrequency = data.reduce((acc, item) => {
    const relevance = item.relevance;
    acc[relevance] = (acc[relevance] || 0) + 1;
    return acc;
  }, {});

  // Calculate the frequency of each unique likelihood value
  const likelihoodFrequency = data.reduce((acc, item) => {
    const likelihood = item.likelihood;
    acc[likelihood] = (acc[likelihood] || 0) + 1;
    return acc;
  }, {});

  // Calculate the frequency of each unique sector value
  const sectorFrequency = data.reduce((acc, item) => {
    const sector = item.sector;
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {});

  // Extract frequency values and labels for the bar chart
  const frequencyValues = Object.values(intensityFrequency);
  const intensityLabels = Object.keys(intensityFrequency);

  const relevanceValues = Object.values(relevanceFrequency);
  const relevanceLabels = Object.keys(relevanceFrequency);

  // Extract frequency values and labels for the line chart
  const likelihoodValues = Object.values(likelihoodFrequency);
  const likelihoodLabels = Object.keys(likelihoodFrequency);

  // Extract frequency values and labels for the pie chart
  const FrequencyValues = Object.values(sectorFrequency);
  const sectorLabels = Object.keys(sectorFrequency);

  // Filter out items with empty start or end year
  const filteredData = data.filter(item => item.start_year !== "" && item.end_year !== "");

  // Calculate the frequency of each unique start year and end year
  const startYearFrequency = filteredData.reduce((acc, item) => {
    const startYear = parseInt(item.start_year, 10);
    acc[startYear] = (acc[startYear] || 0) + 1;
    return acc;
  }, {});

  const endYearFrequency = filteredData.reduce((acc, item) => {
    const endYear = parseInt(item.end_year, 10);
    acc[endYear] = (acc[endYear] || 0) + 1;
    return acc;
  }, {});

  // Extract values and labels for the line chart
  const startYearValues = Object.keys(startYearFrequency).map(year => parseInt(year, 10));
  const endYearValues = Object.keys(endYearFrequency).map(year => parseInt(year, 10));

  const startYearFrequencyValues = Object.values(startYearFrequency);
  const endYearFrequencyValues = Object.values(endYearFrequency);

  // Combine all unique years and sort them
  const allYears = Array.from(new Set([...startYearValues, ...endYearValues])).sort((a, b) => a - b);

  // Create an array of labels based on the unique years
  const chartLabels = allYears.map(year => year.toString());

  // Calculate the frequency of each unique country value
  const countryFrequency = data.reduce((acc, item) => {
    const country = item.country;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  // Extract frequency values and labels for the bar chart
  const countryFrequencyValues = Object.values(countryFrequency);
  const countryLabels = Object.keys(countryFrequency);


  return (
    <>
      <div className='container'>
      {/* First Row */}
      <div className='row my-2'>
        <div className='col-md-6'>
          <ErrorBoundary>
            <div className='chart-container bg-light p-3 mb-3 rounded border'>
              <LineChart data={FrequencyValues} labels={sectorLabels} label="Sector Frequency | Labels: Sector Names, Values: Frequency" />
              <div className='text-center my-4'>
                <h4 className='font-weight-bold'>Sectors Graph</h4>
              </div>
            </div>
          </ErrorBoundary>
        </div>
        <div className='col-md-5'>
          <ErrorBoundary>
            <div className='chart-container bg-light p-3 mb-3 rounded border'>
              <PieChart data={likelihoodValues} labels={likelihoodLabels} label="Likelihood Frequency" />
              <div className='text-center'>
                <h4 className='font-weight-bold'>Likelihood Graph</h4>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>

      {/* Second Row */}
      <div className='row'>
        <div className='col-md-6'>
          <ErrorBoundary>
            <div className='chart-container bg-light p-3 mb-3 rounded border '>
              <BarChart data={frequencyValues} labels={intensityLabels} label="Intensity Frequency | X-axis: intensity value | Y-axis: intensity frequency" />
              <div className='text-center'>
                <h4 className='font-weight-bold'>Intensity Graph</h4>
              </div>
            </div>
          </ErrorBoundary>
        </div>
        <div className='col-md-6'>
          <ErrorBoundary>
            <div className='chart-container bg-light p-3 mb-3 rounded border'>
              <BarChart data={relevanceValues} labels={relevanceLabels} label="Relevance Frequency | X-axis: Relevance Value | Y-axis: Relevance Frequency" />
              <div className='text-center'>
                <h4 className='font-weight-bold'>Relevance Graph</h4>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>

      {/* Third Row */}
      <div className='row'>
        <div className='col-md-6'>
          <ErrorBoundary>
            <div className='chart-container bg-light p-3 mb-3 rounded border'>
              <LineChart2 datasets={[startYearFrequencyValues, endYearFrequencyValues]} labels={chartLabels} label="Start and End Year Frequencies" />
              <div className='text-center'>
                <h5 className='font-weight-bold'>Line 1 end year, Line 2 start year</h5>
              </div>
            </div>
          </ErrorBoundary>
        </div>
        <div className='col-md-6'>
          <ErrorBoundary>
            <div className='chart-container bg-light p-3 mb-3 rounded border'>
              <BarChart2 data={countryFrequencyValues} labels={countryLabels} label="Country Frequency | X-axis: Country Name | Y-axis: Frequency" />
              <div className='text-center'>
                <h4 className='font-weight-bold'>Country Graph</h4>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
