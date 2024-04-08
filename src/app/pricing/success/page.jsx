"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";

const SubscriptionSuccess = ({ sessionId }) => {
  return (
    <section>
      <div className="product Box-root">
        <div className="description Box-root">
          <h3>Subscription to Standard plan successful!</h3>
        </div>
      </div>
      <form
        action="/api/portal-session"
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault();
          const { data } = await axios.post("/api/portal-session", {
            session_id: sessionId,
          });

          window.location = data;
        }}
      >
        <button id="checkout-and-portal-button" type="submit">
          Manage your billing information
        </button>
      </form>
    </section>
  );
};

const SubscriptionSuccessPage = () => {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div>
      <div>SubscriptionSuccessPage</div>
      <SubscriptionSuccess sessionId={sessionId} />
    </div>
  );
};

export default SubscriptionSuccessPage;
