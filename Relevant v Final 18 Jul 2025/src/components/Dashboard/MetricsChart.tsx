import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';

interface MetricsChartProps {
  selectedMetric: string;
  dateRange: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ selectedMetric, dateRange }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; day: number } | null>(null);

  const colors = {
    impresiones: '#22E4AC',
    clics: '#FFB547', 
    cpa: '#FF6B9D',
    roas: '#7F4FFF',
    ctr: '#36A2EB',
    conversiones: '#28C76F'
  };

  const metricLabels = {
    impresiones: 'Impresiones',
    clics: 'Clics',
    cpa: 'CPA',
    roas: 'ROAS',
    ctr: 'CTR',
    conversiones: 'Conversiones'
  };

  const periodLabels = {
    '7': 'Últimos 7 días',
    '14': 'Últimos 14 días',
    '30': 'Últimos 30 días'
  };

  // Generate realistic data for the selected metric
  const generateRealisticData = useMemo(() => {
    const data = [];
    let baseValue = 0;
    const days = parseInt(dateRange);
    
    // Set realistic base values for each metric
    switch (selectedMetric) {
      case 'impresiones':
        baseValue = 80000; // 80K impressions base
        break;
      case 'clics':
        baseValue = 1600; // 1.6K clicks base
        break;
      case 'cpa':
        baseValue = 12.5; // $12.5 CPA base
        break;
      case 'roas':
        baseValue = 4.8; // 4.8x ROAS base
        break;
      case 'ctr':
        baseValue = 2.0; // 2% CTR base
        break;
      case 'conversiones':
        baseValue = 42; // 42 conversions base
        break;
    }

    for (let i = 1; i <= days; i++) {
      // Add realistic variations with trends
      const dayOfWeek = (i - 1) % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Weekend effect (lower performance typically)
      const weekendMultiplier = isWeekend ? 0.7 : 1.0;
      
      // Add some trend (slight improvement over time)
      const trendMultiplier = 1 + (i / days) * 0.1;
      
      // Add random variation
      const randomVariation = 0.8 + Math.random() * 0.4; // ±20% variation
      
      let value = baseValue * weekendMultiplier * trendMultiplier * randomVariation;
      
      // Special handling for percentage metrics
      if (selectedMetric === 'ctr') {
        value = Math.max(0.5, Math.min(5.0, value)); // Keep CTR between 0.5% and 5%
      } else if (selectedMetric === 'roas') {
        value = Math.max(1.0, Math.min(8.0, value)); // Keep ROAS between 1x and 8x
      } else if (selectedMetric === 'cpa') {
        value = Math.max(5.0, Math.min(25.0, value)); // Keep CPA between $5 and $25
      }
      
      data.push({ day: i, value: Math.round(value * 100) / 100 });
    }
    
    return data;
  }, [selectedMetric, dateRange]);

  const formatValue = (metric: string, value: number) => {
    switch (metric) {
      case 'cpa':
        return `$${value.toFixed(2)}`;
      case 'roas':
        return `${value.toFixed(1)}x`;
      case 'ctr':
        return `${value.toFixed(2)}%`;
      case 'impresiones':
      case 'clics':
      case 'conversiones':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 400;
  const padding = { top: 40, right: 60, bottom: 60, left: 80 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const selectedColor = colors[selectedMetric as keyof typeof colors];
  const days = parseInt(dateRange);

  // Calculate scales
  const xScale = (day: number) => (day - 1) * (chartWidth / (days - 1)) + padding.left;
  
  const getYScale = useMemo(() => {
    const values = generateRealisticData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const paddedMin = minValue - range * 0.1;
    const paddedMax = maxValue + range * 0.1;
    
    return (value: number) => {
      const normalizedValue = (value - paddedMin) / (paddedMax - paddedMin);
      return svgHeight - padding.bottom - (normalizedValue * chartHeight);
    };
  }, [generateRealisticData, svgHeight, chartHeight, padding]);

  // Generate path for the line
  const generatePath = useMemo(() => {
    return generateRealisticData.map((point, index) => {
      const x = xScale(point.day);
      const y = getYScale(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [generateRealisticData, xScale, getYScale]);

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    
    // Vertical grid lines (days)
    const dayStep = days <= 7 ? 1 : days <= 14 ? 2 : days <= 30 ? 5 : 10;
    for (let i = 1; i <= days; i += dayStep) {
      const x = xScale(i);
      lines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={padding.top}
          x2={x}
          y2={svgHeight - padding.bottom}
          stroke="#34384E"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      lines.push(
        <line
          key={`h-${i}`}
          x1={padding.left}
          y1={y}
          x2={svgWidth - padding.right}
          y2={y}
          stroke="#34384E"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }
    
    return lines;
  }, [days, xScale, padding, svgHeight, chartHeight, svgWidth]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Convert mouse position to chart coordinates
    const chartMouseX = mouseX * (svgWidth / rect.width);
    
    // Find closest data point
    let closestPoint = null;
    let minDistance = Infinity;
    
    generateRealisticData.forEach((point) => {
      const pointX = xScale(point.day);
      const pointY = getYScale(point.value);
      const distance = Math.abs(chartMouseX - pointX);
      
      if (distance < minDistance && distance < 30) { // 30px tolerance
        minDistance = distance;
        closestPoint = {
          x: pointX,
          y: pointY,
          value: point.value,
          day: point.day
        };
      }
    });
    
    setHoveredPoint(closestPoint);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Generate dynamic title
  const dynamicTitle = `Evolución de ${metricLabels[selectedMetric as keyof typeof metricLabels]} - ${periodLabels[dateRange as keyof typeof periodLabels]}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[#F0F3FA] font-medium text-lg">{dynamicTitle}</h4>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-[#AAB3CC]" />
          <span className="text-[#AAB3CC] text-sm">{periodLabels[dateRange as keyof typeof periodLabels]}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto"
          style={{ minHeight: '400px', maxHeight: '500px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          {gridLines}
          
          {/* Main line */}
          <path
            d={generatePath}
            fill="none"
            stroke={selectedColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {generateRealisticData.map((point, index) => (
            <circle
              key={index}
              cx={xScale(point.day)}
              cy={getYScale(point.value)}
              r="4"
              fill={selectedColor}
              className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              stroke="white"
              strokeWidth="2"
            />
          ))}
          
          {/* Hover line and point */}
          {hoveredPoint && (
            <>
              {/* Vertical dashed line */}
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={svgHeight - padding.bottom}
                stroke={selectedColor}
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.6"
              />
              
              {/* Highlighted point */}
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                fill={selectedColor}
                stroke="white"
                strokeWidth="3"
              />
            </>
          )}
          
          {/* X-axis labels */}
          {Array.from({ length: Math.min(days, 8) }, (_, i) => {
            const day = Math.floor((i * days) / 7) + 1;
            return (
              <text
                key={day}
                x={xScale(day)}
                y={svgHeight - padding.bottom + 20}
                textAnchor="middle"
                fill="#AAB3CC"
                fontSize="12"
              >
                Día {day}
              </text>
            );
          })}
          
          {/* Axis labels */}
          <text
            x={svgWidth / 2}
            y={svgHeight - 10}
            textAnchor="middle"
            fill="#AAB3CC"
            fontSize="14"
            fontWeight="500"
          >
            Días del Período
          </text>
          
          <text
            x={20}
            y={svgHeight / 2}
            textAnchor="middle"
            fill="#AAB3CC"
            fontSize="14"
            fontWeight="500"
            transform={`rotate(-90, 20, ${svgHeight / 2})`}
          >
            {metricLabels[selectedMetric as keyof typeof metricLabels]}
          </text>
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-[#0E0F2B] border border-[#9B6BFF]/30 rounded-lg px-3 py-2 pointer-events-none z-10"
            style={{
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100 - 10}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="text-[#F0F3FA] text-sm font-medium">
              {metricLabels[selectedMetric as keyof typeof metricLabels]}
            </div>
            <div className="text-[#AAB3CC] text-xs">
              Día {hoveredPoint.day}
            </div>
            <div 
              className="text-sm font-bold"
              style={{ color: selectedColor }}
            >
              {formatValue(selectedMetric, hoveredPoint.value)}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-[#B4BACC] text-sm">
            {metricLabels[selectedMetric as keyof typeof metricLabels]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricsChart;