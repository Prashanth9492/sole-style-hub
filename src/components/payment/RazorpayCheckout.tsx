import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayKey: string;
  userDetails: {
    name: string;
    email: string;
    contact: string;
  };
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onFailure: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  orderId,
  amount,
  currency,
  razorpayOrderId,
  razorpayKey,
  userDetails,
  onSuccess,
  onFailure
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to load payment gateway. Please refresh the page.',
        variant: 'destructive',
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast({
        title: 'Please wait',
        description: 'Payment gateway is loading...',
      });
      return;
    }

    setIsLoading(true);

    const options = {
      key: razorpayKey,
      amount: amount * 100, // Convert to paise
      currency: currency,
      name: 'Sole Style Hub',
      description: `Order #${orderId}`,
      order_id: razorpayOrderId,
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact,
      },
      theme: {
        color: '#000000',
      },
      handler: async function (response: any) {
        try {
          // Payment successful
          await onSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
          
          toast({
            title: 'Payment Successful',
            description: 'Your order has been placed successfully!',
          });
        } catch (error) {
          console.error('Payment verification failed:', error);
          toast({
            title: 'Payment Verification Failed',
            description: 'Please contact support with your payment ID.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
          toast({
            title: 'Payment Cancelled',
            description: 'You cancelled the payment.',
          });
        },
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        setIsLoading(false);
        onFailure(response.error);
        toast({
          title: 'Payment Failed',
          description: response.error.description || 'Payment failed. Please try again.',
          variant: 'destructive',
        });
      });

      razorpay.open();
    } catch (error) {
      setIsLoading(false);
      console.error('Razorpay error:', error);
      toast({
        title: 'Error',
        description: 'Failed to open payment gateway',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || !scriptLoaded}
      className="w-full"
      size="lg"
    >
      {isLoading ? 'Processing...' : scriptLoaded ? 'Pay Now' : 'Loading Payment Gateway...'}
    </Button>
  );
};

export default RazorpayCheckout;
