import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Eye, Ban, CheckCircle, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  createdAt: string;
  orderHistory: any[];
  addresses: any[];
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [page, searchQuery]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/admin/customers?${params}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCustomers(data.customers || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (customer: Customer) => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/admin/customers/${customer._id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedCustomer(data);
      setCustomerOrders(data.orders || []);
      setShowDetailsDialog(true);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('Failed to fetch customer details');
    }
  };

  const handleBlockToggle = async (customer: Customer) => {
    const action = customer.isBlocked ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${action} this customer?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/admin/customers/${customer._id}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isBlocked: !customer.isBlocked })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(`Customer ${action}ed successfully`);
      fetchCustomers();
    } catch (error) {
      console.error(`Error ${action}ing customer:`, error);
      toast.error(`Failed to ${action} customer`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage customer accounts and view their activity</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No customers found</div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{customer.name}</h3>
                        {customer.isBlocked && (
                          <Badge variant="destructive">Blocked</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {format(new Date(customer.createdAt), 'PP')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(customer)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant={customer.isBlocked ? 'default' : 'destructive'}
                        size="sm"
                        onClick={() => handleBlockToggle(customer)}
                      >
                        {customer.isBlocked ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban className="h-4 w-4 mr-2" />
                            Block
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-semibold">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={selectedCustomer.isBlocked ? 'destructive' : 'default'}>
                        {selectedCustomer.isBlocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              <Card>
                <CardHeader>
                  <CardTitle>Saved Addresses</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCustomer.addresses?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomer.addresses.map((address: any, idx: number) => (
                        <div key={idx} className="border rounded p-3">
                          <p className="font-semibold">{address.name}</p>
                          <p className="text-sm">{address.addressLine1}</p>
                          {address.addressLine2 && <p className="text-sm">{address.addressLine2}</p>}
                          <p className="text-sm">{address.city}, {address.state} {address.pincode}</p>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                          {address.isDefault && <Badge className="mt-1">Default</Badge>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No saved addresses</p>
                  )}
                </CardContent>
              </Card>

              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle>Order History ({customerOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerOrders.length > 0 ? (
                    <div className="space-y-3">
                      {customerOrders.map((order: any) => (
                        <div key={order._id} className="border rounded p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(order.createdAt), 'PPp')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{order.finalAmount.toFixed(2)}</p>
                              <Badge>{order.orderStatus}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No orders yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
