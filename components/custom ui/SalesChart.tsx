"use client";

import React from "react";

interface SalesChartProps {
  data: { name: string; sales: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const maxSales = Math.max(...data.map((d) => d.sales));
  const chartWidth = 800; // Width of the chart
  const chartHeight = 300; // Height of the chart
  const padding = 50; // Padding for the axes

  const getX = (index: number) => {
    return (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
  };

  const getY = (sales: number) => {
    return chartHeight - padding - (sales / maxSales) * (chartHeight - padding * 2);
  };

  const linePath = data
    .map((point, index) => `${index === 0 ? "M" : "L"}${getX(index)},${getY(point.sales)}`)
    .join(" ");

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-[800px] w-full bg-gray-50 shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Sales Chart</h2>
        <svg
          width={chartWidth}
          height={chartHeight}
          className="mx-auto rounded-lg overflow-hidden bg-white"
        >
          {/* Axes */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={padding}
            y2={padding}
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((fraction) => (
            <line
              key={fraction}
              x1={padding}
              y1={getY(maxSales * fraction)}
              x2={chartWidth - padding}
              y2={getY(maxSales * fraction)}
              stroke="#f3f4f6"
              strokeDasharray="4"
            />
          ))}

          {/* Data Line */}
          <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2" />

          {/* Data Points */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(point.sales)}
              r="5"
              fill="#4f46e5"
              stroke="#fff"
              strokeWidth="2"
              className="hover:scale-125 transition-transform"
            />
          ))}

          {/* Labels */}
          {data.map((point, index) => (
            <text
              key={index}
              x={getX(index)}
              y={chartHeight - padding + 20}
              textAnchor="middle"
              fontSize="12"
              className="text-gray-600"
            >
              {point.name}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SalesChart;
