
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    job: '',
    company: '',
    bio: '',
    location: '',
    website: '',
    profileImage: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load existing profile data or set defaults
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    } else {
      setProfileData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: '',
        job: '',
        company: '',
        bio: '',
        location: '',
        website: '',
        profileImage: ''
      });
    }
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profileImage: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save profile data
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // Update user data
    const updatedUser = { ...user, name: profileData.name, email: profileData.email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Handle password change
    if (newPassword && newPassword === confirmPassword) {
      toast({
        title: "Profile Updated!",
        description: "Your profile and password have been updated successfully."
      });
    } else if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    } else {
      toast({
        title: "Profile Updated!",
        description: "Your profile has been updated successfully."
      });
    }
    
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCancel = () => {
    // Reset to original data
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-accent p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="lg"
              className="glass-effect border-2"
            >
              <ArrowLeft className="h-5 mr-2" />
            </Button>
            <h1 className="md:text-4xl text-xl font-bold text-foreground">Profile Settings</h1>
          </div>
  
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image & Basic Info */}
          <Card className="glass-effect border-0 premium-shadow">
            <CardHeader className="text-center pb-6">
              <div className="relative mx-auto mb-4">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src={profileData.profileImage} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover-lift">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">{profileData.name}</CardTitle>
              <p className="text-muted-foreground">{profileData.job || 'Add your job title'}</p>
              <p className="text-sm text-muted-foreground">{profileData.location || 'Add your location'}</p>
            </CardHeader>
            
            <CardContent className="text-center">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full gradient-primary text-black border-2 hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={handleSave}
                    className="w-full gradient-primary text-white hover-lift"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass-effect border-0 premium-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/80 backdrop-blur-sm border-2 h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/80 backdrop-blur-sm border-2 h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Add your phone number"
                      className="bg-white/80 backdrop-blur-sm border-2 h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-semibold">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder="City, Country"
                      className="bg-white/80 backdrop-blur-sm border-2 h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="glass-effect border-0 premium-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="job" className="text-sm font-semibold">Job Title</Label>
                    <Input
                      id="job"
                      value={profileData.job}
                      onChange={(e) => handleInputChange('job', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Your job title"
                      className="bg-white/80 backdrop-blur-sm border-2 h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Your company"
                      className="bg-white/80 backdrop-blur-sm border-2 h-12"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="website" className="text-sm font-semibold">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://your-website.com"
                      className="bg-white/80 backdrop-blur-sm border-2 h-12"
                    />
                  </div>
                  
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            {isEditing && (
              <Card className="glass-effect border-0 premium-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Change Password</CardTitle>
                  <p className="text-muted-foreground">Leave blank to keep current password</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-semibold">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="bg-white/80 backdrop-blur-sm border-2 h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="bg-white/80 backdrop-blur-sm border-2 h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
