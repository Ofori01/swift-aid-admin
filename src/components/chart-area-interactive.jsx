"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart showing emergency trends";

const chartConfig = {
  emergencies: {
    label: "Emergencies",
  },
  medical: {
    label: "Medical",
    color: "var(--primary)",
  },
  fire: {
    label: "Fire",
    color: "hsl(var(--destructive))",
  },
  police: {
    label: "Police",
    color: "hsl(var(--warning))",
  },
};

// Helper function to generate today's hourly data
const generateTodayData = (todayTrends) => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0") + ":00";
    hours.push({
      date: hour,
      medical: todayTrends?.medical?.[i] || Math.floor(Math.random() * 10),
      fire: todayTrends?.fire?.[i] || Math.floor(Math.random() * 5),
      police: todayTrends?.police?.[i] || Math.floor(Math.random() * 8),
    });
  }
  return hours;
};

// Helper function to process trends data based on period
const processChartData = (trends, period) => {
  if (!trends) return [];

  switch (period) {
    case "today":
      return generateTodayData(trends.today);

    case "7d":
      return (
        trends.last_7_days?.map((item, index) => ({
          date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          medical: item.medical || 0,
          fire: item.fire || 0,
          police: item.police || 0,
        })) || []
      );

    case "30d":
      return (
        trends.last_30_days?.map((item, index) => ({
          date: new Date(Date.now() - (29 - index) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          medical: item.medical || 0,
          fire: item.fire || 0,
          police: item.police || 0,
        })) || []
      );

    case "3m":
      return (
        trends.last_3_months?.map((item, index) => ({
          date: new Date(Date.now() - (89 - index) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          medical: item.medical || 0,
          fire: item.fire || 0,
          police: item.police || 0,
        })) || []
      );

    default:
      return [];
  }
};

export function ChartAreaInteractive({ data }) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const chartData = React.useMemo(() => {
    return processChartData(data?.trends, timeRange);
  }, [data?.trends, timeRange]);

  const totalEmergencies = React.useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce(
      (sum, item) =>
        sum + (item.medical || 0) + (item.fire || 0) + (item.police || 0),
      0
    );
  }, [chartData]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Emergency Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total emergencies: {totalEmergencies}
          </span>
          <span className="@[540px]/card:hidden">
            Total: {totalEmergencies}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="today">Today</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="3m">Last 3 months</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="today" className="rounded-lg">
                Today
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                Last 3 months
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillMedical" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-medical)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-medical)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillFire" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-fire)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-fire)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillPolice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-police)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-police)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  if (timeRange === "today") {
                    return value; // Show hour format (e.g., "14:00")
                  }
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      if (timeRange === "today") {
                        return `Time: ${value}`;
                      }
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="police"
                type="natural"
                fill="url(#fillPolice)"
                stroke="var(--color-police)"
                stackId="a"
              />
              <Area
                dataKey="fire"
                type="natural"
                fill="url(#fillFire)"
                stroke="var(--color-fire)"
                stackId="a"
              />
              <Area
                dataKey="medical"
                type="natural"
                fill="url(#fillMedical)"
                stroke="var(--color-medical)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            <div className="text-center">
              <p>No trend data available</p>
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
