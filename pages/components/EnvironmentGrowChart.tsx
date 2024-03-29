import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import authRequest from '@/utils/request/authRequest';
import 'chart.js/auto';
import { useLanguageResources } from '@/contexts/LanguageContext';
import { resources } from '@/contexts/languageResources';

interface EnvironmentData {
  id: number;
  temperature: number;
  humidity: number;
  soil_humid: number;
  grow: number;
  created_at: string;
}

function createChartData(
  data: EnvironmentData[],
  dataKey: keyof EnvironmentData,
  borderColor: string,
  resources: any
) {
  const labels = data.map((item) => {
    const date = new Date(item.created_at);
    return `${date.getMonth() + 1}${resources.month} ${date.getDate()}${
      resources.date
    } ${date.getHours()}${resources.hour}`;
  });
  const chartData = data.map((item) => item[dataKey]);

  return {
    labels,
    datasets: [
      {
        label: `${resources.length} (cm)`,
        data: chartData,
        borderColor,
        borderWidth: 1,
        fill: false,
      },
    ],
  };
}

const GrowthRateChart: React.FC = () => {
  const [envData, setEnvData] = useState<EnvironmentData[]>([]);
  const resources = useLanguageResources();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authRequest.get<EnvironmentData[]>(
          `http://localhost:8000/envir`
        );
        setEnvData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const growFilteredData = envData.filter((item) => item.grow != 0);

  return (
    <div className="mt-4">
      <h2 className="clip-right mb-4 mt-8 ml-4 w-1/5 rounded-l border border-yellow-300 bg-emerald-200 p-2 text-2xl font-bold">
        {resources.growChart}
      </h2>
      <Line
        data={createChartData(
          growFilteredData,
          'grow',
          'rgba(75, 192, 192, 1)',
          resources
        )}
        options={{
          plugins: {
            legend: {
              labels: {
                color: 'rgba(0, 0, 0, 0.8)',
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${resources.length}: ` + context.parsed.y;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default GrowthRateChart;
