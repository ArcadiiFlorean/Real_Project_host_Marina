import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2024-11-20.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const body = await req.json();
    console.log("📦 Received body:", JSON.stringify(body));

    const { packageName, packageDescription, amount, orderId } = body;

    console.log("💰 Raw amount:", amount, "Type:", typeof amount);

    // Conversie explicită și validare
    let numericAmount: number;

    if (typeof amount === "string") {
      numericAmount = parseFloat(amount);
    } else if (typeof amount === "number") {
      numericAmount = amount;
    } else {
      throw new Error(
        `Invalid amount type: ${typeof amount}, value: ${amount}`
      );
    }

    console.log("💰 Numeric amount:", numericAmount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error(`Invalid numeric amount: ${numericAmount}`);
    }

    const amountInPence = Math.round(numericAmount * 100);
    console.log("💷 Amount in pence:", amountInPence);

    if (isNaN(amountInPence)) {
      throw new Error(
        `NaN in pence calculation: ${numericAmount} * 100 = ${amountInPence}`
      );
    }

    console.log("🏗️ Creating Stripe session with:", {
      packageName,
      amountInPence,
      orderId,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: packageName,
              description: packageDescription || "Consultație lactație",
            },
            unit_amount: amountInPence,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/booking?order_id=${orderId}`,
      cancel_url: `${req.headers.get("origin")}/#servicii`,
      metadata: {
        order_id: orderId,
      },
    });

    console.log("✅ Checkout session created:", session.id);

    // ⭐ MODIFICARE AICI - Adaugă URL-ul
    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url, // ⭐ ADAUGĂ ACEST RÂND
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("❌ Stack:", error.stack);

    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create checkout session",
        details: error.stack,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
