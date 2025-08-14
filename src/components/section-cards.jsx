import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconActivity,
  IconClock,
  IconShield,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards({ data }) {
  if (!data || !data.overview) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 p-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card animate-pulse">
            <CardHeader>
              <CardDescription className="h-4 bg-muted rounded w-3/4"></CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardTitle>
            </CardHeader>
            <CardFooter className="pt-4">
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const { overview, performance, emergencies } = data;

  const cards = [
    {
      title: "Total Responders",
      value: overview.total_responders,
      description: "Response Personnel",
      icon: <IconUsers className="size-4" />,
      trend: overview.availability_rate >= 80 ? "up" : "down",
      trendValue: `${overview.availability_rate}%`,
      footer: `${overview.available_responders} available`,
      subtext: `${overview.unavailable_responders} unavailable`,
    },
    {
      title: "Today's Emergencies",
      value: emergencies?.totals?.today || 0,
      description: "Cases Today",
      icon: <IconActivity className="size-4" />,
      trend:
        emergencies?.totals?.today <= emergencies?.totals?.last_7_days / 7
          ? "up"
          : "down",
      trendValue: emergencies?.totals?.today <= 5 ? "Normal" : "High",
      footer: `${emergencies?.totals?.last_7_days || 0} this week`,
      subtext: "Emergency response activity",
    },
    {
      title: "Avg Response Time",
      value: performance?.average_response_time
        ? `${Math.round(performance.average_response_time / 60)} min`
        : "-- min",
      description: "Response Speed",
      icon: <IconClock className="size-4" />,
      trend: performance?.average_response_time < 480 ? "up" : "down", // 8 minutes = 480 seconds
      trendValue:
        performance?.average_response_time < 480 ? "Good" : "Needs Attention",
      footer: `${performance?.total_responses || 0} responses`,
      subtext: "Target: Under 8 minutes",
    },
    {
      title: "Vehicles Available",
      value: overview.estimated_vehicles || 0,
      description: "Fleet Status",
      icon: <IconShield className="size-4" />,
      trend: "up",
      trendValue: "Ready",
      footer: "Emergency fleet",
      subtext: "Response vehicles",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 p-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{card.description}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {card.trend === "up" ? (
                  <IconTrendingUp />
                ) : (
                  <IconTrendingDown />
                )}
                {card.trendValue}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footer} {card.icon}
            </div>
            <div className="text-muted-foreground">{card.subtext}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
