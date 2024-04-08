"use client";

import axios from "axios";

const PricingPage = () => {
  return (
    <section>
      <div className="product">
        <div className="description">
          <h3>Starter plan</h3>
          <h5>$20.00 / month</h5>
        </div>
      </div>
      <form
        action="/api/checkout-session"
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault();
          const { data } = await axios.post("/api/checkout-session", {
            lookup_key: process.env.NEXT_PUBLIC_STRIPE_STANDARD_LOOKUP_KEY,
          });

          window.location = data;
        }}
      >
        {/* Add a hidden field with the lookup_key of your Price */}
        <button id="checkout-and-portal-button" type="submit">
          Checkout
        </button>
      </form>
    </section>
  );
};

export default PricingPage;
