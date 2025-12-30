/* sell-your-car/page.tsx */
"use client";

import Head from "next/head";
import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HeroSection } from "@/components/hero-section";
import { SellCarForm } from "@/components/forms/SellCarForm";

export default function SellYourCarPage() {
  return (
    <ProtectedRoute>
      <SellYourCarContent />
    </ProtectedRoute>
  );
}

function SellYourCarContent() {
  return (
    <>
      <HeroSection
        title="Sell Your Car"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sell Your Car" }]}
      />
      <Head>
        <title>Sell Your Car — Tell us about your car</title>
        <meta
          name="description"
          content="Tell us about the car you want to sell"
        />
      </Head>

      <main className="bg-white py-10 min-h-[70vh]">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
            Tell us about your car
          </h1>
          <p className="text-slate-600 mb-6">
            Please give us some basics about yourself and the car you would like
            to sell. We will also need details about the cars title status as
            well as photos that highlight the exterior and interior.
          </p>

          <SellCarForm />
        </div>
      </main>
    </>
  );
}