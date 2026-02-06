import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import ReviewDialog from '@/components/product/ReviewDialog';
import { api } from '@/lib/api';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  CreditCard,
  ArrowLeft,
  Star
} from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  totalAmount: number;
  discount: number;
  shippingCharges: number;
  taxAmount: number;
  finalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber?: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    comment?: string;
  }>;
  createdAt: string;
  estimatedDelivery?: string;
}

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrderDetails();
    checkReviewedProducts();
  }, [orderId]);

  const checkReviewedProducts = async () => {
    try {
      const response = await api.get(`/reviews/user-reviews/${orderId}`);
      setReviewedProducts(new Set(response.reviewedProductIds));
    } catch (err) {
      console.error('Error checking reviewed products:', err);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch order details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReviewDialog = (product: any) => {
    setSelectedProduct(product);
    setReviewDialogOpen(true);
  };

  const handleReviewSubmitted = () => {
    setReviewDialogOpen(false);
    checkReviewedProducts();
    fetchOrderDetails();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PLACED: 'bg-blue-500',
      CONFIRMED: 'bg-green-500',
      PROCESSING: 'bg-yellow-500',
      SHIPPED: 'bg-purple-500',
      DELIVERED: 'bg-green-600',
      CANCELLED: 'bg-red-500',
      RETURNED: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      PENDING: 'secondary',
      PAID: 'default',
      FAILED: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5" />;
      case 'PROCESSING':
        return <Package className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
          <Link to="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link to="/orders" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Badge variant={getPaymentStatusBadge(order.paymentStatus)} className="text-sm">
              {order.paymentStatus}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(order.orderStatus)}
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status Timeline */}
                  <div className="relative">
                    {order.statusHistory.map((status, index) => (
                      <div key={index} className="flex gap-4 pb-8 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)}`} />
                          {index < order.statusHistory.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{status.status.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(status.timestamp).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {status.comment && (
                            <p className="text-sm text-gray-500 mt-1">{status.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                      <p className="text-blue-700 font-mono">{order.trackingNumber}</p>
                    </div>
                  )}

                  {order.estimatedDelivery && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-green-900">Estimated Delivery</p>
                      <p className="text-green-700">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items ({order.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.productName}</h3>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          
                          {/* Review Button */}
                          {order.orderStatus === 'DELIVERED' && (
                            <div className="mt-2">
                              {reviewedProducts.has(item.productId) ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  <Star className="w-3 h-3 mr-1 fill-green-600" />
                                  Reviewed
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenReviewDialog({
                                    id: item.productId,
                                    name: item.productName,
                                    image: item.productImage
                                  })}
                                  className="flex items-center gap-1"
                                >
                                  <Star className="w-4 h-4" />
                                  Write Review
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.subtotal}</p>
                          <p className="text-sm text-gray-600">₹{item.price} each</p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{order.shippingAddress.name}</p>
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.pincode}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={getPaymentStatusBadge(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {order.shippingCharges === 0 ? 'FREE' : `₹${order.shippingCharges.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (GST)</span>
                    <span>₹{order.taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{order.finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Download Invoice
              </Button>
              {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                <Button variant="destructive" className="w-full">
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Review Dialog */}
      {selectedProduct && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          orderId={orderId!}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          productImage={selectedProduct.image}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
      
      <Footer />
    </>
  );
};

export default OrderDetailsPage;
