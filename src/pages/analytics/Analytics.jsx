import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Activity,
  RefreshCw,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import {
  fetchAnalytics,
  fetchResponseTimes,
  fetchResponderUtilization,
  setPeriod,
  clearError,
} from "@/store/slices/analyticsSlice";

const Analytics = () => {
  const dispatch = useDispatch();
  const {
    analytics: analyticsRaw,
    responseTimesData: responseTimesDataRaw,
    responderUtilizationData: responderUtilizationDataRaw,
    loading,
    responseTimesLoading,
    responderUtilizationLoading,
    error,
    responseTimesError,
    responderUtilizationError,
    lastUpdated,
    period,
  } = useSelector((state) => state.analytics);

  // Extract and transform the nested data from server responses
  const analytics = analyticsRaw?.data
    ? {
        // Performance metrics (from data.performance)
        totalEmergencies: analyticsRaw.data.performance?.total_emergencies || 0,
        averageResponseTime:
          analyticsRaw.data.performance?.average_response_time || 0,
        resolutionRate: analyticsRaw.data.performance?.resolution_rate || 0,
        activeResponders: analyticsRaw.data.performance?.active_responders || 0,

        // Trends (from data.trends)
        emergenciesTrend: analyticsRaw.data.trends?.emergencies_trend || 0,
        responseTimeTrend: analyticsRaw.data.trends?.response_time_trend || 0,
        resolutionRateTrend:
          analyticsRaw.data.trends?.resolution_rate_trend || 0,
        respondersTrend: analyticsRaw.data.trends?.responders_trend || 0,

        // Emergency types distribution (transform snake_case to camelCase)
        emergencyTypes: (
          analyticsRaw.data.performance?.emergency_types || []
        ).map((type) => ({
          type: type.type,
          count: type.count,
          percentage: type.percentage,
        })),

        // Regional statistics (transform snake_case to camelCase)
        regionStats: (analyticsRaw.data.performance?.regions || []).map(
          (region) => ({
            region: region.region,
            emergencies: region.emergencies,
            avgResponseTime: region.avg_response_time,
          })
        ),
      }
    : null;

  const responseTimesData = responseTimesDataRaw?.data
    ? {
        fastest: responseTimesDataRaw.data.fastest || 0,
        average: responseTimesDataRaw.data.average || 0,
        slowest: responseTimesDataRaw.data.slowest || 0,
        daily: (responseTimesDataRaw.data.trends || []).map((trend) => ({
          date: trend.date,
          averageTime: trend.average_time,
        })),
      }
    : null;

  const responderUtilizationData = responderUtilizationDataRaw?.data
    ? {
        available: responderUtilizationDataRaw.data.responders?.available || 0,
        busy: responderUtilizationDataRaw.data.responders?.busy || 0,
        offline: responderUtilizationDataRaw.data.responders?.offline || 0,
        responders: (
          responderUtilizationDataRaw.data.responders?.list || []
        ).map((responder) => ({
          name: responder.name,
          status: responder.status,
          activeIncidents: responder.active_incidents,
          utilizationPercentage: responder.utilization_percentage,
          completedToday: responder.completed_today,
        })),
      }
    : null;

  const [refreshing, setRefreshing] = useState(false);

  const loadAllData = React.useCallback(async () => {
    dispatch(clearError());
    await Promise.all([
      dispatch(fetchAnalytics()),
      dispatch(fetchResponseTimes()),
      dispatch(fetchResponderUtilization()),
    ]);
  }, [dispatch]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData, period]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const handlePeriodChange = (newPeriod) => {
    dispatch(setPeriod(newPeriod));
  };

  const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null || isNaN(seconds))
      return "0s";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-green-500";
    if (trend < 0) return "text-red-500";
    return "text-gray-500";
  };

  const getUtilizationColor = (percentage) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading && !analytics) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-700">
                Error Loading Analytics
              </CardTitle>
            </div>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-red-300 text-red-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into emergency response performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7 days">Last 7 days</SelectItem>
              <SelectItem value="30 days">Last 30 days</SelectItem>
              <SelectItem value="90 days">Last 90 days</SelectItem>
              <SelectItem value="1 year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}

      {/* Key Metrics Cards */}
      {analytics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Emergencies
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(analytics?.totalEmergencies)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(analytics?.emergenciesTrend || 0)}
                <span
                  className={getTrendColor(analytics?.emergenciesTrend || 0)}
                >
                  {Math.abs(analytics?.emergenciesTrend || 0)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(analytics?.averageResponseTime)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(analytics?.responseTimeTrend || 0)}
                <span
                  className={getTrendColor(analytics?.responseTimeTrend || 0)}
                >
                  {Math.abs(analytics?.responseTimeTrend || 0)}% from last
                  period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resolution Rate
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.resolutionRate || 0}%
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(analytics?.resolutionRateTrend || 0)}
                <span
                  className={getTrendColor(analytics?.resolutionRateTrend || 0)}
                >
                  {Math.abs(analytics?.resolutionRateTrend || 0)}% from last
                  period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Responders
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.activeResponders || 0}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(analytics?.respondersTrend || 0)}
                <span
                  className={getTrendColor(analytics?.respondersTrend || 0)}
                >
                  {Math.abs(analytics?.respondersTrend || 0)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Emergency Types Distribution */}
        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle>Emergency Types Distribution</CardTitle>
              <CardDescription>
                Breakdown of emergencies by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analytics?.emergencyTypes || []).map((type, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full bg-${
                            [
                              "blue",
                              "green",
                              "yellow",
                              "red",
                              "purple",
                              "orange",
                            ][index % 6]
                          }-500`}
                        />
                        <span className="text-sm font-medium">
                          {type?.type || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {type?.count || 0}
                        </span>
                        <Badge variant="secondary">
                          {type?.percentage || 0}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={type?.percentage || 0} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Region Performance */}
        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Emergency response by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analytics?.regionStats || []).map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {region?.region || "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {region?.emergencies || 0} emergencies
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatTime(region?.avgResponseTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        avg response
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Response Times Chart */}
      {responseTimesData && (
        <Card>
          <CardHeader>
            <CardTitle>Response Times Trend</CardTitle>
            <CardDescription>
              Average response times over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {responseTimesLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 rounded-lg border">
                    <p className="text-2xl font-bold text-green-600">
                      {formatTime(responseTimesData?.fastest)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Fastest Response
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <p className="text-2xl font-bold">
                      {formatTime(responseTimesData?.average)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Average Response
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <p className="text-2xl font-bold text-red-600">
                      {formatTime(responseTimesData?.slowest)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Slowest Response
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Daily Breakdown</h4>
                  <div className="space-y-2">
                    {(responseTimesData?.daily || []).map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {day?.date || "Unknown"}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded">
                            <div
                              className="h-2 bg-blue-500 rounded"
                              style={{
                                width: `${Math.min(
                                  ((day?.averageTime || 0) /
                                    (responseTimesData?.slowest || 1)) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {formatTime(day?.averageTime)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Responder Utilization */}
      {responderUtilizationData && (
        <Card>
          <CardHeader>
            <CardTitle>Responder Utilization</CardTitle>
            <CardDescription>
              Current workload and availability of emergency responders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {responderUtilizationLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 rounded-lg border">
                    <p className="text-2xl font-bold text-green-600">
                      {responderUtilizationData?.available || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <p className="text-2xl font-bold text-yellow-600">
                      {responderUtilizationData?.busy || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Busy</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <p className="text-2xl font-bold text-red-600">
                      {responderUtilizationData?.offline || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Offline</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Individual Utilization</h4>
                  <div className="space-y-3">
                    {(responderUtilizationData?.responders || []).map(
                      (responder, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                responder?.status === "available"
                                  ? "bg-green-500"
                                  : responder?.status === "busy"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <div>
                              <p className="font-medium">
                                {responder?.name || "Unknown"}
                              </p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {responder?.status || "unknown"} •{" "}
                                {responder?.activeIncidents || 0} active
                                incidents
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-20 h-2 bg-gray-200 rounded">
                                <div
                                  className={`h-2 rounded ${getUtilizationColor(
                                    responder?.utilizationPercentage || 0
                                  )}`}
                                  style={{
                                    width: `${
                                      responder?.utilizationPercentage || 0
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8 text-right">
                                {responder?.utilizationPercentage || 0}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {responder?.completedToday || 0} completed today
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Messages */}
      {(responseTimesError || responderUtilizationError) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-yellow-700">
                Partial Data Warning
              </CardTitle>
            </div>
            <CardDescription className="text-yellow-600">
              Some analytics data could not be loaded:
              {responseTimesError && (
                <div>• Response Times: {responseTimesError}</div>
              )}
              {responderUtilizationError && (
                <div>• Responder Utilization: {responderUtilizationError}</div>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
