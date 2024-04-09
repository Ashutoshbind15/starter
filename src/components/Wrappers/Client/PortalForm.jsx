"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
const PortalForm = ({ type }) => {
  return (
    <div>
      <form
        action=""
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault();
          const { data } = await axios.post("/api/portal-session", {
            type,
          });

          window.location = data;
        }}
      >
        <Button id="checkout-and-portal-button" type="submit">
          {type === "update" ? "Update Subscription" : "Cancel Subscription"}
        </Button>
      </form>
    </div>
  );
};

export default PortalForm;
