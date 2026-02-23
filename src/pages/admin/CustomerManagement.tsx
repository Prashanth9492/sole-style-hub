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
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Customer Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage customer accounts and view their activity</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex gap-3 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
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
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-4 w-4 md:h-5 md:w-5" />
            Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No customers found</div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="border rounded-lg p-3 md:p-4 hover:bg-accent/50 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 md:gap-4">
                    <div className="space-y-1.5 md:space-y-1 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-semibold text-sm md:text-base truncate">{customer.name}</h3>
                        {customer.isBlocked && (
                          <Badge variant="destructive" className="text-xs w-fit">Blocked</Badge>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{customer.email}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{customer.phone}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {format(new Date(customer.createdAt), 'PP')}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2 justify-end lg:justify-start flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(customer)}
                        className="flex-1 sm:flex-initial text-xs md:text-sm h-8 md:h-9"
                      >
                        <Eye className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      <Button
                        variant={customer.isBlocked ? 'default' : 'destructive'}
                        size="sm"
                        onClick={() => handleBlockToggle(customer)}
                        className="flex-1 sm:flex-initial text-xs md:text-sm h-8 md:h-9"
                      >
                        {customer.isBlocked ? (
                          <>
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                            <span className="hidden sm:inline">Unblock</span>
                            <span className="sm:hidden">Unblock</span>
                          </>
                        ) : (
                          <>
                            <Ban className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                            <span className="hidden sm:inline">Block</span>
                            <span className="sm:hidden">Block</span>
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
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4 md:mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              <span className="flex items-center px-3 md:px-4 text-sm md:text-base">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 md:space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold text-sm md:text-base">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold text-sm md:text-base break-all">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Phone</p>
                      <p className="font-semibold text-sm md:text-base">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Status</p>
                      <Badge variant={selectedCustomer.isBlocked ? 'destructive' : 'default'} className="text-xs w-fit">
                        {selectedCustomer.isBlocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Saved Addresses</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCustomer.addresses?.length > 0 ? (
                    <div className="space-y-2 md:space-y-3">
                      {selectedCustomer.addresses.map((address: any, idx: number) => (
                        <div key={idx} className="border rounded p-2 md:p-3">
                          <p className="font-semibold text-sm md:text-base">{address.name}</p>
                          <p className="text-xs md:text-sm">{address.addressLine1}</p>
                          {address.addressLine2 && <p className="text-xs md:text-sm">{address.addressLine2}</p>}
                          <p className="text-xs md:text-sm">{address.city}, {address.state} {address.pincode}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{address.phone}</p>
                          {address.isDefault && <Badge className="mt-1 text-xs">Default</Badge>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No saved addresses</p>
                  )}
                </CardContent>
              </Card>

              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Order History ({customerOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerOrders.length > 0 ? (
                    <div className="space-y-2 md:space-y-3">
                      {customerOrders.map((order: any) => (
                        <div key={order._id} className="border rounded p-2 md:p-3">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm md:text-base truncate">{order.orderNumber}</p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                {format(new Date(order.createdAt), 'PPp')}
                              </p>
                            </div>
                            <div className="text-left sm:text-right flex-shrink-0">
                              <p className="font-semibold text-sm md:text-base">₹{order.finalAmount.toFixed(2)}</p>
                              <Badge className="text-xs mt-1">{order.orderStatus}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No orders yet</p>
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
