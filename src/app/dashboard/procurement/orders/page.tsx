"use client";
import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
import OrdersList from "@/components/procurement/orders";
import { Suspense } from "react";

const OrdersPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <OrdersList />
    </Suspense>
  );
};

export default OrdersPage;
