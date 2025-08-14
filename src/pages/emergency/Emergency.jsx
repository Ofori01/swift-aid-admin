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
} from "lucide-react";

const Emergency = () => {
  const { emergency_id } = useParams();
  const navigate = useNavigate();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock emergency detail data - replace with actual API call
    const mockEmergency = {
      id: emergency_id,
      type: "Fire Emergency",
      status: "active",
      priority: "critical",
      location: "University of Ghana, East Legon Campus",
      coordinates: [-0.1838044, 5.6486909],
      description:
        "Large fire reported in the chemistry laboratory building. Multiple casualties reported. Immediate fire suppression and medical assistance required.",
      reportedAt: "2024-08-14T12:24:41.198Z",
      reportedBy: "Dr. Emmanuel Asante",
      reporterPhone: "+233-24-123-4567",
      reporterRole: "Laboratory Supervisor",
      severity: "Critical",
      assignedTeam: "Fire Response Team Alpha",
      teamMembers: [
        {
          name: "Captain James Mensah",
          role: "Team Leader",
          phone: "+233-20-111-2222",
        },
        {
          name: "Officer Sarah Owusu",
          role: "Fire Suppression",
          phone: "+233-24-333-4444",
        },
        {
          name: "Medic John Appiah",
          role: "Medical Support",
          phone: "+233-26-555-6666",
        },
      ],
      estimatedResponseTime: 8,
      actualResponseTime: null,
      vehiclesDispatched: [
        { type: "Fire Engine", unit: "FE-001", status: "En Route" },
        { type: "Ambulance", unit: "AMB-003", status: "En Route" },
        { type: "Support Vehicle", unit: "SV-012", status: "Standby" },
      ],
      timeline: [
        { time: "12:24", action: "Emergency reported", status: "reported" },
        { time: "12:25", action: "Team dispatched", status: "dispatched" },
        { time: "12:27", action: "Units en route", status: "responding" },
        { time: "12:32", action: "Arrived on scene", status: "on-scene" },
      ],
      aiRecommendations: {
        priorityScore: 98,
        recommendations: [
          "Immediate evacuation of surrounding buildings",
          "Request additional ambulance units",
          "Coordinate with hospital for burn unit availability",
          "Set up incident command center",
        ],
      },
    };

    // Simulate API loading
    setTimeout(() => {
      setEmergency(mockEmergency);
      setLoading(false);
    }, 1000);
  }, [emergency_id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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

  const { date, time } = formatDateTime(emergency.reportedAt);

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
            <p className="text-muted-foreground">ID: {emergency.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(emergency.status)}
          <Badge className={getPriorityColor(emergency.priority)}>
            {emergency.priority.toUpperCase()}
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
              <h3 className="font-semibold text-lg mb-2">{emergency.type}</h3>
              <p className="text-muted-foreground">{emergency.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Location</span>
                  <p className="text-sm text-muted-foreground">
                    {emergency.location}
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
                    {emergency.reportedBy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {emergency.reporterRole}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Contact</span>
                  <p className="text-sm text-muted-foreground">
                    {emergency.reporterPhone}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <div className="pb-2 border-b">
                <p className="font-medium text-sm">{emergency.assignedTeam}</p>
              </div>
              {emergency.teamMembers.map((member, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Dispatched */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Vehicles Dispatched
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergency.vehiclesDispatched.map((vehicle, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-muted/50 rounded"
                >
                  <div>
                    <p className="text-sm font-medium">{vehicle.type}</p>
                    <p className="text-xs text-muted-foreground">
                      Unit: {vehicle.unit}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {vehicle.status}
                  </Badge>
                </div>
              ))}
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
                  {emergency.aiRecommendations.priorityScore}/100
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {emergency.aiRecommendations.recommendations.map(
                    (rec, index) => (
                      <li
                        key={index}
                        className="text-xs text-muted-foreground flex items-start gap-1"
                      >
                        <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {emergency.timeline.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded"
                >
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">{event.time}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Emergency;
