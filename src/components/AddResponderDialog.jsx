import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, AlertCircle } from "lucide-react";
import {
  createResponder,
  clearCreateError,
} from "@/store/slices/respondersSlice";

const AddResponderDialog = ({ open, onOpenChange }) => {
  const dispatch = useDispatch();
  const { creating, createError } = useSelector((state) => state.responders);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    badgeNumber: "",
    agency: "",
    agency_id: "",
    status: "available",
    current_location: {
      type: "Point",
      coordinates: [-0.1826311, 5.6558318], // Default location (Accra, Ghana)
    },
  });

  const [errors, setErrors] = useState({});
  const [locationMethod, setLocationMethod] = useState("default");
  const [customCoordinates, setCustomCoordinates] = useState({
    longitude: -0.1826311,
    latitude: 5.6558318,
  });

  // Pre-fill agency information from current user
  useEffect(() => {
    if (user?.agency) {
      setFormData((prev) => ({
        ...prev,
        agency: user.agency.name || "",
        agency_id: user.agency._id || "",
      }));
    }
  }, [user]);

  // Clear create error when dialog opens
  useEffect(() => {
    if (open) {
      dispatch(clearCreateError());
    }
  }, [open, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.badgeNumber.trim()) {
      newErrors.badgeNumber = "Badge number is required";
    }

    if (!formData.agency.trim()) {
      newErrors.agency = "Agency is required";
    }

    if (locationMethod === "custom") {
      if (!customCoordinates.longitude || !customCoordinates.latitude) {
        newErrors.location = "Custom coordinates are required";
      }
      if (Math.abs(customCoordinates.longitude) > 180) {
        newErrors.location = "Longitude must be between -180 and 180";
      }
      if (Math.abs(customCoordinates.latitude) > 90) {
        newErrors.location = "Latitude must be between -90 and 90";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      current_location: {
        type: "Point",
        coordinates:
          locationMethod === "custom"
            ? [customCoordinates.longitude, customCoordinates.latitude]
            : formData.current_location.coordinates,
      },
    };

    try {
      await dispatch(createResponder(submitData)).unwrap();
      handleClose();
    } catch {
      // Error is handled by the slice
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      badgeNumber: "",
      agency: user?.agency?.name || "",
      agency_id: user?.agency?._id || "",
      status: "available",
      current_location: {
        type: "Point",
        coordinates: [-0.1826311, 5.6558318],
      },
    });
    setCustomCoordinates({
      longitude: -0.1826311,
      latitude: 5.6558318,
    });
    setLocationMethod("default");
    setErrors({});
    dispatch(clearCreateError());
    onOpenChange(false);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleCoordinateChange = (type, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCustomCoordinates((prev) => ({
        ...prev,
        [type]: numValue,
      }));
      // Clear location error
      if (errors.location) {
        setErrors((prev) => ({
          ...prev,
          location: null,
        }));
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setCustomCoordinates({ longitude, latitude });
          setLocationMethod("custom");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get current location. Please enter coordinates manually."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Responder</DialogTitle>
          <DialogDescription>
            Create a new responder account. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {createError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{createError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="John Doe"
                disabled={creating}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="badgeNumber">Badge Number</Label>
              <Input
                id="badgeNumber"
                value={formData.badgeNumber}
                onChange={(e) =>
                  handleInputChange("badgeNumber", e.target.value)
                }
                placeholder="FD001"
                disabled={creating}
              />
              {errors.badgeNumber && (
                <p className="text-xs text-red-600">{errors.badgeNumber}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john.doe@firestation.gov"
              disabled={creating}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Minimum 8 characters"
              disabled={creating}
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1234567890"
              disabled={creating}
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="agency">Agency</Label>
            <Input
              id="agency"
              value={formData.agency}
              onChange={(e) => handleInputChange("agency", e.target.value)}
              placeholder="Central Fire Department"
              disabled={creating}
            />
            {errors.agency && (
              <p className="text-xs text-red-600">{errors.agency}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
              disabled={creating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Location</Label>
            <Select
              value={locationMethod}
              onValueChange={setLocationMethod}
              disabled={creating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  Default Location (Accra)
                </SelectItem>
                <SelectItem value="custom">Custom Coordinates</SelectItem>
              </SelectContent>
            </Select>

            {locationMethod === "custom" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={creating}
                    className="flex-shrink-0"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Use Current
                  </Button>
                  <span className="text-xs text-muted-foreground flex items-center">
                    Or enter coordinates manually
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="longitude" className="text-xs">
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={customCoordinates.longitude}
                      onChange={(e) =>
                        handleCoordinateChange("longitude", e.target.value)
                      }
                      placeholder="-0.1826311"
                      disabled={creating}
                    />
                  </div>
                  <div>
                    <Label htmlFor="latitude" className="text-xs">
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={customCoordinates.latitude}
                      onChange={(e) =>
                        handleCoordinateChange("latitude", e.target.value)
                      }
                      placeholder="5.6558318"
                      disabled={creating}
                    />
                  </div>
                </div>
                {errors.location && (
                  <p className="text-xs text-red-600">{errors.location}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Responder"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResponderDialog;
