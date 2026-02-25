export const runtime = "nodejs";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    const origin = req.headers.get("origin");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Donativo Ministerio Cantos del Cielo",
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}?success=true`,
      cancel_url: `${origin}?canceled=true`,
    });
    return Response.json({ url: session.url });

} catch (error) {
  console.error("Stripe error:", error);
  return Response.json({ error: "Error creando sesión" }, { status: 500 });
}
}