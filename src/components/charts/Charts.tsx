// ============================================================================
// SweetCrumb Bakery - Chart Components
// Using Recharts with SweetCrumb theme
// ============================================================================

import { forwardRef, type HTMLAttributes } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { clsx } from 'clsx';

// -----------------------------------------------------------------------------
// Chart Theme Colors
// -----------------------------------------------------------------------------

const CHART_COLORS = {
  primary: '#EC7A4E',
  secondary: '#4D854D',
  accent: '#FF4A6F',
  warm: '#F29E7A',
  sage: '#6AA06A',
  rose: '#FF728E',
  cream: '#F9E8D0',
  charcoal: '#565656',
  grid: '#F9E8D0',
  text: '#565656',
};

const CHART_COLOR_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.warm,
  CHART_COLORS.sage,
  CHART_COLORS.rose,
];

// -----------------------------------------------------------------------------
// Chart Container Wrapper
// -----------------------------------------------------------------------------

export interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  height?: number;
  className?: string;
}

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ height = 300, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('w-full', className)}
        style={{ height, ...props.style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ChartContainer.displayName = 'ChartContainer';

// -----------------------------------------------------------------------------
// Custom Tooltip
// -----------------------------------------------------------------------------

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string; payload: any }>;
  label?: string;
  formatter?: (value: number, name: string) => [string | number, string];
}

export function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 min-w-[160px]">
      <p className="font-medium text-text-primary mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-body-sm">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="font-medium text-text-primary">
            {formatter ? formatter(entry.value, entry.name)[0] : entry.value}
            {formatter ? formatter(entry.value, entry.name)[1] : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Custom Legend
// -----------------------------------------------------------------------------

export interface CustomLegendProps {
  payload?: Array<{ value: string; color: string; id: string; type: string }>;
}

export function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload || !payload.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 cursor-pointer">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-body-sm text-text-secondary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Line Chart
// -----------------------------------------------------------------------------

interface LineChartData {
  name: string;
  [key: string]: string | number;
}

export interface LineChartProps {
  data: LineChartData[];
  xKey: string;
  lines: Array<{ key: string; name: string; color?: string }>;
  height?: number;
  showGrid?: boolean;
  showDots?: boolean;
  className?: string;
  formatter?: (value: number) => string;
}

export function LineChartComponent({
  data,
  xKey,
  lines,
  height = 300,
  showGrid = true,
  showDots = false,
  className,
  formatter,
}: LineChartProps) {
  return (
    <ChartContainer height={height} className={className}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />}
        <XAxis
          dataKey={xKey}
          tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatter}
        />
        <Tooltip content={<CustomTooltip formatter={formatter ? (v) => [formatter(v), ''] : undefined} />} />
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.color || CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length]}
            strokeWidth={2}
            dot={showDots}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

// -----------------------------------------------------------------------------
// Area Chart
// -----------------------------------------------------------------------------

export interface AreaChartProps {
  data: LineChartData[];
  xKey: string;
  areas: Array<{ key: string; name: string; color?: string; opacity?: number }>;
  height?: number;
  stacked?: boolean;
  className?: string;
  formatter?: (value: number) => string;
}

export function AreaChartComponent({
  data,
  xKey,
  areas,
  height = 300,
  stacked = false,
  className,
  formatter,
}: AreaChartProps) {
  return (
    <ChartContainer height={height} className={className}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatter}
        />
        <Tooltip content={<CustomTooltip formatter={formatter ? (v) => [formatter(v), ''] : undefined} />} />
        {areas.map((area, index) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            name={area.name}
            stroke={area.color || CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length]}
            fill={area.color || CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length]}
            fillOpacity={area.opacity || 0.3}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

// -----------------------------------------------------------------------------
// Bar Chart
// -----------------------------------------------------------------------------

interface BarChartData {
  name: string;
  [key: string]: string | number;
}

export interface BarChartProps {
  data: BarChartData[];
  xKey: string;
  bars: Array<{ key: string; name: string; color?: string }>;
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
  className?: string;
  formatter?: (value: number) => string;
}

export function BarChartComponent({
  data,
  xKey,
  bars,
  height = 300,
  horizontal = false,
  stacked = false,
  className,
  formatter,
}: BarChartProps) {
  if (horizontal) {
    return (
      <ChartContainer height={height} className={className}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatter}
          />
          <YAxis
            type="category"
            dataKey={xKey}
            tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip formatter={formatter ? (v) => [formatter(v), ''] : undefined} />} />
          {bars.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color || CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length]}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </BarChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer height={height} className={className}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatter}
        />
        <Tooltip content={<CustomTooltip formatter={formatter ? (v) => [formatter(v), ''] : undefined} />} />
        {bars.map((bar, index) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color || CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length]}
            radius={[0, 0, 4, 4]}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

// -----------------------------------------------------------------------------
// Pie / Donut Chart
// -----------------------------------------------------------------------------

interface PieChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface PieChartProps {
  data: PieChartData[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
  formatter?: (value: number) => string;
  showLegend?: boolean;
}

export function PieChartComponent({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  className,
  formatter,
  showLegend = true,
}: PieChartProps) {
  return (
    <ChartContainer height={height} className={className}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip formatter={formatter ? (v) => [formatter(v), ''] : undefined} />}
        />
        {showLegend && <Legend content={<CustomLegend />} />}
      </PieChart>
    </ChartContainer>
  );
}

// -----------------------------------------------------------------------------
// Sparkline (tiny inline chart)
// -----------------------------------------------------------------------------

export interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({ data, color = CHART_COLORS.primary, width = 100, height = 30, className }: SparklineProps) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={clsx('overflow-visible', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M${points} L${width},${height} L0,${height} Z`}
        fill="url(#sparkline-gradient)"
      />
      <path
        d={`M${points}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Progress Ring (circular progress)
// -----------------------------------------------------------------------------

export interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  showValue?: boolean;
}

export function ProgressRing({
  value,
  size = 60,
  strokeWidth = 6,
  color = CHART_COLORS.primary,
  backgroundColor = CHART_COLORS.cream,
  className,
  showValue = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-medium text-text-primary">{Math.round(value)}%</span>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Formatters
// -----------------------------------------------------------------------------

export const formatters = {
  currency: (value: number) => `₱${value.toLocaleString()}`,
  currencyShort: (value: number) => {
    if (value >= 1000000) return `₱${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₱${(value / 1000).toFixed(1)}K`;
    return `₱${value}`;
  },
  number: (value: number) => value.toLocaleString(),
  percent: (value: number) => `${value.toFixed(1)}%`,
  short: (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  },
};