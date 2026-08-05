"use client";

import Banner from "@/components/Banner";
import BrandLogo from "@/components/BrandLogo";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Header } from "@/components/Header";
import HomePageProduct from "@/components/HomePageProduct";
import { Navigation } from "@/components/Navigation";
import NewArrivals from "@/components/NewArrivals";
import Footer from "@/components/share/Footer";
import TopCategories from "@/components/TopCategories";

export default function HomePage() {
  return (
    <>
      <Header />
      <Navigation />
      <div className="container mx-auto">
        <div className="min-h-screen bg-background">
          <Banner />
          <TopCategories />
          <FeaturedProducts />
          <NewArrivals />
          <HomePageProduct />
          <BrandLogo />
        </div>
      </div>
      <Footer />
    </>
  );
}
