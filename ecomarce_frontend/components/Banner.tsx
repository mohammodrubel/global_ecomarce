import React from "react"
import { Sidebar } from "./Sidebar"
import { SpecialOfferSlider } from "./SpecialOfferSlider"
import HeroSection from "./HeroSection"

function Banner() {
  return (
    <div className="w-full p-2 sm:p-3 md:p-4">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-stretch">
        {/* Category Sidebar */}
        <div className="hidden xl:block xl:col-span-1">
          <Sidebar />
        </div>

        {/* HeroSection */}
        <div className="col-span-1 xl:col-span-2 h-full">
          <HeroSection />
        </div>

        {/* SpecialOfferSlider */}
        <div className="col-span-1 xl:col-span-1 h-full">
          <div className="h-full flex items-stretch justify-center">
            <SpecialOfferSlider />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
