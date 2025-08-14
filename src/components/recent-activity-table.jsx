import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  AlertTriangle,
  Settings,
  Phone,
  MapPin,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";

export function RecentActivityTable({ data }) {
  const [viewType, setViewType] = useState("responders");
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    contact: true,
    status: true,
    badge: true,
    type: true,
    severity: true,
    location: true,
    time: true,
    priority: true,
  });

  const responderColumns = [
    { key: "name", label: "Name", icon: <Users className="h-4 w-4" /> },
    { key: "contact", label: "Contact", icon: <Phone className="h-4 w-4" /> },
    { key: "status", label: "Status", icon: <Activity className="h-4 w-4" /> },
    {
      key: "badge",
      label: "Badge Number",
      icon: <Badge className="h-4 w-4" />,
    },
  ];

  const emergencyColumns = [
    { key: "type", label: "Type", icon: <AlertTriangle className="h-4 w-4" /> },
    {
      key: "severity",
      label: "Severity",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      key: "location",
      label: "Location",
      icon: <MapPin className="h-4 w-4" />,
    },
    { key: "time", label: "Created At", icon: <Clock className="h-4 w-4" /> },
    {
      key: "priority",
      label: "AI Priority",
      icon: <Activity className="h-4 w-4" />,
    },
  ];

  const currentColumns =
    viewType === "responders" ? responderColumns : emergencyColumns;

  const tableData = useMemo(() => {
    if (!data || !data.recent_activity) return [];

    if (viewType === "responders") {
      return (
        data.recent_activity.responders?.map((responder) => ({
          id: responder._id,
          name: responder.name,
          contact: responder.phone,
          email: responder.email,
          status: responder.status,
          badge: responder.badgeNumber,
        })) || []
      );
    } else {
      return (
        data.recent_activity.recent_emergencies?.map((emergency) => ({
          id: emergency._id,
          type: emergency.emergency_type,
          severity: emergency.severity || "Unknown",
          location: `${
            emergency.emergency_location?.coordinates?.[1]?.toFixed(4) ||
            "Unknown"
          }, ${
            emergency.emergency_location?.coordinates?.[0]?.toFixed(4) ||
            "Unknown"
          }`,
          time:
            new Date(emergency.createdAt).toLocaleDateString() +
            " " +
            new Date(emergency.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          priority: emergency.ai_recommendations?.priority_score || 0,
          status: emergency.status,
        })) || []
      );
    }
  }, [data, viewType]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "unavailable":
      case "busy":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (score) => {
    if (score >= 90) return "bg-red-100 text-red-800 border-red-200";
    if (score >= 70) return "bg-orange-100 text-orange-800 border-orange-200";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  if (!data || !data.recent_activity) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {viewType === "responders" ? (
              <Users className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            Recent Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="responders">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Responders
                  </div>
                </SelectItem>
                <SelectItem value="emergencies">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Emergencies
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {currentColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    className="flex items-center gap-2"
                    checked={visibleColumns[column.key]}
                    onCheckedChange={(checked) =>
                      setVisibleColumns((prev) => ({
                        ...prev,
                        [column.key]: checked,
                      }))
                    }
                  >
                    {column.icon}
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {currentColumns.map(
                  (column) =>
                    visibleColumns[column.key] && (
                      <TableHead key={column.key} className="font-semibold">
                        <div className="flex items-center gap-2">
                          {column.icon}
                          {column.label}
                        </div>
                      </TableHead>
                    )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length > 0 ? (
                tableData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    {viewType === "responders" ? (
                      <>
                        {visibleColumns.name && (
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.email}
                              </p>
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.contact && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {item.contact}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.status && (
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                item.status
                              )} text-xs`}
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                        )}
                        {visibleColumns.badge && (
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded text-sm">
                              {item.badge}
                            </code>
                          </TableCell>
                        )}
                      </>
                    ) : (
                      <>
                        {visibleColumns.type && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              {item.type}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.severity && (
                          <TableCell>
                            <Badge
                              className={`${getSeverityColor(
                                item.severity
                              )} text-xs`}
                            >
                              {item.severity}
                            </Badge>
                          </TableCell>
                        )}
                        {visibleColumns.location && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-mono">
                                {item.location}
                              </span>
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.time && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{item.time}</span>
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.priority && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${getPriorityColor(
                                  item.priority
                                )} text-xs`}
                              >
                                {item.priority}/100
                              </Badge>
                              <Badge
                                className={`${getStatusColor(
                                  item.status
                                )} text-xs`}
                              >
                                {item.status}
                              </Badge>
                            </div>
                          </TableCell>
                        )}
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={currentColumns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      {viewType === "responders" ? (
                        <Users className="h-8 w-8" />
                      ) : (
                        <AlertTriangle className="h-8 w-8" />
                      )}
                      <p>
                        No{" "}
                        {viewType === "responders"
                          ? "responders"
                          : "emergencies"}{" "}
                        data available
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {tableData.length > 0 && (
          <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
            <div>
              Showing {tableData.length}{" "}
              {viewType === "responders" ? "responders" : "emergencies"}
            </div>
            <div className="flex items-center gap-2">
              {viewType === "responders" && data.overview && (
                <Badge variant="outline" className="text-xs">
                  {data.overview.available_responders} Available
                </Badge>
              )}
              {viewType === "emergencies" && data.emergencies && (
                <Badge variant="outline" className="text-xs">
                  {data.emergencies.totals?.today || 0} Today
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
