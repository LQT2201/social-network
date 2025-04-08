"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

const DonationPage = () => {
  const [donationType, setDonationType] = useState("once");
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isHonorMemory, setIsHonorMemory] = useState(false);
  const [comment, setComment] = useState("");
  const [showDonationForm, setShowDonationForm] = useState(true);

  const presetAmounts = [
    { value: 15, label: "$15" },
    { value: 35, label: "$35" },
    { value: 100, label: "$100" },
    { value: 150, label: "$150" },
    { value: 600, label: "$600" },
    { value: 1000, label: "$1000" },
  ];

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = customAmount || amount;
    console.log({
      donationType,
      amount: finalAmount,
      currency,
      isHonorMemory,
      comment,
    });
    // Here you would integrate with a payment gateway
    // For demo purposes, just hide the form and show a thank you message
    setShowDonationForm(false);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Left side with image and organization info */}
      <div className="flex-1">
        <div className="rounded-t-lg overflow-hidden">
          <Image
            src="/images/test-1.jpg"
            alt="Cute animal"
            width={600}
            height={400}
            className="w-full h-[240px] object-cover"
            unoptimized
          />
        </div>
        <div className="bg-white p-6 rounded-b-lg shadow-sm">
          <h3 className="text-2xl font-bold text-orange-500">fluffy&apos;s</h3>
          <p className="text-orange-400 mb-4">
            Let&apos;s help animals together
          </p>

          <h4 className="font-semibold text-lg mb-2">Movement Grants</h4>
          <p className="text-gray-700 mb-4">
            Your donation will help build and strengthen the global animal
            advocacy movement by supporting promising projects around the world.
            Grants will be determined by review committee. Thank you!
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <a href="#" className="hover:underline">
              Start a fundraiser
            </a>
            <a href="#" className="hover:underline">
              Want to donate fee-free?
            </a>
            <a href="#" className="hover:underline">
              Other ways
            </a>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500 flex flex-wrap gap-x-6">
          <a href="#" className="hover:underline">
            Is my donation secure?
          </a>
          <a href="#" className="hover:underline">
            Is this donation tax-deductible?
          </a>
          <a href="#" className="hover:underline">
            Can I cancel my recurring donation?
          </a>
        </div>
      </div>

      {/* Right side with donation form */}
      <div className="flex-1">
        {showDonationForm ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-gray-700">
                  Secure donation
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Donation type selector */}
                <div className="flex gap-2 mb-6">
                  <Button
                    type="button"
                    className={`flex-1 ${
                      donationType === "once"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setDonationType("once")}
                  >
                    Give once
                  </Button>
                  <Button
                    type="button"
                    className={`flex-1 ${
                      donationType === "monthly"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setDonationType("monthly")}
                  >
                    Monthly
                  </Button>
                </div>

                {/* Preset amounts */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {presetAmounts.map((preset) => (
                    <Button
                      key={preset.value}
                      type="button"
                      className={`${
                        amount === preset.value && !customAmount
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleAmountSelect(preset.value)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-gray-600">$</span>
                  <Input
                    type="number"
                    placeholder="Other"
                    className="flex-1"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                  />

                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-gray-100 px-3 py-2 rounded border border-gray-200"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                {/* Donate in honor/memory */}
                <div className="mb-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="honorMemory"
                    checked={isHonorMemory}
                    onChange={() => setIsHonorMemory(!isHonorMemory)}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <Label htmlFor="honorMemory" className="cursor-pointer">
                    Give in honor or in memory
                  </Label>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <Label htmlFor="comment" className="block mb-2">
                    Add comment
                  </Label>
                  <Input
                    type="text"
                    id="comment"
                    placeholder="Enter your comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Donate
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6">
              Your donation has been processed. We appreciate your support.
            </p>
            <Button
              onClick={() => setShowDonationForm(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Make Another Donation
            </Button>
          </div>
        )}

        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4">Donation</h2>
          <p className="text-gray-700 mb-6">
            With Fluffy&apos;s, you are working to save the lives of cats and
            dogs, many other animals all across world, giving pets second
            chances and happy homes and new family.
          </p>

          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-4">
              <Image
                src="/images/icon.png"
                alt="Animal illustration"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Let&apos;s help animals
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Help keep all animals safe
            </p>

            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Donate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
