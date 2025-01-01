import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, shippingAddress } = await req.json();

    if (!cartItems || !customer || !shippingAddress) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (total: number, item: any) => total + item.item.price * item.quantity,
      0
    );

    // Prepare the data for Flutterwave
    const paymentData = {
      tx_ref: `TX-${Date.now()}`,  // Unique transaction reference ID
      amount: totalAmount, // Total amount from cart items
      currency: "USD", // or use another supported currency like "USD", "GHS"
      redirect_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,  // Cancel URL
      email: customer.email,
      order_id: customer.clerkId,
      phone_number: customer.phone,
      payment_options: "card,mobile_money", // Enable mobile money and card payment
      shipping: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postal_code: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      shipping_method: "standard", // Can be "standard" or "express" or any other method
      order_items: cartItems.map((cartItem: any) => ({
        name: cartItem.item.title,
        quantity: cartItem.quantity,
        unit_price: cartItem.item.price,
      })),
    };

    // Make API request to Flutterwave
    const flutterwaveResponse = await fetch("https://api.flutterwave.com/v3/charges?type=payment-link", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const flutterwaveData = await flutterwaveResponse.json();

    // Check if the response was successful
    if (flutterwaveData.status === "success") {
      return NextResponse.json({
        paymentLink: flutterwaveData.data.link, // URL for customer to complete payment
      }, { headers: corsHeaders });
    } else {
      return new NextResponse("Failed to create payment link", { status: 500 });
    }
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
