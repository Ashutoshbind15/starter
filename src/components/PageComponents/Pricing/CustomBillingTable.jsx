import CheckoutForm from "@/components/Wrappers/Client/CheckoutForm";
import PortalForm from "@/components/Wrappers/Client/PortalForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProductIdFromSubscription } from "@/lib/stripe";
import React from "react";
import Stripe from "stripe";

const fetchPopulatedProducts = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let products = await stripe.products.list();

  const populatedProducts = await Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({ product: product.id });
      const yp = prices.data.find(
        (price) => price.recurring && price.recurring.interval === "year"
      );
      const mp = prices.data.find(
        (price) => price.recurring && price.recurring.interval === "month"
      );

      return {
        name: product.name,
        description: product.description,
        features: product.features, // Ensure product.features is an array.
        id: product.id,
        yearlyPrice: yp
          ? {
              lookup_key: yp.lookup_key,
              unit_amount: yp.unit_amount,
            }
          : null,
        monthlyPrice: mp
          ? {
              lookup_key: mp.lookup_key,
              unit_amount: mp.unit_amount,
            }
          : null,
      };
    })
  );

  return populatedProducts;
};

const CustomBillingTable = async ({ subscriptionInfo }) => {
  const products = await fetchPopulatedProducts();
  console.log(products);

  return (
    <div className="flex items-center justify-center my-16 flex-wrap w-full">
      {products.map((product) => {
        return (
          <Card key={product.id} className="w-1/4 mx-3">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {product.monthlyPrice && (
                <div>
                  <h3>Monthly</h3>
                  <p>{product.monthlyPrice.unit_amount / 100}</p>
                </div>
              )}
              <Table>
                <TableCaption>A list of your features.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Features</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.features.map((feature, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{feature}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex">
              {!subscriptionInfo.hasSubscription ? (
                <CheckoutForm lookup_key={product.monthlyPrice.lookup_key} />
              ) : product.id === subscriptionInfo.productId ? (
                <PortalForm type="cancel" />
              ) : (
                <PortalForm type="update" />
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default CustomBillingTable;
