"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useGetAllCategoryQuery } from "@/redux/fetchers/categoryApi/categoryApi";
import { useGetAllBrandQuery } from "@/redux/fetchers/brand/brandApi";

function Footer() {
  const { data: categoryRes } = useGetAllCategoryQuery(undefined);
  const { data: brandRes } = useGetAllBrandQuery();

  const categories = (categoryRes?.data || []).slice(0, 6);
  const brands = (brandRes?.data || []).slice(0, 6);

  return (
    <footer className="bg-gray-900 text-white py-10 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">ShopHub</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Your one-stop destination for all your shopping needs. Quality
              products, competitive prices, and exceptional service.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost">📘</Button>
              <Button size="icon" variant="ghost">🐦</Button>
              <Button size="icon" variant="ghost">📷</Button>
              <Button size="icon" variant="ghost">💼</Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-gray-400 hover:text-white">
                Home
              </Link>
              <Link href="/shop" className="block text-gray-400 hover:text-white">
                Shop
              </Link>
              <Link href="/shop/new" className="block text-gray-400 hover:text-white">
                New Arrivals
              </Link>
              <Link href="/cart" className="block text-gray-400 hover:text-white">
                Cart
              </Link>
              <Link href="/login" className="block text-gray-400 hover:text-white">
                Login
              </Link>
              <Link href="/register" className="block text-gray-400 hover:text-white">
                Register
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <div className="space-y-2 text-sm">
              {categories.length ? (
                categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/shop?categoryId=${cat.id}`}
                    className="block text-gray-400 hover:text-white"
                  >
                    {cat.name}
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-xs">No categories yet</p>
              )}
              <Link
                href="/shop"
                className="block text-cyan-400 hover:text-cyan-300 pt-1"
              >
                View All →
              </Link>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="font-semibold mb-4">Brands</h4>
            <div className="space-y-2 text-sm">
              {brands.length ? (
                brands.map((b: any) => (
                  <Link
                    key={b.id}
                    href={`/shop?brandId=${b.id}`}
                    className="block text-gray-400 hover:text-white"
                  >
                    {b.name}
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-xs">No brands yet</p>
              )}
              <Link
                href="/shop"
                className="block text-cyan-400 hover:text-cyan-300 pt-1"
              >
                View All →
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">📞 1-800-SHOPHUB</p>
              <p className="text-gray-400">✉️ support@shophub.com</p>
              <p className="text-gray-400">🕒 Mon-Fri: 9AM-6PM EST</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 text-center md:text-left">
          <p className="text-sm sm:text-base text-gray-400">
            © 2024 ShopHub. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
