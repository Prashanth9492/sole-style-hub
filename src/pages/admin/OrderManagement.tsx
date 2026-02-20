import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Eye, RefreshCw, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  _id: string;
  orderNumber: string;
  userName: string;
  userEmail: string;
  finalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
  shippingAddress: any;
}

const statusColors: Record<string, string> = {
  Placed: 'bg-blue-500',
  Confirmed: 'bg-indigo-500',
  Packed: 'bg-purple-500',
  Shipped: 'bg-yellow-500',
  'Out for Delivery': 'bg-orange-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
  Returned: 'bg-gray-500',
};

const paymentStatusColors: Record<string, string> = {
  Pending: 'bg-yellow-500',
  Paid: 'bg-green-500',
  Failed: 'bg-red-500',
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/admin/orders?${params}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusComment('');
    setTrackingNumber('');
    setShowUpdateDialog(true);
  };

  const submitStatusUpdate = async () => {
    if (!selectedOrder) return;

    // Prevent updating cancelled orders
    if (selectedOrder.orderStatus === 'Cancelled') {
      alert('Cannot update status of cancelled orders');
      setShowUpdateDialog(false);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/admin/orders/${selectedOrder._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          comment: statusComment,
          trackingNumber: trackingNumber || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to update order status');
      }

      setShowUpdateDialog(false);
      fetchOrders();
      alert('Order status updated successfully');
    } catch (error: any) {
      console.error('Error updating order status:', error);
      alert(error.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <Button onClick={fetchOrders}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by order number, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="Placed">Placed</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Packed">Packed</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No orders found</div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4 hover:bg-accent/50 transition">
                  <div className="flex items-start justify-between gap-4">
                    {/* Product Images */}
                    <div className="flex gap-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border bg-gray-100">
                          {item.productImage ? (
                            <img 
                              src={item.productImage} 
                              alt={item.productName || 'Product'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/64?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 rounded border flex items-center justify-center bg-muted text-sm font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{order.orderNumber}</h3>
                        <Badge className={statusColors[order.orderStatus]}>
                          {order.orderStatus}
                        </Badge>
                        <Badge className={paymentStatusColors[order.paymentStatus]}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.userName} • {order.userEmail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'PPp')}
                      </p>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{order.finalAmount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(order)}
                          disabled={order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered'}
                          title={order.orderStatus === 'Cancelled' ? 'Cannot update cancelled orders' : order.orderStatus === 'Delivered' ? 'Order already delivered' : 'Update order status'}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Update
                        </Button>
                      </div>
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

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Order Number</Label>
                  <p className="font-semibold">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="flex gap-2 mt-1">
                    <Badge className={statusColors[selectedOrder.orderStatus]}>
                      {selectedOrder.orderStatus}
                    </Badge>
                    <Badge className={paymentStatusColors[selectedOrder.paymentStatus]}>
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Customer</Label>
                <p>{selectedOrder.userName}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.userEmail}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Shipping Address</Label>
                <p>{selectedOrder.shippingAddress.name}</p>
                <p>{selectedOrder.shippingAddress.addressLine1}</p>
                {selectedOrder.shippingAddress.addressLine2 && (
                  <p>{selectedOrder.shippingAddress.addressLine2}</p>
                )}
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                <p>{selectedOrder.shippingAddress.phone}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Order Items</Label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-semibold">₹{item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{selectedOrder.finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          {selectedOrder?.orderStatus === 'Cancelled' ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                <p className="font-semibold">Cannot Update Cancelled Order</p>
                <p className="text-sm mt-1">This order has been cancelled and cannot be modified.</p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setShowUpdateDialog(false)}>Close</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Placed">Placed</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Packed">Packed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tracking Number (Optional)</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>

              <div>
                <Label>Comment (Optional)</Label>
                <Textarea
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="Add a comment about this status update"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={submitStatusUpdate}>Update Status</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
