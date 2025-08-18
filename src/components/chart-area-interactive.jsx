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
    color: "hsl(0, 84%, 60%)", // Red color
  },
  fire: {
    label: "Emergencies",
    color: "hsl(0, 84%, 60%)", // Red color to match app theme
  },
};

// Helper function to process trends data based on period
const processChartData = (emergencies, period) => {
  if (!emergencies || !emergencies.trends) return [];

  const { trends } = emergencies;

  switch (period) {
    case "today":
      return (
        trends.today?.hourly_data?.map((item) => ({
          date: item.time,
          fire: item.count,
          emergencies: item.count,
        })) || []
      );

    case "7d":
      return (
        trends.last_7_days?.map((item) => ({
          date: item.month, // "Aug 11"
          fire: item.count,
          emergencies: item.count,
        })) || []
      );

    case "30d":
      return (
        trends.last_30_days?.map((item) => ({
          date: item.month, // "Aug 11"
          fire: item.count,
          emergencies: item.count,
        })) || []
      );

    case "3m":
      return (
        trends.last_3_months?.map((item) => ({
          date: item.month, // "Aug 11"
          fire: item.count,
          emergencies: item.count,
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
    return processChartData(data?.emergencies, timeRange);
  }, [data?.emergencies, timeRange]);

  const totalEmergencies = React.useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((sum, item) => sum + (item.fire || 0), 0);
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
                    return value; // Show hour format (e.g., "1 AM")
                  }
                  return value; // Show formatted date (e.g., "Aug 11")
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
                      return `Date: ${value}`;
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="fire"
                type="natural"
                fill="url(#fillFire)"
                stroke="var(--color-fire)"
                strokeWidth={2}
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
