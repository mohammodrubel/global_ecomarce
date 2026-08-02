"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Flame, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/fetchers/cart/cartSlice";

function useCountdown(validUntil?: string | null) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    if (!validUntil) return;
    const endTime = new Date(validUntil).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, expired: false });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [validUntil]);

  return timeLeft;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
      <span className="font-mono text-3xl sm:text-4xl">
        <span aria-live="polite" aria-label={`${value} ${label}`}>
          {String(value).padStart(2, "0")}
        </span>
      </span>
      {label}
    </div>
  );
}

export function SpecialOffer({ offer }: { offer: any }) {
  const timeLeft = useCountdown(offer?.validUntil);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (offer?.product) {
      dispatch(addToCart(offer.product));
    }
  };

  if (!offer) {
    return (
      <Card className="p-6 text-center">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-48 w-full rounded" />
      </Card>
    );
  }

  const product = offer.product;
  const productPrice = product?.price;

  return (
    <div className="relative isolate overflow-hidden rounded-3xl shadow-xl w-full h-full flex flex-col text-left bg-gradient-to-br from-slate-900 via-rose-900 to-red-900 text-white">
      {/* Hot deal ribbon */}
      <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
        <Flame className="w-3.5 h-3.5" />
        HOT DEAL
      </div>

      <div className="relative p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
        {/* Title + small image side by side */}
        <div className="flex items-center gap-4 pt-6">
          {/* Small product image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-2 shadow-lg">
            <Image
              src={product?.images?.[0] || "/fallback.png"}
              alt={product?.name || offer.title}
              fill
              sizes="96px"
              className="object-contain p-1 drop-shadow-md transition-transform duration-500 hover:scale-110 hover:-rotate-3"
            />
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-extrabold leading-tight line-clamp-2">
              {offer.title}
            </h3>
            {product?.name && (
              <p className="text-white/70 text-xs mt-1 line-clamp-1">
                {product.name}
              </p>
            )}
          </div>
        </div>

        {/* Countdown */}
        {offer.validUntil && !timeLeft.expired ? (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/60 mb-2 text-center font-medium">
              Ends In
            </p>
            <div className="grid grid-flow-col gap-3 text-center auto-cols-max justify-center">
              <TimeUnit value={timeLeft.days} label="days" />
              <TimeUnit value={timeLeft.hours} label="hours" />
              <TimeUnit value={timeLeft.minutes} label="min" />
              <TimeUnit value={timeLeft.seconds} label="sec" />
            </div>
          </div>
        ) : offer.validUntil ? (
          <div className="text-center text-sm font-semibold bg-white/10 py-2.5 rounded-lg border border-white/10">
            Offer Ended
          </div>
        ) : null}

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {productPrice != null && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60 leading-none mb-1">
                Price
              </p>
              <p className="text-2xl font-extrabold leading-none">
                ৳{productPrice}
              </p>
            </div>
          )}

          {product?.id && (
            <Button
              onClick={handleAddToCart}
              className="ml-auto bg-white text-rose-700 hover:bg-white/90 hover:scale-105 transition-all duration-300 font-bold rounded-full px-4 shadow-lg"
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
