import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  TrendingUp,
  Sun,
  Sunset,
  Moon,
  Activity,
  AlertTriangle,
} from "lucide-react";

export function TodayInsights({ data }) {
  if (
    !data ||
    !data.emergencies ||
    !data.emergencies.trends ||
    !data.emergencies.trends.today
  ) {
    return (
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <CardTitle className="h-5 bg-muted rounded w-3/4"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-8 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const { today } = data.emergencies.trends;
  const { peak_hour, summary, total_count } = today;

  const formatTime = (timeStr) => {
    // Convert "1 AM" to "01:00 AM" format for better display
    return timeStr;
  };

  return (
    <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Peak Hour Card */}
      <Card className="@container/card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Peak Activity
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {peak_hour?.period || "AM"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {formatTime(peak_hour?.time || "-- --")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Emergencies</span>
              <span className="font-semibold text-destructive">
                {peak_hour?.count || 0} cases
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Highest emergency activity recorded at this hour today
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Summary Card */}
      <Card className="@container/card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Today's Overview
            </CardTitle>
            <Badge variant="secondary">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Cases</span>
              <span className="text-2xl font-bold text-primary">
                {total_count || 0}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 rounded p-2 text-center">
                <div className="font-semibold">
                  {summary?.morning_count || 0}
                </div>
                <div className="text-muted-foreground">Morning</div>
              </div>
              <div className="bg-muted/50 rounded p-2 text-center">
                <div className="font-semibold">
                  {summary?.afternoon_count || 0}
                </div>
                <div className="text-muted-foreground">Afternoon</div>
              </div>
              <div className="bg-muted/50 rounded p-2 text-center">
                <div className="font-semibold">
                  {summary?.evening_count || 0}
                </div>
                <div className="text-muted-foreground">Evening</div>
              </div>
              <div className="bg-muted/50 rounded p-2 text-center">
                <div className="font-semibold">{summary?.night_count || 0}</div>
                <div className="text-muted-foreground">Night</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agency Info Card */}
      <Card className="@container/card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Agency Status
            </CardTitle>
            <Badge variant="default" className="bg-green-500">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm">
                {data.agency?.name || "Swift Aid Agency"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {data.agency?.branch || "Emergency Services"}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Service Type</span>
              <Badge variant="outline" className="text-xs">
                {data.agency?.type || "Emergency Response"}
              </Badge>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Response Rate</span>
                <span className="font-semibold text-green-600">
                  {data.overview?.availability_rate || 0}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
