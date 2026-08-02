"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SpecialOffer } from "./SpecialOffer";
import {
  useGetAllSpecialOffersQuery,
} from "@/redux/fetchers/special-offer/specialOffer";

export function SpecialOfferSlider() {
  const { data, isLoading } = useGetAllSpecialOffersQuery(undefined);
  const offers = data?.data ?? [];

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading offers...</p>;
  }

  if (!offers.length) {
    return (
      <p className="text-center text-gray-500">No special offers found.</p>
    );
  }

  return (
    <div className="w-full h-full">
      <Carousel
        className="w-full h-full"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-1 h-full">
          {offers.map((offer: any) => (
            <CarouselItem
              key={offer.id}
              className="pl-1 basis-full h-full"
            >
              <div className="p-1 h-full">
                <SpecialOffer offer={offer} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {offers.length > 1 && (
  <>
    <CarouselPrevious className="left-2 hidden md:flex" />

    <CarouselNext className="right-2 hidden md:flex" />
  </>
)}
      </Carousel>
    </div>
  );
}
