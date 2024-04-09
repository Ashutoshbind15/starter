"use client";
import axios from "axios";
const CheckoutForm = ({ lookup_key }) => {
  return (
    <div>
      <form
        action="/api/checkout-session"
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault();
          const { data } = await axios.post("/api/checkout-session", {
            lookup_key,
          });

          window.location = data;
        }}
      >
        {/* Add a hidden field with the lookup_key of your Price */}
        <button id="checkout-and-portal-button" type="submit">
          Checkout
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
