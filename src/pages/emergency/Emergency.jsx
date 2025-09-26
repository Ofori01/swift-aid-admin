import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Truck,
  Activity,
  Image as ImageIcon,
} from "lucide-react";

const Emergency = () => {
  const { emergency_id } = useParams();
  const navigate = useNavigate();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call to fetch emergency details
    // For now, using mock data that matches the API response structure
    const mockEmergency = {
      _id: emergency_id,
      emergency_type: "Fire",
      status: "Pending",
      severity: "Critical",
      description:
        "Large fire reported in the chemistry laboratory building. Multiple casualties reported. Immediate fire suppression and medical assistance required.",
      emergency_location: {
        type: "Point",
        coordinates: [-0.1838044, 5.6486909],
      },
      user_id: {
        name: "Dr. Emmanuel Asante",
        phone_number: "+233-24-123-4567",
        email: "dr.asante@ug.edu.gh",
      },
      image: "68d47ce80168cf6418c6147f", // This is the image ID from the API
      createdAt: "2024-08-14T12:24:41.198Z",
      updatedAt: "2024-08-14T12:32:15.342Z",
      ai_recommendations: {
        priority_score: 98,
        severity_level: "Critical",
        estimated_response_time: 8,
        recommended_resources: {
          ambulances: 2,
          fire_trucks: 3,
          police_units: 2,
        },
        justification:
          "Large fire with multiple casualties requires immediate comprehensive response.",
      },
      selected_responders: {
        fire_trucks: [
          { responder_id: "truck001", travelTime: 5 },
          { responder_id: "truck002", travelTime: 8 },
        ],
        ambulances: [
          { responder_id: "amb001", travelTime: 6 },
          { responder_id: "amb002", travelTime: 10 },
        ],
        police_units: [{ responder_id: "police001", travelTime: 4 }],
      },
      agency_responders: [
        {
          name: "Captain James Mensah",
          phone: "+233-20-111-2222",
          badgeNumber: "FD001",
          status: "en_route",
        },
        {
          name: "Officer Sarah Owusu",
          phone: "+233-24-333-4444",
          badgeNumber: "FD002",
          status: "en_route",
        },
      ],
    };

    // Simulate API loading
    setTimeout(() => {
      setEmergency(mockEmergency);
      setLoading(false);
    }, 1000);
  }, [emergency_id]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "in_progress":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "resolved":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (severity) => {
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getImageUrl = (imageId) => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "https://swift-aid-backend.onrender.com";
    return `${baseUrl}/emergency/image/${imageId}`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" className="animate-pulse">
            <div className="h-4 w-4 bg-muted rounded mr-2"></div>
            <div className="h-4 w-16 bg-muted rounded"></div>
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!emergency) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/emergencies")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Emergencies
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Emergency Not Found</h3>
            <p className="text-muted-foreground">
              Emergency {emergency_id} could not be found or may have been
              removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { date, time } = formatDateTime(emergency.createdAt);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/emergencies")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Emergencies
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Emergency Details</h1>
            <p className="text-muted-foreground">ID: {emergency._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(emergency.status)}
          <Badge className={getPriorityColor(emergency.severity)}>
            {emergency.severity?.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Emergency Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {emergency.emergency_type} Emergency
              </h3>
              <p className="text-muted-foreground">{emergency.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Location</span>
                  <p className="text-sm text-muted-foreground">
                    {emergency.emergency_location?.coordinates
                      ? `${emergency.emergency_location.coordinates[1]}, ${emergency.emergency_location.coordinates[0]}`
                      : "Location not available"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Reported At</span>
                  <p className="text-sm text-muted-foreground">
                    {date} at {time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Reported By</span>
                  <p className="text-sm text-muted-foreground">
                    {emergency.user_id?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {emergency.user_id?.email || ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Contact</span>
                  <p className="text-sm text-muted-foreground">
                    {emergency.user_id?.phone_number || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Image */}
        {emergency.image && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Emergency Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full relative overflow-hidden rounded-lg bg-muted">
                <img
                  src={getImageUrl(emergency.image)}
                  alt="Emergency scene"
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%236b7280' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Emergency scene documentation
              </p>
            </CardContent>
          </Card>
        )}

        {/* Response Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Response Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergency.agency_responders &&
              emergency.agency_responders.length > 0 ? (
                emergency.agency_responders.map((member, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-muted/50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Badge: {member.badgeNumber}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        Status: {member.status?.replace("_", " ")}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No responders assigned yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Responders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Selected Responders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergency.selected_responders ? (
                <>
                  {emergency.selected_responders.fire_trucks?.map(
                    (truck, index) => (
                      <div
                        key={`fire-${index}`}
                        className="flex justify-between items-center p-2 bg-muted/50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium">Fire Truck</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {truck.responder_id}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {truck.travelTime}min ETA
                        </Badge>
                      </div>
                    )
                  )}
                  {emergency.selected_responders.ambulances?.map(
                    (ambulance, index) => (
                      <div
                        key={`ambulance-${index}`}
                        className="flex justify-between items-center p-2 bg-muted/50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium">Ambulance</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {ambulance.responder_id}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {ambulance.travelTime}min ETA
                        </Badge>
                      </div>
                    )
                  )}
                  {emergency.selected_responders.police_units?.map(
                    (police, index) => (
                      <div
                        key={`police-${index}`}
                        className="flex justify-between items-center p-2 bg-muted/50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium">Police Unit</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {police.responder_id}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {police.travelTime}min ETA
                        </Badge>
                      </div>
                    )
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No responders selected yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Priority Score
                </span>
                <Badge variant="destructive">
                  {emergency.ai_recommendations?.priority_score || 0}/100
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-xs text-muted-foreground">Ambulances</p>
                  <p className="font-medium">
                    {emergency.ai_recommendations?.recommended_resources
                      ?.ambulances || 0}
                  </p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-xs text-muted-foreground">Fire Trucks</p>
                  <p className="font-medium">
                    {emergency.ai_recommendations?.recommended_resources
                      ?.fire_trucks || 0}
                  </p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-xs text-muted-foreground">Police Units</p>
                  <p className="font-medium">
                    {emergency.ai_recommendations?.recommended_resources
                      ?.police_units || 0}
                  </p>
                </div>
              </div>

              {emergency.ai_recommendations?.justification && (
                <div>
                  <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
                  <p className="text-xs text-muted-foreground">
                    {emergency.ai_recommendations.justification}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Severity Level:</span>
                <Badge variant="outline">
                  {emergency.ai_recommendations?.severity_level ||
                    emergency.severity}
                </Badge>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  Est. Response Time:
                </span>
                <span className="font-medium">
                  {emergency.ai_recommendations?.estimated_response_time ||
                    "N/A"}
                  min
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Status Timeline */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Emergency Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">
                    {new Date(emergency.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Emergency Reported
                  </p>
                </div>
              </div>

              {emergency.ai_recommendations?.generated_at && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(
                        emergency.ai_recommendations.generated_at
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      AI Analysis Completed
                    </p>
                  </div>
                </div>
              )}

              {emergency.updatedAt !== emergency.createdAt && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(emergency.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last Updated
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                <div
                  className={`w-2 h-2 rounded-full ${
                    emergency.status === "Completed"
                      ? "bg-green-500"
                      : emergency.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <p className="text-sm font-medium">Current Status</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {emergency.status}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Emergency;
