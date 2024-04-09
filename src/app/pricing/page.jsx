"use client";

import { StripePricingTable } from "@/components/PageComponents/Pricing/BIllingTable";
import CheckoutForm from "@/components/Wrappers/Client/CheckoutForm";
import axios from "axios";

const PricingPage = () => {
  return (
    <section>
      <div className="product">
        <div className="description">
          <h3>Starter plan</h3>
          <h5>$20.00 / month</h5>
        </div>

        <CheckoutForm
          lookup_key={process.env.NEXT_PUBLIC_STRIPE_STANDARD_LOOKUP_KEY}
        />
      </div>

      <StripePricingTable />
    </section>
  );
};

export default PricingPage;
