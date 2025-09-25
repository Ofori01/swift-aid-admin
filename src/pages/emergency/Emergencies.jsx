import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmergencies,
  clearFilters,
  clearError,
} from "../../store/slices/emergenciesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertTriangle,
  Search,
  Filter,
  RefreshCcw,
  Eye,
  MapPin,
  Clock,
  User,
  Phone,
  TrendingUp,
  Users,
  Truck,
  Ambulance,
  Shield,
  Calendar,
  AlertCircle,
  Timer,
  Target,
  Activity,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

const Emergencies = () => {
  const dispatch = useDispatch();
  const { emergencies, pagination, loading, error } = useSelector(
    (state) => state.emergencies
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Load emergencies on component mount
  useEffect(() => {
    dispatch(fetchEmergencies());
  }, [dispatch]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Filter and search logic
  const filteredEmergencies = useMemo(() => {
    return emergencies.filter((emergency) => {
      const matchesSearch =
        searchTerm === "" ||
        emergency.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        emergency.user_id.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        emergency.emergency_type
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || emergency.status === statusFilter;

      const matchesSeverity =
        severityFilter === "all" || emergency.severity === severityFilter;

      const matchesType =
        typeFilter === "all" || emergency.emergency_type === typeFilter;

      return matchesSearch && matchesStatus && matchesSeverity && matchesType;
    });
  }, [emergencies, searchTerm, statusFilter, severityFilter, typeFilter]);

  const handleRefresh = () => {
    dispatch(fetchEmergencies());
    toast.success("Emergencies refreshed!");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSeverityFilter("all");
    setTypeFilter("all");
    dispatch(clearFilters());
    toast.info("Filters cleared");
  };

  const getImageUrl = (imageId) => {
    return `https://swift-aid-backend.onrender.com/emergency/image/${imageId}`;
  };

  const openDetailsModal = (emergency) => {
    setSelectedEmergency(emergency);
    setIsDetailsModalOpen(true);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPriorityColor = (score) => {
    if (score >= 90) return "bg-red-50 text-red-700 border-red-200";
    if (score >= 70) return "bg-orange-50 text-orange-700 border-orange-200";
    if (score >= 50) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLocation = (location) => {
    if (location?.coordinates && Array.isArray(location.coordinates)) {
      const [lng, lat] = location.coordinates;
      return `${lat?.toFixed(4)}, ${lng?.toFixed(4)}`;
    }
    return "Unknown location";
  };

  const renderResponderIcons = (selectedResponders) => {
    const responders = [];
    const maxVisible = 3;

    // Add fire truck responders
    if (selectedResponders?.fire_trucks?.length > 0) {
      selectedResponders.fire_trucks
        .slice(0, maxVisible)
        .forEach((_, index) => {
          responders.push(
            <div
              key={`fire-${index}`}
              className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border-2 border-white shadow-sm"
            >
              <Truck className="w-4 h-4 text-red-600" />
            </div>
          );
        });
    }

    // Add ambulance responders
    if (selectedResponders?.ambulances?.length > 0) {
      selectedResponders.ambulances
        .slice(0, maxVisible - responders.length)
        .forEach((_, index) => {
          responders.push(
            <div
              key={`ambulance-${index}`}
              className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm"
            >
              <Ambulance className="w-4 h-4 text-blue-600" />
            </div>
          );
        });
    }

    // Add police responders
    if (selectedResponders?.police_units?.length > 0) {
      selectedResponders.police_units
        .slice(0, maxVisible - responders.length)
        .forEach((_, index) => {
          responders.push(
            <div
              key={`police-${index}`}
              className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm"
            >
              <Shield className="w-4 h-4 text-green-600" />
            </div>
          );
        });
    }

    // Calculate overflow
    const totalResponders =
      (selectedResponders?.fire_trucks?.length || 0) +
      (selectedResponders?.ambulances?.length || 0) +
      (selectedResponders?.police_units?.length || 0);
    const overflow = totalResponders - responders.length;

    return (
      <div className="flex items-center -space-x-2">
        {responders}
        {overflow > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm text-xs font-medium text-gray-600">
            +{overflow}
          </div>
        )}
      </div>
    );
  };

  if (loading && emergencies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Cards Loading */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cards Loading */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="aspect-square">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Emergency Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage emergency responses
            </p>
          </div>
        </div>
        <Button onClick={handleRefresh} disabled={loading} className="gap-2">
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Emergencies
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {pagination.total_count}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Critical Cases
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {emergencies.filter((e) => e.severity === "Critical").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Response
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {emergencies.filter((e) => e.status === "Pending").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Response Time
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {emergencies.length > 0
                ? Math.round(
                    emergencies.reduce(
                      (acc, e) =>
                        acc + (e.response_metrics?.average_response_time || 0),
                      0
                    ) / emergencies.length
                  )
                : 0}
              <span className="text-sm font-normal text-gray-500 ml-1">
                sec
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search emergencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Fire">Fire</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Police">Police</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="gap-2 shrink-0"
            >
              <Filter className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Cards Grid */}
      {filteredEmergencies.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmergencies.map((emergency) => (
            <Card
              key={emergency._id}
              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 aspect-square flex flex-col"
            >
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-red-100">
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                    </div>
                    <CardTitle className="text-base font-semibold text-gray-900 truncate">
                      {emergency.emergency_type}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Badge
                      className={`${getStatusColor(
                        emergency.status
                      )} text-xs px-2 py-1`}
                    >
                      {emergency.status}
                    </Badge>
                  </div>
                </div>

                <Badge
                  className={`${getSeverityColor(
                    emergency.severity
                  )} text-xs px-2 py-1 w-fit`}
                >
                  {emergency.severity || "Unknown"}
                </Badge>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {emergency.description}
                </p>

                {/* Location and Time */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span className="font-mono truncate">
                      {formatLocation(emergency.emergency_location)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(emergency.createdAt)}</span>
                  </div>
                </div>

                {/* Reporter */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-700">
                      Reporter
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {emergency.user_id.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Phone className="h-3 w-3" />
                    {emergency.user_id.phone_number}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Badge
                      className={`${getPriorityColor(
                        emergency.ai_recommendations?.priority_score || 0
                      )} text-xs mb-1`}
                    >
                      {emergency.ai_recommendations?.priority_score || 0}
                    </Badge>
                    <div className="text-xs text-gray-500">Priority</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 flex items-center justify-center gap-1">
                      <Timer className="h-3 w-3" />
                      {emergency.response_metrics?.average_response_time || 0}s
                    </div>
                    <div className="text-xs text-gray-500">Response</div>
                  </div>
                </div>

                {/* Responders */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-700">
                        {emergency.response_metrics
                          ?.total_responders_selected || 0}{" "}
                        Responders
                      </span>
                    </div>
                    {renderResponderIcons(emergency.selected_responders)}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => openDetailsModal(emergency)}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 mt-auto"
                >
                  <Eye className="h-3 w-3" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-gray-100">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No emergencies found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  severityFilter !== "all" ||
                  typeFilter !== "all"
                    ? "No emergencies match your current filters."
                    : "No emergency reports have been received yet."}
                </p>
                {(searchTerm ||
                  statusFilter !== "all" ||
                  severityFilter !== "all" ||
                  typeFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredEmergencies.length} of {pagination.total_count}{" "}
            emergencies
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.current_page > 1) {
                      dispatch(
                        fetchEmergencies({ page: pagination.current_page - 1 })
                      );
                    }
                  }}
                  className={
                    pagination.current_page === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
              {[...Array(Math.min(pagination.total_pages, 5))].map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(fetchEmergencies({ page: pageNumber }));
                      }}
                      isActive={pageNumber === pagination.current_page}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.current_page < pagination.total_pages) {
                      dispatch(
                        fetchEmergencies({ page: pagination.current_page + 1 })
                      );
                    }
                  }}
                  className={
                    pagination.current_page === pagination.total_pages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Emergency Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedEmergency && (
            <>
              <DialogHeader className="space-y-4 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      {selectedEmergency.emergency_type} Emergency
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-1">
                      Reported on {formatDate(selectedEmergency.createdAt)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-8 py-6">
                {/* Status and Priority Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-sm bg-gray-50">
                    <CardContent className="p-4 text-center">
                      <Badge
                        className={`${getStatusColor(
                          selectedEmergency.status
                        )} mb-2`}
                      >
                        {selectedEmergency.status}
                      </Badge>
                      <div className="text-sm text-gray-600">Status</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm bg-gray-50">
                    <CardContent className="p-4 text-center">
                      <Badge
                        className={`${getSeverityColor(
                          selectedEmergency.severity
                        )} mb-2`}
                      >
                        {selectedEmergency.severity || "Unknown"}
                      </Badge>
                      <div className="text-sm text-gray-600">Severity</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm bg-gray-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {selectedEmergency.ai_recommendations?.priority_score ||
                          0}
                      </div>
                      <div className="text-sm text-gray-600">
                        AI Priority Score
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Emergency Image - Full Width */}
                {selectedEmergency.image && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Emergency Image
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video w-full relative overflow-hidden rounded-lg bg-gray-50">
                        <img
                          src={getImageUrl(selectedEmergency.image)}
                          alt="Emergency scene"
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f3f4f6'/%3E%3Ctext x='200' y='112' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Emergency scene documentation
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Emergency Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Emergency Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Description
                        </label>
                        <p className="text-sm text-gray-900 mt-1 leading-relaxed">
                          {selectedEmergency.description}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Location
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="font-mono text-sm text-gray-900">
                            {formatLocation(
                              selectedEmergency.emergency_location
                            )}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Type
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedEmergency.emergency_type}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Reporter Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Name
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedEmergency.user_id.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Phone
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {selectedEmergency.user_id.phone_number}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Email
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedEmergency.user_id.email}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Recommendations */}
                {selectedEmergency.ai_recommendations && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        AI Analysis & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-900 mb-1">
                            {
                              selectedEmergency.ai_recommendations
                                .priority_score
                            }
                          </div>
                          <div className="text-sm text-blue-700">
                            Priority Score
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-900 mb-1">
                            {selectedEmergency.ai_recommendations
                              .estimated_response_time || "N/A"}
                          </div>
                          <div className="text-sm text-green-700">
                            Est. Response Time
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <Badge
                            className={`${getSeverityColor(
                              selectedEmergency.ai_recommendations
                                .severity_level
                            )} mb-1`}
                          >
                            {
                              selectedEmergency.ai_recommendations
                                .severity_level
                            }
                          </Badge>
                          <div className="text-sm text-purple-700">
                            AI Severity
                          </div>
                        </div>
                      </div>

                      {selectedEmergency.ai_recommendations.justification && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            AI Justification:
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {selectedEmergency.ai_recommendations.justification}
                          </p>
                        </div>
                      )}

                      {selectedEmergency.ai_recommendations
                        .recommended_resources && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Recommended Resources:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {selectedEmergency.ai_recommendations
                              .recommended_resources.fire_trucks > 0 && (
                              <div className="bg-red-50 p-4 rounded-lg text-center">
                                <Truck className="h-6 w-6 text-red-600 mx-auto mb-2" />
                                <div className="text-xl font-bold text-red-900">
                                  {
                                    selectedEmergency.ai_recommendations
                                      .recommended_resources.fire_trucks
                                  }
                                </div>
                                <div className="text-sm text-red-700">
                                  Fire Trucks
                                </div>
                              </div>
                            )}
                            {selectedEmergency.ai_recommendations
                              .recommended_resources.ambulances > 0 && (
                              <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <Ambulance className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                <div className="text-xl font-bold text-blue-900">
                                  {
                                    selectedEmergency.ai_recommendations
                                      .recommended_resources.ambulances
                                  }
                                </div>
                                <div className="text-sm text-blue-700">
                                  Ambulances
                                </div>
                              </div>
                            )}
                            {selectedEmergency.ai_recommendations
                              .recommended_resources.police_units > 0 && (
                              <div className="bg-green-50 p-4 rounded-lg text-center">
                                <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                <div className="text-xl font-bold text-green-900">
                                  {
                                    selectedEmergency.ai_recommendations
                                      .recommended_resources.police_units
                                  }
                                </div>
                                <div className="text-sm text-green-700">
                                  Police Units
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Response Metrics */}
                {selectedEmergency.response_metrics && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        Response Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-900 mb-1">
                            {
                              selectedEmergency.response_metrics
                                .total_responders_selected
                            }
                          </div>
                          <div className="text-sm text-blue-700">
                            Total Responders
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-900 mb-1">
                            {
                              selectedEmergency.response_metrics
                                .average_response_time
                            }
                            s
                          </div>
                          <div className="text-sm text-green-700">
                            Avg Response Time
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-900 mb-1">
                            {
                              selectedEmergency.response_metrics
                                .fastest_responder_time
                            }
                            s
                          </div>
                          <div className="text-sm text-purple-700">
                            Fastest Response
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Agency Responders */}
                {selectedEmergency.agency_responders &&
                  selectedEmergency.agency_responders.length > 0 && (
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          Assigned Responders (
                          {selectedEmergency.agency_responders.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {selectedEmergency.agency_responders.map(
                            (responder) => (
                              <div
                                key={responder._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {responder.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Badge: {responder.badgeNumber} •{" "}
                                      {responder.phone}
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  className={`${getStatusColor(
                                    responder.status
                                  )}`}
                                >
                                  {responder.status}
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Emergencies;
