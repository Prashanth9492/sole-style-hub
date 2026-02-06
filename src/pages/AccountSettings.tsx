import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { 
  User, 
  MapPin, 
  Package, 
  Edit, 
  Trash2, 
  Plus,
  Mail,
  Phone,
  Home,
  Lock,
  Camera,
  Save,
  X,
  Truck
} from 'lucide-react';
import { format } from 'date-fns';
import { Link, useSearchParams } from 'react-router-dom';

interface Address {
  _id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    productId?: string;
    productName?: string;
    productImage?: string;
    image?: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
    subtotal?: number;
  }>;
  finalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'profile';
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Address dialog states
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.displayName || '',
    phone: '',
    photoURL: user?.photoURL || ''
  });
  
  // Password change dialog
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Profile picture upload
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      setProfileForm({
        name: user.displayName || '',
        phone: '',
        photoURL: user.photoURL || ''
      });
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [addressesData, ordersData, userData] = await Promise.all([
        api.get('/addresses'),
        api.get('/orders/my-orders'),
        api.get('/users/profile').catch(() => null)
      ]);
      
      setAddresses(Array.isArray(addressesData) ? addressesData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      
      if (userData) {
        setProfileForm(prev => ({
          ...prev,
          name: userData.name || user?.displayName || '',
          phone: userData.phone || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load account data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.name.trim()) {
      toast({
        title: 'Error',
        description: 'Name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.put('/users/profile', {
        name: profileForm.name,
        phone: profileForm.phone
      });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      
      setIsEditingProfile(false);
      fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      
      setShowPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to change password',
        variant: 'destructive',
      });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size should be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;
          
          const response = await api.post('/cloudinary/upload', {
            image: base64Image,
            folder: 'profile-pictures'
          });

          setProfileForm(prev => ({
            ...prev,
            photoURL: response.url
          }));

          toast({
            title: 'Success',
            description: 'Profile picture uploaded successfully',
          });
        } catch (error) {
          console.error('Error uploading photo:', error);
          toast({
            title: 'Error',
            description: 'Failed to upload profile picture',
            variant: 'destructive',
          });
        } finally {
          setUploadingPhoto(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to read image file',
        variant: 'destructive',
      });
      setUploadingPhoto(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      name: user?.displayName || '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0
    });
    setShowAddressDialog(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    });
    setShowAddressDialog(true);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.addressLine1 || 
        !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress._id}`, addressForm);
        toast({
          title: 'Success',
          description: 'Address updated successfully',
        });
      } else {
        await api.post('/addresses', addressForm);
        toast({
          title: 'Success',
          description: 'Address added successfully',
        });
      }
      
      setShowAddressDialog(false);
      fetchUserData();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'Error',
        description: 'Failed to save address',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await api.delete(`/addresses/${id}`);
      toast({
        title: 'Success',
        description: 'Address deleted successfully',
      });
      fetchUserData();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete address',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await api.put(`/addresses/${id}`, { isDefault: true });
      toast({
        title: 'Success',
        description: 'Default address updated',
      });
      fetchUserData();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: 'Error',
        description: 'Failed to update default address',
        variant: 'destructive',
      });
    }
  };

  const getOrderStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Placed: 'bg-blue-500',
      Confirmed: 'bg-green-500',
      Shipped: 'bg-purple-500',
      Delivered: 'bg-green-600',
      Cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your account settings.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <Tabs defaultValue={tabParam} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </div>
                  {!isEditingProfile ? (
                    <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => {
                        setIsEditingProfile(false);
                        setProfileForm({
                          name: user?.displayName || '',
                          phone: '',
                          photoURL: user?.photoURL || ''
                        });
                      }}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profileForm.photoURL} alt={user?.displayName || 'User'} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditingProfile && (
                      <label 
                        htmlFor="photo-upload" 
                        className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-lg"
                      >
                        {uploadingPhoto ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={uploadingPhoto}
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    {isEditingProfile ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            placeholder="Enter your name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-xl mb-1">{profileForm.name || user?.displayName || 'User'}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                          <Mail className="w-4 h-4" />
                          {user?.email}
                        </p>
                        {profileForm.phone && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {profileForm.phone}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Account Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-muted-foreground">Account Created</Label>
                    <p className="font-medium mt-1">
                      {user?.metadata?.creationTime 
                        ? format(new Date(user.metadata.creationTime), 'PPP')
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Sign In</Label>
                    <p className="font-medium mt-1">
                      {user?.metadata?.lastSignInTime 
                        ? format(new Date(user.metadata.lastSignInTime), 'PPP')
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email Verification</Label>
                    <div className="mt-1">
                      {user?.emailVerified ? (
                        <Badge className="bg-green-500">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Not Verified</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Account Security</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1"
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Saved Addresses</h2>
                  <p className="text-gray-600">Manage your delivery addresses</p>
                </div>
                <Button onClick={handleAddAddress}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No addresses saved yet</p>
                    <Button onClick={handleAddAddress}>Add Your First Address</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <Card key={address._id} className={address.isDefault ? 'border-primary' : ''}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{address.name}</CardTitle>
                            <CardDescription>
                              <Phone className="w-3 h-3 inline mr-1" />
                              {address.phone}
                            </CardDescription>
                          </div>
                          {address.isDefault && (
                            <Badge>Default</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 mb-4">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                          <br />
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          {!address.isDefault && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSetDefaultAddress(address._id)}
                            >
                              Set as Default
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Order History</h2>
                <p className="text-gray-600">Track and manage your orders</p>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading orders...</div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <Link to="/">
                      <Button>Start Shopping</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-base">Order #{order.orderNumber}</h3>
                            <p className="text-xs text-gray-600">
                              {format(new Date(order.createdAt), 'PP')}
                            </p>
                            <div className="flex gap-2 mt-1.5">
                              <Badge className={`${getOrderStatusColor(order.orderStatus)} text-xs py-0`}>
                                {order.orderStatus}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1 text-xs py-0">
                                {order.paymentStatus === 'Paid' ? (
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                ) : (
                                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                )}
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Total</p>
                            <p className="font-bold text-lg">₹{order.finalAmount.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                        </div>

                        {/* Order Items Preview with Images */}
                        <div className="flex items-center gap-2 mb-3 overflow-x-auto py-1">
                          {order.items.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="flex-shrink-0">
                              <div className="w-16 h-16 rounded border overflow-hidden bg-gray-50 relative group">
                                {item.productImage || item.image ? (
                                  <img 
                                    src={item.productImage || item.image} 
                                    alt={item.productName || 'Product'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-1">
                                  <p className="text-white text-[10px] text-center font-medium leading-tight">
                                    {item.productName || 'Product'}
                                  </p>
                                </div>
                              </div>
                              <p className="text-[10px] text-center mt-0.5 text-gray-600">
                                ×{item.quantity}
                              </p>
                            </div>
                          ))}
                          {order.items.length > 5 && (
                            <div className="w-16 h-16 rounded border flex-shrink-0 flex items-center justify-center bg-gray-100 text-xs font-semibold text-gray-600">
                              +{order.items.length - 5}
                            </div>
                          )}
                        </div>

                        {/* Product Details List */}
                        <div className="border-t pt-2 mb-2">
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="font-medium text-gray-900 truncate max-w-[200px]">
                                    {item.productName || 'Product'}
                                  </span>
                                  {item.size && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                      {item.size}
                                    </Badge>
                                  )}
                                  {item.color && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                      {item.color}
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-gray-600 text-xs whitespace-nowrap ml-2">
                                  ₹{item.price} × {item.quantity} = <span className="font-semibold">₹{item.subtotal || (item.price * item.quantity)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Truck className="w-3.5 h-3.5" />
                            <span>
                              {order.orderStatus === 'Delivered' ? 'Delivered' : 
                               order.orderStatus === 'Shipped' ? 'In Transit' : 
                               order.orderStatus === 'Confirmed' ? 'Being Prepared' : 
                               'Processing'}
                            </span>
                          </div>
                          <Link to={`/orders/${order._id}`}>
                            <Button variant="outline" size="sm" className="h-8">
                              <Package className="w-3.5 h-3.5 mr-1.5" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={addressForm.name}
                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="col-span-2">
              <Label>Address Line 1 *</Label>
              <Input
                value={addressForm.addressLine1}
                onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                placeholder="House no., Street name"
              />
            </div>
            <div className="col-span-2">
              <Label>Address Line 2</Label>
              <Input
                value={addressForm.addressLine2}
                onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                placeholder="Landmark (optional)"
              />
            </div>
            <div>
              <Label>City *</Label>
              <Input
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                placeholder="Enter city"
              />
            </div>
            <div>
              <Label>State *</Label>
              <Input
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                placeholder="Enter state"
              />
            </div>
            <div>
              <Label>Pincode *</Label>
              <Input
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                placeholder="Enter pincode"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddressDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddress}>
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPasswordDialog(false);
                setPasswordForm({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default AccountSettings;
