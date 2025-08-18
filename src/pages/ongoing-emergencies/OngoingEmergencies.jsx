import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  IconMapPin,
  IconAmbulance,
  IconShieldCheck,
  IconTruck,
  IconRefresh,
  IconX,
  IconClock,
  IconAlertTriangle,
  IconPhone,
} from "@tabler/icons-react";
import { fetchOngoingEmergencies } from "@/store/slices/ongoingEmergenciesSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1IjoidWJhaWRhIiwiYSI6ImNtZTdlNHQzbTAzN2MyanM2bHFkNmFnajUifQ.demo_public_token_placeholder";

const OngoingEmergencies = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector(
    (state) => state.ongoingEmergencies
  );
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [trackedEmergency, setTrackedEmergency] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [responderPopup, setResponderPopup] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: -0.1838044,
    latitude: 5.6486909,
    zoom: 12,
  });

  useEffect(() => {
    dispatch(fetchOngoingEmergencies());
  }, [dispatch]);

  // Set default tracked emergency when data loads
  useEffect(() => {
    if (data?.emergencies?.length > 0 && !trackedEmergency) {
      const firstEmergency = data.emergencies[0];
      setTrackedEmergency(firstEmergency);
      // Center map on first emergency
      setViewState((prev) => ({
        ...prev,
        longitude: firstEmergency.emergency_location.coordinates[0],
        latitude: firstEmergency.emergency_location.coordinates[1],
        zoom: 15,
      }));
    }
  }, [data, trackedEmergency]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchOngoingEmergencies());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const getEmergencyIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "fire":
        return <IconTruck className="w-4 h-4 text-red-600" />;
      case "accident":
        return <IconAmbulance className="w-4 h-4 text-blue-600" />;
      default:
        return <IconAlertTriangle className="w-4 h-4 text-orange-600" />;
    }
  };

  const getResponderIcon = () => {
    // Since the API doesn't provide vehicle_type, we'll use a generic responder icon
    // You can enhance this later when the API provides more specific responder types
    return <IconMapPin className="w-3 h-3 text-white" />;
  };

  const getResponderMarkerColor = () => {
    // You can customize this based on responder type or status
    // For now, using blue for all responders
    return "bg-blue-600";
  };

  // Helper function for future responder markers (currently unused but ready for expansion)
  const _getResponderIcon = getResponderIcon;

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-orange-600 text-white";
      case "medium":
        return "bg-yellow-600 text-black";
      case "low":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading && !data) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Ongoing Emergencies</h1>
            <p className="text-muted-foreground">
              Real-time emergency response tracking
            </p>
          </div>
          <Button disabled>
            <IconRefresh className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Emergencies
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button
            onClick={() => dispatch(fetchOngoingEmergencies())}
            className="bg-red-500 hover:bg-red-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const emergencies = data?.emergencies || [];
  const summary = data?.summary || {};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ongoing Emergencies</h1>
          <p className="text-muted-foreground">
            {summary.total_ongoing || 0} active emergencies •{" "}
            {summary.pending_count || 0} pending responses
          </p>
        </div>
        <Button
          onClick={() => dispatch(fetchOngoingEmergencies())}
          variant="outline"
          disabled={isLoading}
        >
          <IconRefresh
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {emergencies.length === 0 ? (
        <Card className="p-12 text-center">
          <IconAlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Ongoing Emergencies</h3>
          <p className="text-muted-foreground">
            All clear! No active emergencies at the moment.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconMapPin className="w-5 h-5 text-red-600" />
                  Emergency Locations
                  {trackedEmergency && (
                    <Badge variant="outline" className="ml-2">
                      Tracking: {trackedEmergency.emergency_type}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {trackedEmergency ? (
                    <>
                      Showing emergency location and{" "}
                      {trackedEmergency.agency_responders?.length || 0}{" "}
                      responder locations
                    </>
                  ) : (
                    "Real-time map showing emergency locations and responder positions"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] relative">
                  <Map
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                  >
                    {/* Emergency Location Marker - Only for tracked emergency */}
                    {trackedEmergency && (
                      <Marker
                        key={`emergency-${trackedEmergency._id}`}
                        longitude={
                          trackedEmergency.emergency_location.coordinates[0]
                        }
                        latitude={
                          trackedEmergency.emergency_location.coordinates[1]
                        }
                        anchor="bottom"
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          setPopupInfo(trackedEmergency);
                        }}
                      >
                        <div className="relative cursor-pointer">
                          <div className="bg-red-600 p-3 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform">
                            {getEmergencyIcon(trackedEmergency.emergency_type)}
                          </div>
                          <div className="absolute -top-1 -right-1">
                            <Badge
                              className={`text-xs px-1 py-0.5 ${getSeverityColor(
                                trackedEmergency.severity
                              )}`}
                            >
                              {trackedEmergency.severity}
                            </Badge>
                          </div>
                        </div>
                      </Marker>
                    )}

                    {/* Responder Markers - Only for tracked emergency */}
                    {trackedEmergency?.agency_responders?.map((responder) => (
                      <Marker
                        key={`responder-${responder._id}`}
                        longitude={
                          responder.current_location?.coordinates[0] ||
                          -0.1838044
                        }
                        latitude={
                          responder.current_location?.coordinates[1] ||
                          5.6486909
                        }
                        anchor="bottom"
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          setResponderPopup(responder);
                        }}
                      >
                        <div className="relative cursor-pointer">
                          <div
                            className={`${getResponderMarkerColor()} p-2 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform`}
                          >
                            {getResponderIcon()}
                          </div>
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                          </div>
                        </div>
                      </Marker>
                    ))}

                    {/* Popup for Emergency Location */}
                    {popupInfo && (
                      <Popup
                        anchor="top"
                        longitude={popupInfo.emergency_location.coordinates[0]}
                        latitude={popupInfo.emergency_location.coordinates[1]}
                        onClose={() => setPopupInfo(null)}
                        className="max-w-xs"
                      >
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getEmergencyIcon(popupInfo.emergency_type)}
                              <span className="font-semibold">
                                {popupInfo.emergency_type}
                              </span>
                            </div>
                            <Badge
                              className={getSeverityColor(popupInfo.severity)}
                            >
                              {popupInfo.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {popupInfo.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <IconClock className="w-3 h-3" />
                              {formatTime(popupInfo.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <IconPhone className="w-3 h-3" />
                              {popupInfo.user_id?.phone_number}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => {
                              setSelectedEmergency(popupInfo);
                              setPopupInfo(null);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </Popup>
                    )}

                    {/* Popup for Responder */}
                    {responderPopup && (
                      <Popup
                        anchor="top"
                        longitude={
                          responderPopup.current_location?.coordinates[0] ||
                          -0.1838044
                        }
                        latitude={
                          responderPopup.current_location?.coordinates[1] ||
                          5.6486909
                        }
                        onClose={() => setResponderPopup(null)}
                        className="max-w-xs"
                      >
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-blue-600 p-1.5 rounded-full">
                              {getResponderIcon()}
                            </div>
                            <span className="font-semibold">
                              {responderPopup.name}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Badge:</span>{" "}
                              {responderPopup.badgeNumber}
                            </p>
                            <p>
                              <span className="font-medium">Phone:</span>{" "}
                              {responderPopup.phone}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>{" "}
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600 ml-1"
                              >
                                {responderPopup.status}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      </Popup>
                    )}
                  </Map>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Emergencies</CardTitle>
                <CardDescription>
                  {emergencies.length} emergency
                  {emergencies.length !== 1 ? "ies" : ""} require
                  {emergencies.length === 1 ? "s" : ""} immediate attention
                  {trackedEmergency && (
                    <span className="block mt-1 text-red-600 font-medium">
                      Currently tracking: {trackedEmergency.emergency_type}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[550px] overflow-y-auto">
                {emergencies.map((emergency) => (
                  <Card
                    key={emergency._id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      trackedEmergency?._id === emergency._id
                        ? "ring-2 ring-red-500 bg-red-50 border-red-200"
                        : ""
                    }`}
                    onClick={() => {
                      setTrackedEmergency(emergency);
                      // Center map on selected emergency
                      setViewState((prev) => ({
                        ...prev,
                        longitude: emergency.emergency_location.coordinates[0],
                        latitude: emergency.emergency_location.coordinates[1],
                        zoom: 15,
                      }));
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getEmergencyIcon(emergency.emergency_type)}
                          <span className="font-medium">
                            {emergency.emergency_type}
                          </span>
                        </div>
                        <Badge className={getSeverityColor(emergency.severity)}>
                          {emergency.severity}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {emergency.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <IconClock className="w-3 h-3" />
                          {formatTime(emergency.createdAt)}
                        </span>
                        <span>
                          {emergency.response_metrics
                            ?.total_responders_selected || 0}{" "}
                          responders
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Emergency Details Modal/Sidebar would go here */}
      {selectedEmergency && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getEmergencyIcon(selectedEmergency.emergency_type)}
                  <CardTitle>
                    {selectedEmergency.emergency_type} Emergency
                  </CardTitle>
                  <Badge
                    className={getSeverityColor(selectedEmergency.severity)}
                  >
                    {selectedEmergency.severity}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEmergency(null)}
                >
                  <IconX className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                Reported on {formatDate(selectedEmergency.createdAt)} at{" "}
                {formatTime(selectedEmergency.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{selectedEmergency.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Reporter Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedEmergency.user_id?.name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedEmergency.user_id?.phone_number}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedEmergency.user_id?.email}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="responders" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="responders">
                    Assigned Responders
                  </TabsTrigger>
                  <TabsTrigger value="metrics">Response Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="responders" className="space-y-4">
                  {selectedEmergency.agency_responders?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedEmergency.agency_responders.map((responder) => (
                        <Card key={responder._id}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{responder.name}</p>
                                <p className="text-sm text-gray-600">
                                  Badge: {responder.badgeNumber}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Phone: {responder.phone}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                              >
                                {responder.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No responders assigned yet
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  {selectedEmergency.response_metrics && (
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-3 text-center">
                          <p className="text-2xl font-bold text-red-600">
                            {
                              selectedEmergency.response_metrics
                                .total_responders_selected
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Responders
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3 text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {Math.round(
                              selectedEmergency.response_metrics
                                .average_response_time / 60
                            )}
                            m
                          </p>
                          <p className="text-sm text-gray-600">
                            Avg Response Time
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3 text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {Math.round(
                              selectedEmergency.response_metrics
                                .fastest_responder_time / 60
                            )}
                            m
                          </p>
                          <p className="text-sm text-gray-600">
                            Fastest Response
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3 text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {selectedEmergency.ai_recommendations
                              ?.priority_score || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Priority Score
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OngoingEmergencies;
