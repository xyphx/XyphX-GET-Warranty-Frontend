import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
import { editService } from "@/services/dashboardService";
import { userDetails } from "@/services/detailsService";
import { useToast } from "@/hooks/use-toast";

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  serviceId: string | null;
  refreshServices: () => void;
}

const serviceTypes = [
  { value: "warranty", label: "Warranty" },
  { value: "insurance", label: "Insurance" },
  { value: "subscription", label: "Subscription" },
  { value: "pollution", label: "Pollution Check" },
  { value: "bill", label: "Bill/Utility" },
  { value: "maintenance", label: "Maintenance" },
  { value: "license", label: "License/Permit" },
  { value: "other", label: "Other" },
];

const EditServiceModal = ({
  isOpen,
  onClose,
  userId,
  serviceId,
  refreshServices,
}: EditServiceModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    expiryDate: "",
    productName: "",
    status: "active",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // ✅ Load the correct service using the serviceId
  useEffect(() => {
    const loadService = async () => {
      if (!serviceId) return;
      try {
        const res = await userDetails();
        const allServices = res.services || [];

        const s = allServices.find((srv: any) => srv.id === serviceId);

        if (!s) {
          toast({
            title: "Service not found",
            description: "The selected service could not be found.",
            variant: "destructive",
          });
          return;
        }

        setFormData({
          name: s.name || "",
          type: s.type || "",
          expiryDate: s.nextBillingDate || "",
          productName: s.planType || "",
          status: s.status || "active",
          notes: s.notes || "",
        });
      } catch (error) {
        console.error("Failed to fetch service:", error);
        toast({
          title: "Error loading service",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };

    if (isOpen) {
      loadService();
    }
  }, [isOpen, serviceId, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getFieldLabels = () => {
    switch (formData.type) {
      case "warranty":
        return {
          name: "Warranty Name",
          productName: "Product/Device Name",
          expiryDate: "Warranty Expiry Date",
        };
      case "insurance":
        return {
          name: "Insurance Type",
          productName: "Policy Name/Number",
          expiryDate: "Renewal Date",
        };
      case "subscription":
        return {
          name: "Service Name",
          productName: "Plan Type",
          expiryDate: "Next Billing Date",
        };
      case "pollution":
        return {
          name: "Vehicle Registration",
          productName: "Vehicle Model",
          expiryDate: "Next PUC Date",
        };
      case "bill":
        return {
          name: "Bill Type",
          productName: "Account/Connection Number",
          expiryDate: "Due Date",
        };
      default:
        return {
          name: "Service Name",
          productName: "Description",
          expiryDate: "Expiry/Due Date",
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.expiryDate) return;

    setLoading(true);
    try {
      await editService(userId, serviceId!, {
        name: formData.name,
        type: formData.type,
        nextBillingDate: formData.expiryDate,
        planType: formData.productName || undefined,
        status: formData.status,
        notes: formData.notes || undefined,
      });

      toast({
        title: "Service Updated!",
        description: `${formData.name} was edited successfully.`,
      });

      refreshServices();
      onClose();
    } catch (error: any) {
      console.error("Edit error:", error);
      toast({
        title: "Edit Failed",
        description:
          error?.response?.data?.message || "Could not update the service.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const labels = getFieldLabels();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Service Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              required
            >
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.type && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">{labels.name}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={`Enter ${labels.name.toLowerCase()}`}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="bg-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">{labels.productName}</Label>
                <Input
                  id="productName"
                  type="text"
                  placeholder={`Enter ${labels.productName.toLowerCase()}`}
                  value={formData.productName}
                  onChange={(e) =>
                    handleInputChange("productName", e.target.value)
                  }
                  className="bg-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">{labels.expiryDate}</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  required
                  className="bg-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value)
                  }
                >
                  <SelectTrigger className="bg-white/50">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Any additional info"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="bg-white/50"
                />
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={
                !formData.name || !formData.type || !formData.expiryDate || loading
              }
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceModal;
