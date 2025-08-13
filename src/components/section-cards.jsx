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
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 pt-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>Loading...</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                --
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const { overview, performance } = data;

  const cards = [
    {
      title: "Total Responders",
      value: overview.total_responders,
      description: "Available Response Personnel",
      icon: <IconUsers className="size-4" />,
      trend: overview.availability_rate > 80 ? "up" : "down",
      trendValue: `${overview.availability_rate}%`,
      footer: `${overview.availability_rate}% availability rate`,
      subtext: "Emergency response readiness",
    },
    {
      title: "Active Emergencies",
      value: overview.active_emergencies,
      description: "Currently Ongoing",
      icon: <IconActivity className="size-4" />,
      trend: overview.active_emergencies < 10 ? "up" : "down",
      trendValue: overview.active_emergencies < 10 ? "Low" : "High",
      footer: "Emergency response load",
      subtext: "Current operational status",
    },
    {
      title: "Avg Response Time",
      value: `${performance?.average_response_time || 0} min`,
      description: "Emergency Response Speed",
      icon: <IconClock className="size-4" />,
      trend: performance?.average_response_time < 8 ? "up" : "down",
      trendValue:
        performance?.average_response_time < 8
          ? "Excellent"
          : "Needs Attention",
      footer: "Response efficiency metric",
      subtext: "Target: Under 8 minutes",
    },
    {
      title: "Resolved Today",
      value: overview.resolved_today || 0,
      description: "Cases Completed",
      icon: <IconShield className="size-4" />,
      trend: "up",
      trendValue: "Daily",
      footer: "Today's completion rate",
      subtext: "Emergency cases resolved",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 pt-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 md:grid-cols-2">
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
