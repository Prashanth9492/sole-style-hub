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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Home
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

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
  items: any[];
  finalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
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
    phone: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [addressesData, ordersData] = await Promise.all([
        api.get('/addresses'),
        api.get('/orders/my-orders')
      ]);
      
      setAddresses(Array.isArray(addressesData) ? addressesData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
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

        <Tabs defaultValue="profile" className="space-y-6">
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
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.displayName || 'User'}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Account Created</Label>
                    <p className="font-medium">
                      {user.metadata?.creationTime 
                        ? format(new Date(user.metadata.creationTime), 'PPP')
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Sign In</Label>
                    <p className="font-medium">
                      {user.metadata?.lastSignInTime 
                        ? format(new Date(user.metadata.lastSignInTime), 'PPP')
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email Verified</Label>
                    <p className="font-medium">
                      {user.emailVerified ? (
                        <Badge className="bg-green-500">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Not Verified</Badge>
                      )}
                    </p>
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
                    <Card key={order._id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {format(new Date(order.createdAt), 'PPP')}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getOrderStatusColor(order.orderStatus)}>
                              {order.orderStatus}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">
                              {order.items.length} items
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          {order.items.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="w-16 h-16 rounded border overflow-hidden bg-gray-100">
                              {item.productImage && (
                                <img 
                                  src={item.productImage} 
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-16 h-16 rounded border flex items-center justify-center bg-gray-100 text-sm font-medium">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                          <div>
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="font-bold text-lg">₹{order.finalAmount.toFixed(2)}</p>
                          </div>
                          <Link to={`/orders/${order._id}`}>
                            <Button variant="outline">View Details</Button>
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

      <Footer />
    </>
  );
};

export default AccountSettings;
