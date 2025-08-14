"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceDot,
  Line,
  ComposedChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AlertTriangle } from "lucide-react";

export const description =
  "An interactive area chart showing emergency trends with sub-curves";

const chartConfig = {
  dailyTotal: {
    label: "Daily Total",
    color: "hsl(0, 84%, 60%)", // Red color for main curve
  },
  hourlySubCurve: {
    label: "Hourly Pattern",
    color: "hsl(0, 0%, 50%)", // Grey color for sub curves
  },
  peakHighlight: {
    label: "Peak Day",
    color: "hsl(45, 100%, 50%)", // Gold color for peak highlighting
  },
};

// Helper function to format time for display
const formatTime = (seconds) => {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

// Helper function to process emergency trends data with optimized timeline
const processChartData = (responseTimesData) => {
  if (!responseTimesData || !responseTimesData.trends) return [];

  const { trends } = responseTimesData;

  // First, identify dates with actual data
  const datesWithData = new Set();
  const dateGroups = {};

  trends.forEach((trend) => {
    const date = trend._id?.date || new Date().toISOString().split("T")[0];
    const hour = trend._id?.hour;

    datesWithData.add(date);

    if (!dateGroups[date]) {
      dateGroups[date] = {
        totalCount: 0,
        avgResponseTime: 0,
        hours: [],
      };
    }

    dateGroups[date].totalCount += trend.emergencyCount || 0;
    dateGroups[date].avgResponseTime = trend.avgResponseTime || 0;

    if (hour !== undefined && hour !== null) {
      dateGroups[date].hours.push({
        hour: hour,
        count: trend.emergencyCount || 0,
        responseTime: trend.avgResponseTime || 0,
      });
    }
  });

  // Create optimized timeline: days with data + 5 additional days
  const timeline = [];
  const today = new Date();
  const datesToInclude = new Set(datesWithData);

  // If we have less than 15 days with data, add some surrounding days
  if (datesWithData.size < 15) {
    const sortedDates = Array.from(datesWithData).sort();
    const earliestDate = sortedDates[0] ? new Date(sortedDates[0]) : new Date();
    const latestDate = sortedDates[sortedDates.length - 1]
      ? new Date(sortedDates[sortedDates.length - 1])
      : today;

    // Add 5 days around the data range
    for (let i = -3; i <= 3; i++) {
      const beforeDate = new Date(earliestDate);
      beforeDate.setDate(earliestDate.getDate() + i);
      datesToInclude.add(beforeDate.toISOString().split("T")[0]);

      const afterDate = new Date(latestDate);
      afterDate.setDate(latestDate.getDate() + i);
      datesToInclude.add(afterDate.toISOString().split("T")[0]);
    }
  }

  // Convert to array and sort
  const sortedDates = Array.from(datesToInclude).sort();

  sortedDates.forEach((dateStr) => {
    const currentDate = new Date(dateStr);
    const serverData = dateGroups[dateStr];

    timeline.push({
      date: dateStr,
      displayDate: currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      dayOfMonth: currentDate.getDate(),
      fullDate: currentDate,
      dailyTotal: serverData?.totalCount || 0,
      hours: serverData?.hours.sort((a, b) => a.hour - b.hour) || [],
      avgResponseTime: serverData?.avgResponseTime || 0,
      hasData: !!serverData,
      isPeak: false,
    });
  });

  // Find and mark peak day
  let maxCount = 0;
  let peakDayIndex = -1;
  timeline.forEach((day, index) => {
    if (day.dailyTotal > maxCount) {
      maxCount = day.dailyTotal;
      peakDayIndex = index;
    }
  });

  if (peakDayIndex >= 0) {
    timeline[peakDayIndex].isPeak = true;
  }

  return timeline;
};

export function ChartResponseTime({
  data,
  error = null,
  title = "Emergency Trends (Last 30 Days)",
  description = "Daily emergency requests and hourly patterns showing when emergencies tend to happen",
}) {
  const chartData = React.useMemo(() => {
    return processChartData(data);
  }, [data]);

  const totalEmergencies = React.useMemo(() => {
    return chartData.reduce((total, day) => total + day.dailyTotal, 0);
  }, [chartData]);

  const peakDay = React.useMemo(() => {
    return chartData.find((day) => day.isPeak) || null;
  }, [chartData]);

  // Custom tooltip component for main curve
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const tooltipData = payload[0]?.payload;
    if (!tooltipData) return null;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <h4 className="font-semibold text-sm mb-2">
          {tooltipData.displayDate}
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Total Emergencies:</span>
            <span className="font-medium text-red-600">
              {tooltipData.dailyTotal}
            </span>
          </div>
          {tooltipData.avgResponseTime > 0 && (
            <div className="flex justify-between">
              <span>Avg Response:</span>
              <span className="font-medium">
                {formatTime(tooltipData.avgResponseTime)}
              </span>
            </div>
          )}
          {tooltipData.hours.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-gray-600 mb-1">Hourly Breakdown:</div>
              {tooltipData.hours.slice(0, 5).map((hour, idx) => (
                <div key={idx} className="flex justify-between text-gray-700">
                  <span>{hour.hour}:00</span>
                  <span>{hour.count} emergencies</span>
                </div>
              ))}
              {tooltipData.hours.length > 5 && (
                <div className="text-gray-500 text-center">
                  +{tooltipData.hours.length - 5} more hours...
                </div>
              )}
            </div>
          )}
          {tooltipData.isPeak && (
            <div className="mt-2 pt-2 border-t border-red-200 bg-red-50 px-2 py-1 rounded">
              <span className="text-red-700 font-medium">
                ⚠️ Peak Emergency Day
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            <div className="text-center">
              <p>Failed to load emergency trends data</p>
              <p className="text-sm">Please try refreshing the page</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{description}</span>
          <span className="@[540px]/card:hidden">
            Emergency trends over time
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="text-center p-4 rounded-lg border bg-blue-50 border-blue-200">
            <p className="text-2xl font-bold text-blue-600">
              {totalEmergencies}
            </p>
            <p className="text-sm text-blue-700">Total Emergencies</p>
          </div>
          <div className="text-center p-4 rounded-lg border bg-green-50 border-green-200">
            <p className="text-2xl font-bold text-green-600">
              {peakDay?.displayDate || "N/A"}
            </p>
            <p className="text-sm text-green-700">Peak Day</p>
          </div>
          <div className="text-center p-4 rounded-lg border bg-orange-50 border-orange-200">
            <p className="text-2xl font-bold text-orange-600">
              {peakDay?.dailyTotal || 0}
            </p>
            <p className="text-sm text-orange-700">Peak Day Count</p>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="space-y-4">
            {/* Main Chart with Sub-Curves for Hourly Distribution */}
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[400px] w-full"
            >
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient
                    id="fillDailyTotal"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-dailyTotal)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-dailyTotal)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="dayOfMonth"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                  domain={["dataMin", "dataMax"]}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}`}
                  label={{
                    value: "Emergency Count",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ChartTooltip content={<CustomTooltip />} />

                {/* Main curve showing daily totals */}
                <Area
                  dataKey="dailyTotal"
                  type="monotone"
                  fill="url(#fillDailyTotal)"
                  stroke="var(--color-dailyTotal)"
                  strokeWidth={3}
                  name="Daily Total"
                />

                {/* Peak highlighting dots */}
                {chartData
                  .filter((day) => day.isPeak)
                  .map((peakDay, index) => (
                    <ReferenceDot
                      key={index}
                      x={peakDay.dayOfMonth}
                      y={peakDay.dailyTotal}
                      r={8}
                      fill="var(--color-peakHighlight)"
                      stroke="white"
                      strokeWidth={3}
                    />
                  ))}
              </ComposedChart>
            </ChartContainer>

            {/* Hourly Sub-patterns Display */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Days with Multiple Emergency Hours
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {chartData
                  .filter((day) => day.hasData && day.hours.length > 1)
                  .map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {day.displayDate}
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          {day.dailyTotal} total
                        </span>
                      </div>
                      <div className="space-y-1">
                        {day.hours.map((hour, hourIndex) => (
                          <div
                            key={hourIndex}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-gray-600">
                              {hour.hour}:00
                            </span>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-1 bg-gray-400 rounded"
                                style={{
                                  width: `${Math.max(
                                    20,
                                    (hour.count / day.dailyTotal) * 60
                                  )}px`,
                                }}
                              ></div>
                              <span className="text-gray-700 w-8 text-right">
                                {hour.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-red-500"></div>
                <span>Daily Emergency Totals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Peak Emergency Day</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No emergency trends data available</p>
              <p className="text-sm">
                Emergency trends will appear here when data is available
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
