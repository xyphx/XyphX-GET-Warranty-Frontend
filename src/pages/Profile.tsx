// Profile.tsx
import { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar";
import { ArrowLeft, Camera, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { userDetails } from "@/services/detailsService";
import { updateProfile, ProfileData } from "@/services/profileService";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    profile: null,
    name: '',
    phone: '',
    location: '',
    jobTitle: '',
    company: '',
    website: '',
    imageUrl: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userDetails();
        setUser(data);
        setProfileData({
          profile: data.profile || null,
          name: data.name || '',
          phone: data.profile?.phone || '',
          location: data.profile?.location || '',
          jobTitle: data.profile?.jobTitle || '',
          company: data.profile?.company || '',
          website: data.profile?.website || '',
          imageUrl: data.profile?.imageUrl || ''
        });
      } catch (err) {
        toast({
          title: "Error fetching user details",
          variant: "destructive"
        });
        navigate('/');
      }
    };
    fetchData();
  }, [navigate, toast]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        setProfileData(prev => ({ ...prev, imageUrl }));
      } else {
        toast({
          title: "Image upload failed",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(profileData);
      toast({ title: "Profile Updated!" });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-accent p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
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
          <Card className="glass-effect border-0 premium-shadow">
            <CardHeader className="text-center pb-6">
              <div className="relative mx-auto mb-4">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src={profileData.imageUrl} />
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
              <p className="text-muted-foreground">{profileData.jobTitle || 'Add your job title'}</p>
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

          <div className="lg:col-span-2 space-y-4">
            <Card className="glass-effect border-0 premium-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["name", "email", "phone", "location"].map(field => (
                    <div className="space-y-2" key={field}>
                      <Label htmlFor={field} className="text-sm font-semibold">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        value={profileData[field as keyof ProfileData]}
                        onChange={(e) => handleInputChange(field as keyof ProfileData, e.target.value)}
                        disabled={!isEditing}
                        placeholder={`Enter ${field}`}
                        className="bg-white/80 backdrop-blur-sm border-2 h-12"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 premium-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["jobTitle", "company", "website"].map(field => (
                    <div className={`space-y-2 ${field === "website" ? "md:col-span-2" : ""}`} key={field}>
                      <Label htmlFor={field} className="text-sm font-semibold">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        value={profileData[field as keyof ProfileData]}
                        onChange={(e) => handleInputChange(field as keyof ProfileData, e.target.value)}
                        disabled={!isEditing}
                        placeholder={`Enter ${field}`}
                        className="bg-white/80 backdrop-blur-sm border-2 h-12"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
