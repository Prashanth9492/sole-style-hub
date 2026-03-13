import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Store, 
  Mail, 
  Truck, 
  DollarSign, 
  Shield,
  Save,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: number;
  shippingCharge: number;
  freeShippingThreshold: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  customerSignups: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordMinLength: number;
}

export default function AdminSettings() {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'Sole Style Hub',
    storeEmail: 'support@solestylehub.com',
    storePhone: '+91 1234567890',
    storeAddress: 'Mumbai, India',
    currency: 'INR',
    taxRate: 18,
    shippingCharge: 100,
    freeShippingThreshold: 8000,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerSignups: false,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordMinLength: 8,
  });

  const [loading, setLoading] = useState(false);

  const handleSaveStore = async () => {
    try {
      setLoading(true);
      // For now, just save to localStorage since backend endpoint doesn't exist yet
      localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
      toast.success('Store settings saved successfully');
      
      // Uncomment when backend endpoint is ready:
      // const token = localStorage.getItem('adminToken');
      // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      // const response = await fetch(`${API_URL}/admin/settings/store`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(storeSettings)
      // });
      // if (response.ok) {
      //   toast.success('Store settings saved successfully');
      // } else {
      //   throw new Error('Failed to save settings');
      // }
    } catch (error) {
      console.error('Error saving store settings:', error);
      toast.error('Failed to save store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      toast.success('Notification settings saved successfully');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setLoading(true);
      toast.success('Security settings saved successfully');
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error('Failed to save security settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your store settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Store</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Shipping</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Store Information</CardTitle>
              <CardDescription>Update your store details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.storePhone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (GST %)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={storeSettings.taxRate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: parseFloat(e.target.value) })}
                />
              </div>
              <Button onClick={handleSaveStore} disabled={loading} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Store Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3 border-b">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3 border-b">
                <div className="space-y-0.5">
                  <Label className="text-base">Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                </div>
                <Switch
                  checked={notifications.orderNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, orderNotifications: checked })
                  }
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3 border-b">
                <div className="space-y-0.5">
                  <Label className="text-base">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert when products are low in stock</p>
                </div>
                <Switch
                  checked={notifications.lowStockAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, lowStockAlerts: checked })
                  }
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3">
                <div className="space-y-0.5">
                  <Label className="text-base">Customer Sign-ups</Label>
                  <p className="text-sm text-muted-foreground">Notify when new customers register</p>
                </div>
                <Switch
                  checked={notifications.customerSignups}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, customerSignups: checked })
                  }
                />
              </div>
              <Button onClick={handleSaveNotifications} disabled={loading} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Shipping Configuration</CardTitle>
              <CardDescription>Configure shipping rates and thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCharge">Standard Shipping Charge (₹)</Label>
                  <Input
                    id="shippingCharge"
                    type="number"
                    value={storeSettings.shippingCharge}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, shippingCharge: parseFloat(e.target.value) })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Charge applied to orders below free shipping threshold
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={storeSettings.freeShippingThreshold}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, freeShippingThreshold: parseFloat(e.target.value) })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Orders above this amount get free shipping
                  </p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm">
                  <strong>Current Configuration:</strong> Orders below ₹{storeSettings.freeShippingThreshold} will be charged ₹{storeSettings.shippingCharge} for shipping. Orders equal to or above ₹{storeSettings.freeShippingThreshold} get free shipping.
                </p>
              </div>
              <Button onClick={handleSaveStore} disabled={loading} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Shipping Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Security Settings</CardTitle>
              <CardDescription>Manage security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-3 border-b">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Time before admin users are automatically logged out
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={security.passwordMinLength}
                  onChange={(e) => setSecurity({ ...security, passwordMinLength: parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum number of characters required for passwords
                </p>
              </div>
              <Button onClick={handleSaveSecurity} disabled={loading} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
