
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddServiceModal from "@/components/AddServiceModal";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  type: string;
  expiryDate: string;
  productName?: string;
  status: 'active' | 'expiring' | 'expired';
  daysLeft: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));

    // Load sample data
    const sampleServices: Service[] = [
      {
        id: '1',
        name: 'Car Warranty',
        type: 'warranty',
        expiryDate: '2024-07-15',
        productName: 'Honda Civic',
        status: 'active',
        daysLeft: 45
      },
      {
        id: '2',
        name: 'Health Insurance',
        type: 'insurance',
        expiryDate: '2024-06-20',
        productName: 'Premium Plan',
        status: 'expiring',
        daysLeft: 15
      },
      {
        id: '3',
        name: 'Netflix Subscription',
        type: 'subscription',
        expiryDate: '2024-06-10',
        productName: 'Premium',
        status: 'expired',
        daysLeft: -5
      }
    ];
    setServices(sampleServices);
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expiring': return 'text-orange-600 bg-orange-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const addService = (newService: Omit<Service, 'id' | 'status' | 'daysLeft'>) => {
    const expiryDate = new Date(newService.expiryDate);
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'active' | 'expiring' | 'expired' = 'active';
    if (daysLeft < 0) status = 'expired';
    else if (daysLeft <= 30) status = 'expiring';

    const service: Service = {
      ...newService,
      id: Date.now().toString(),
      status,
      daysLeft
    };

    setServices(prev => [...prev, service]);
    toast({
      title: "Service Added!",
      description: `${newService.name} has been added successfully.`
    });
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Service Deleted",
      description: "Service has been removed from your list."
    });
  };

  const upcomingRenewals = services.filter(s => s.daysLeft > 0 && s.daysLeft <= 30).length;
  const nextDue = services
    .filter(s => s.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-accent p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
              <p className="text-xl text-muted-foreground">Manage your premium warranty experience</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/profile')}
                size="lg"
                className="glass-effect hover:text-white text-black  px-6"
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </Button>
              <div className="text-sm text-muted-foreground">
                Powered by <span className="font-bold text-primary">XyphX</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-0 premium-shadow hover-lift">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{services.length}</div>
                <div className="text-sm text-muted-foreground font-medium">Total Services</div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 premium-shadow hover-lift">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">{upcomingRenewals}</div>
                <div className="text-sm text-muted-foreground font-medium">Upcoming Renewals</div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 premium-shadow hover-lift">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {nextDue ? `${nextDue.daysLeft}` : '0'}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Days to Next Due</div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-0 premium-shadow hover-lift">
              <CardContent className="p-6">
                <div className="text-lg font-bold text-foreground mb-1">
                  {nextDue ? nextDue.name : 'No upcoming'}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Next Due Service</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Services Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Your Premium Services</h2>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="lg"
            className="gradient-primary text-black border border-white hover:text-white hover-lift px-8"
          > 
            <Plus className="w-5 h-5 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="glass-effect border-0 premium-shadow hover-lift">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground mb-2">
                      {service.name}
                    </CardTitle>
                    {service.productName && (
                      <p className="text-base text-muted-foreground font-medium">{service.productName}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-base text-muted-foreground">
                  <Calendar className="w-5 h-5 mr-3" />
                  Expires: {new Date(service.expiryDate).toLocaleDateString()}
                </div>
                
                <div className="text-base">
                  <span className={`font-bold ${
                    service.daysLeft < 0 ? 'text-red-600' : 
                    service.daysLeft <= 30 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {service.daysLeft < 0 ? 
                      `Expired ${Math.abs(service.daysLeft)} days ago` :
                      `${service.daysLeft} days left`
                    }
                  </span>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 font-semibold">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteService(service.id)}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <Card className="glass-effect border-0 premium-shadow">
            <CardContent className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-6">No services added yet</p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                size="lg"
                className="gradient-primary text-white hover-lift px-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addService}
      />
    </div>
  );
};

export default Dashboard;
