import React from 'react';
import ReactECharts from 'echarts-for-react';

export interface LineChartOptions {
  title: string;
  xAxisDatas: string[];
  proportionDatas?: number[];
  xRotate?: number;
}

const LineChart: React.FC<{ options: LineChartOptions }> = ({ options }) => {
  const chartOption = {
    title: { text: options.title },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let result = params[0].name + '<br/>';
        params.forEach((item: any) => {
          result += item.marker + item.seriesName + '：' + `${(item.value * 100).toFixed(2)}%`;
        });
        return result;
      }
    },
    legend: { show: false, data: ['不合规数据占比'], right: 0 },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: options.xAxisDatas,
      axisLabel: { rotate: options.xRotate || 0 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: (value: number) => `${Math.floor(value * 10000) / 100}%` }
    },
    dataZoom: [
      { type: 'slider', start: 0, endValue: 8, height: 20, bottom: 10 },
      { type: 'inside', start: 0, endValue: 8, height: 20, bottom: 10 }
    ],
    series: [
      {
        name: '不合规数据占比',
        type: 'line',
        smooth: true,
        stack: '总量',
        data: options.proportionDatas,
        label: {
          show: true,
          formatter: (params: any) => `${(params.value * 100).toFixed(2)}%`
        }
      }
    ]
  };
  return <ReactECharts option={chartOption} style={{ width: '100%', height: '100%' }} />;
};

export default LineChart;
