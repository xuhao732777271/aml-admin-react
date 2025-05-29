import React from 'react';
import ReactECharts from 'echarts-for-react';

export interface StackedBarChartOptions {
  title: string;
  xAxisDatas: string[];
  successDatas?: number[];
  errDatas?: number[];
  xRotate?: number;
}

const StackedBarChart: React.FC<{ options: StackedBarChartOptions }> = ({ options }) => {
  const chartOption = {
    title: { text: options.title },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['合规笔数', '不合规笔数'], right: 0 },
    grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      data: options.xAxisDatas,
      axisLabel: { interval: 0, width: 100, rotate: options.xRotate, overflow: 'truncate' }
    },
    yAxis: { type: 'value', show: false },
    dataZoom: [
      { type: 'slider', start: 0, endValue: 8, height: 20, bottom: 10 },
      { type: 'inside', start: 0, endValue: 8, height: 20, bottom: 10 }
    ],
    series: [
      {
        name: '合规笔数',
        type: 'bar',
        stack: '总量',
        barWidth: '30%',
        data: options.successDatas
      },
      {
        name: '不合规笔数',
        type: 'bar',
        stack: '总量',
        barWidth: '30%',
        itemStyle: { color: '#eb7e00' },
        data: options.errDatas
      }
    ]
  };
  return <ReactECharts option={chartOption} style={{ width: '100%', height: '100%' }} />;
};

export default StackedBarChart;
