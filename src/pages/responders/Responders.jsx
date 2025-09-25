import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map, { Marker, Popup } from "react-map-gl";
import {
  IconUsers,
  IconPhone,
  IconMail,
  IconMapPin,
  IconUser,
  IconBadge,
  IconRefresh,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResizablePanel } from "@/components/ui/resizable";
import {
  fetchResponders,
  setSelectedResponder,
  clearSelectedResponder,
} from "@/store/slices/respondersSlice";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidWJhaWRhIiwiYSI6ImNtZTc0bXpkZDAwbGUyanM2MGtqZXg5ZTgifQ.9Zhxjj0T8MgmUoZfORiSUA";

const Responders = () => {
  const dispatch = useDispatch();
  const {
    data: responders,
    loading,
    error,
    selectedResponder,
  } = useSelector((state) => state.responders);
  const [viewState, setViewState] = useState({
    longitude: -0.17,
    latitude: 5.66,
    zoom: 12,
  });
  const [responderPopup, setResponderPopup] = useState(null);

  useEffect(() => {
    dispatch(fetchResponders());
  }, [dispatch]);

  const getResponderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-red-500";
    }
  };

  const getResponderStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "default";
      case "busy":
        return "secondary";
      case "offline":
        return "outline";
      default:
        return "destructive";
    }
  };

  const handleResponderClick = (responder) => {
    dispatch(setSelectedResponder(responder));

    // Center map on selected responder
    if (responder.current_location?.coordinates) {
      const [longitude, latitude] = responder.current_location.coordinates;
      setViewState((prev) => ({
        ...prev,
        longitude,
        latitude,
        zoom: 15,
      }));
    }
  };

  const handleMapResponderClick = (responder) => {
    setResponderPopup(responder);
  };

  if (loading) {
    return (
      <div className="space-y-6 h-screen flex flex-col">
        {/* Header Skeleton */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-16 ml-2" />
        </div>

        <div className="flex-1 min-h-0">
          <ResizablePanel
            defaultSize={35}
            minSize={25}
            maxSize={55}
            className="h-full gap-4"
          >
            {/* List Skeleton */}
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full">
                  <div className="space-y-3 p-4 pb-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="p-3 rounded-lg border space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <Skeleton className="h-5 w-12" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="flex justify-end">
                          <Skeleton className="h-6 w-6" />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Map Skeleton */}
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <Skeleton className="h-full w-full rounded-b-lg" />
              </CardContent>
            </Card>
          </ResizablePanel>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <IconUsers className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Responders</h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-2xl">
            <IconUsers className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Error loading responders: {error}</span>
              <Button
                onClick={() => dispatch(fetchResponders())}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                <IconRefresh className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <IconUsers className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Responders</h1>
          <Badge variant="outline" className="ml-2">
            {responders.length} Total
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => dispatch(fetchResponders())}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <IconRefresh
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Resizable Layout */}
      <div className="flex-1 min-h-0">
        <ResizablePanel
          defaultSize={35}
          minSize={25}
          maxSize={55}
          className="h-full gap-4"
        >
          {/* Responders List */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconUsers className="h-5 w-5 text-red-600" />
                All Responders
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="space-y-3 p-4 pb-6">
                  {responders.map((responder) => (
                    <div
                      key={responder._id}
                      onClick={() => handleResponderClick(responder)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedResponder?._id === responder._id
                          ? "border-red-500 bg-red-50 shadow-md ring-1 ring-red-200"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <IconUser className="h-4 w-4 text-gray-600 flex-shrink-0" />
                            <span className="font-medium text-gray-900 text-sm leading-tight">
                              {responder.name}
                            </span>
                          </div>
                          <Badge
                            variant={getResponderStatusBadgeVariant(
                              responder.status
                            )}
                            className="flex-shrink-0 text-xs"
                          >
                            {responder.status}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-2 min-w-0">
                            <IconBadge className="h-3 w-3 flex-shrink-0" />
                            <span>Badge: {responder.badgeNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <IconPhone className="h-3 w-3 flex-shrink-0" />
                            <span>{responder.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <IconMail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{responder.email}</span>
                          </div>
                        </div>

                        {responder.current_location?.coordinates && (
                          <div className="flex justify-end pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResponderClick(responder);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <IconMapPin className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <IconMapPin className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="text-lg font-semibold">
                    Responder Locations
                  </span>
                  {selectedResponder && (
                    <Badge variant="outline" className="hidden lg:inline-flex">
                      Tracking: {selectedResponder.name}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch(clearSelectedResponder());
                    setResponderPopup(null);
                  }}
                  className="self-start sm:self-auto"
                >
                  Clear Selection
                </Button>
              </div>
              {selectedResponder && (
                <Badge variant="outline" className="lg:hidden mt-2 w-fit">
                  Tracking: {selectedResponder.name}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="h-full w-full">
                <Map
                  {...viewState}
                  onMove={(evt) => setViewState(evt.viewState)}
                  mapboxAccessToken={MAPBOX_TOKEN}
                  style={{ width: "100%", height: "100%" }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  attributionControl={false}
                >
                  {responders
                    .filter(
                      (responder) => responder.current_location?.coordinates
                    )
                    .map((responder) => {
                      const [longitude, latitude] =
                        responder.current_location.coordinates;
                      const isSelected =
                        selectedResponder?._id === responder._id;

                      return (
                        <Marker
                          key={responder._id}
                          longitude={longitude}
                          latitude={latitude}
                          onClick={() => handleMapResponderClick(responder)}
                        >
                          <div
                            className={`relative cursor-pointer transition-transform hover:scale-110 ${
                              isSelected ? "scale-125" : ""
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full border-3 flex items-center justify-center ${
                                isSelected
                                  ? "border-red-600 shadow-lg shadow-red-200"
                                  : "border-white shadow-lg"
                              } ${getResponderStatusColor(responder.status)}`}
                            >
                              <IconUser className="h-4 w-4 text-white" />
                            </div>
                            {isSelected && (
                              <div className="absolute -inset-2 border-2 border-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </Marker>
                      );
                    })}

                  {responderPopup && (
                    <Popup
                      longitude={responderPopup.current_location.coordinates[0]}
                      latitude={responderPopup.current_location.coordinates[1]}
                      onClose={() => setResponderPopup(null)}
                      closeButton={true}
                      closeOnClick={false}
                      anchor="bottom"
                    >
                      <div className="p-3 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <IconUser className="h-4 w-4 text-red-600" />
                          <span className="font-semibold">
                            {responderPopup.name}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <IconBadge className="h-3 w-3" />
                            <span>Badge: {responderPopup.badgeNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IconPhone className="h-3 w-3" />
                            <span>{responderPopup.phone}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <Badge
                              variant={getResponderStatusBadgeVariant(
                                responderPopup.status
                              )}
                            >
                              {responderPopup.status}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => {
                                dispatch(setSelectedResponder(responderPopup));
                                setResponderPopup(null);
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Track
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  )}
                </Map>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </div>
    </div>
  );
};

export default Responders;
