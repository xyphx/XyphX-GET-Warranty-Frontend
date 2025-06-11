
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: {
    name: string;
    type: string;
    expiryDate: string;
    productName?: string;
  }) => void;
}

const serviceTypes = [
  { value: 'warranty', label: 'Warranty' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'pollution', label: 'Pollution Check' },
  { value: 'bill', label: 'Bill/Utility' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'license', label: 'License/Permit' },
  { value: 'other', label: 'Other' }
];

const AddServiceModal = ({ isOpen, onClose, onAdd }: AddServiceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    expiryDate: '',
    productName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.expiryDate) return;

    onAdd({
      name: formData.name,
      type: formData.type,
      expiryDate: formData.expiryDate,
      productName: formData.productName || undefined
    });

    // Reset form
    setFormData({
      name: '',
      type: '',
      expiryDate: '',
      productName: ''
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getFieldLabels = () => {
    switch (formData.type) {
      case 'warranty':
        return {
          name: 'Warranty Name',
          productName: 'Product/Device Name',
          expiryDate: 'Warranty Expiry Date'
        };
      case 'insurance':
        return {
          name: 'Insurance Type',
          productName: 'Policy Name/Number',
          expiryDate: 'Renewal Date'
        };
      case 'subscription':
        return {
          name: 'Service Name',
          productName: 'Plan Type',
          expiryDate: 'Next Billing Date'
        };
      case 'pollution':
        return {
          name: 'Vehicle Registration',
          productName: 'Vehicle Model',
          expiryDate: 'Next PUC Date'
        };
      case 'bill':
        return {
          name: 'Bill Type',
          productName: 'Account/Connection Number',
          expiryDate: 'Due Date'
        };
      default:
        return {
          name: 'Service Name',
          productName: 'Description',
          expiryDate: 'Expiry/Due Date'
        };
    }
  };

  const labels = getFieldLabels();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add New Service
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Service Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
              required
            >
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Select service type" />
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
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  className="bg-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">{labels.expiryDate}</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  required
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!formData.name || !formData.type || !formData.expiryDate}
            >
              Add Service
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
