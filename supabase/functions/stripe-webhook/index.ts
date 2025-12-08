import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("Stripe-Signature");
    const body = await req.text();

    let event: Stripe.Event;

    // Verify webhook signature
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature!,
        Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
        undefined,
        cryptoProvider
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ⭐ Folosește SERVICE ROLE KEY!
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("Event type:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Checkout completed:", session.id);
        console.log("Session metadata:", JSON.stringify(session.metadata));

        // ⭐ Caută după order_id din metadata (nu după session_id!)
        const orderId = session.metadata?.order_id;

        if (!orderId) {
          console.error("❌ No order_id found in metadata!");
          break;
        }

        console.log("✅ Found order_id in metadata:", orderId);

        // ⭐ Actualizează order după ID (nu după session_id!)
        const { data, error } = await supabaseClient
          .from("orders")
          .update({
            payment_status: "paid",
            stripe_session_id: session.id, // Salvează session_id acum
            customer_email:
              session.customer_details?.email || "unknown@email.com",
            customer_name: session.customer_details?.name || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId) // ⭐ CAUTĂ DUPĂ ID, NU DUPĂ SESSION_ID!
          .select();

        if (error) {
          console.error("❌ Error updating order:", error);
        } else if (data && data.length > 0) {
          console.log("✅ Order updated successfully to PAID:", data[0].id);
        } else {
          console.warn("⚠️ No order found with id:", orderId);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        console.log("Charge refunded:", charge.id);

        const { error } = await supabaseClient
          .from("orders")
          .update({
            payment_status: "refunded",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", charge.payment_intent as string);

        if (error) {
          console.error("Error updating refunded order:", error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
