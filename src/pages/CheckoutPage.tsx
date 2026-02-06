import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import RazorpayCheckout from '@/components/payment/RazorpayCheckout';
import { api } from '@/lib/api';

interface Address {
  _id?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const [newAddress, setNewAddress] = useState<Address>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCharges = subtotal > 1000 ? 0 : 50;
  const taxAmount = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCharges + taxAmount;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [user, navigate]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      // API returns the addresses array directly
      const addressesData = Array.isArray(response) ? response : [];
      setAddresses(addressesData);
      
      // Select default address
      const defaultAddr = addressesData.find((addr: Address) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (addressesData.length > 0) {
        setSelectedAddress(addressesData[0]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]); // Ensure addresses is always an array
    }
  };

  const handleAddNewAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.addressLine1 || 
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast({
        title: 'Error',
        description: 'Please fill all address fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await api.post('/addresses', newAddress);
      // Response includes the new address
      const newAddr = response.address || response;
      setAddresses([...addresses, newAddr]);
      setSelectedAddress(newAddr);
      setShowNewAddressForm(false);
      setNewAddress({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      });
      toast({
        title: 'Success',
        description: 'Address added successfully',
      });
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: 'Error',
        description: 'Failed to add address',
        variant: 'destructive',
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: 'Error',
        description: 'Please select a delivery address',
        variant: 'destructive',
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Error',
        description: 'Your cart is empty',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          size: item.selectedSize,
          color: item.selectedColor,
          quantity: item.quantity,
          price: item.product.price,
          discount: 0,
        })),
        shippingAddress: selectedAddress,
        paymentMethod,
        totalAmount: subtotal,
        discount: 0,
        shippingCharges,
        taxAmount,
      };

      const response = await api.post('/orders', orderData);

      if (paymentMethod === 'ONLINE' && response.razorpayOrder) {
        // Store order details for payment
        setRazorpayOrder(response.razorpayOrder);
        setPendingOrderId(response.orderId);
      } else {
        // COD order placed successfully
        clearCart();
        toast({
          title: 'Order Placed',
          description: `Order #${response.orderNumber} placed successfully!`,
        });
        navigate(`/orders/${response.orderId}`);
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (
    paymentId: string,
    orderId: string,
    signature: string
  ) => {
    try {
      // Verify payment with backend
      await api.post('/payment/verify', {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        orderId: pendingOrderId,
      });

      clearCart();
      navigate(`/orders/${pendingOrderId}`);
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    // Order is created but payment failed
    // User can retry payment from order details page
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Address & Payment */}
        <div className="md:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedAddress?._id}
                onValueChange={(id) => {
                  const addr = addresses.find(a => a._id === id);
                  if (addr) setSelectedAddress(addr);
                }}
              >
                {addresses.map((addr) => (
                  <div key={addr._id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value={addr._id!} id={addr._id} />
                    <Label htmlFor={addr._id} className="flex-1 cursor-pointer">
                      <div className="font-semibold">{addr.name}</div>
                      <div className="text-sm text-gray-600">{addr.phone}</div>
                      <div className="text-sm text-gray-600">
                        {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {!showNewAddressForm && (
                <Button
                  variant="outline"
                  onClick={() => setShowNewAddressForm(true)}
                  className="w-full"
                >
                  + Add New Address
                </Button>
              )}

              {showNewAddressForm && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">New Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    />
                    <Input
                      placeholder="Phone Number"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    />
                  </div>
                  <Input
                    placeholder="Address Line 1"
                    value={newAddress.addressLine1}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  />
                  <Input
                    placeholder="Address Line 2 (optional)"
                    value={newAddress.addressLine2 || ''}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                    <Input
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                    <Input
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddNewAddress}>Save Address</Button>
                    <Button variant="outline" onClick={() => setShowNewAddressForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: any) => setPaymentMethod(value)}
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Cash on Delivery (COD)</div>
                    <div className="text-sm text-gray-600">Pay when you receive</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="ONLINE" id="online" />
                  <Label htmlFor="online" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Online Payment</div>
                    <div className="text-sm text-gray-600">
                      Pay via UPI, Card, Netbanking (Powered by Razorpay)
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingCharges === 0 ? 'FREE' : `₹${shippingCharges}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (GST 18%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {razorpayOrder ? (
                <RazorpayCheckout
                  orderId={pendingOrderId!}
                  amount={total}
                  currency={razorpayOrder.currency}
                  razorpayOrderId={razorpayOrder.id}
                  razorpayKey={razorpayOrder.key}
                  userDetails={{
                    name: selectedAddress?.name || user.email,
                    email: user.email,
                    contact: selectedAddress?.phone || '',
                  }}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || !selectedAddress}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>
              )}

              <p className="text-xs text-gray-500 text-center">
                By placing order, you agree to our Terms & Conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
