import type { Metadata } from "next";
import { Suspense } from "react";
import OrderConfirmation from "@/components/OrderConfirmation";

export const metadata: Metadata = {
  title: "Demo order confirmation | Orbit 3D",
  robots: { index: false, follow: false },
};

async function OrderConfirmationRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OrderConfirmation orderId={orderId} />;
}

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 text-white sm:px-8">
          <p role="status">Loading demo order...</p>
        </main>
      }
    >
      <OrderConfirmationRoute params={params} />
    </Suspense>
  );
}
