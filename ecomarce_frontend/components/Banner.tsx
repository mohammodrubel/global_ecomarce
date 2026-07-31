import React from "react"
import { Sidebar } from "./Sidebar"
import { SpecialOfferSlider } from "./SpecialOfferSlider"
import HeroSection from "./HeroSection"

function Banner() {
  return (
    <div className="flex flex-col lg:flex-row w-full">
      {/* Sidebar - hidden on mobile, shown from xl */}
      <div className="lg:w-1/5 hidden xl:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 w-full p-2 sm:p-3 md:p-4">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:grid-cols-4">
          {/* HeroSection - full on mobile, 3/4 on xl */}
          <div className="col-span-1 xl:col-span-3">
            <HeroSection />
          </div>

          {/* SpecialOfferSlider - full on mobile, 1/4 on xl */}
          <div className="col-span-1 xl:col-span-1">
            <div className="w-full">
              <SpecialOfferSlider />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Banner
