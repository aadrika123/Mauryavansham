"use client";

import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';

export default function BusinessDetailsPage() {
  const categories = [
    "Health & Beauty",
    "Apparel & Fashion",
    "Chemicals",
    "Machinery",
    "Construction & Real Estate",
    "Electronics & Electrical",
    "Hospital & Medical",
    "Gifts & Crafts",
    "Packaging & Paper",
    "Agriculture",
    "Home Supplies",
    "Minerals & Metals",
    "Industrial Supplies",
    "Pipes, Tubes & Fittings",
  ];

  const trending = [
    { name: "LED Products", img: "/api/placeholder/80/80" },
    { name: "Solar Panels", img: "/api/placeholder/80/80" },
    { name: "Medicines", img: "/api/placeholder/80/80" },
    { name: "T-Shirts", img: "/api/placeholder/80/80" },
  ];

  const products = [
    {
      name: "Polyelectrolyte Flocculant Chemical",
      price: "210 INR (Approx.)",
      unit: "Kilograms",
      seller: "CHEMTEX SPECIALITY",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Laundry Liquid Detergent - 500ML",
      price: "45 INR (Approx.)",
      unit: "Liters",
      seller: "TRUE ESSENCE FOODS",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Premium Cotton T-Shirt",
      price: "299 INR (Approx.)",
      unit: "Pieces",
      seller: "FASHION WORLD EXPORTS",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Solar Panel 100W Monocrystalline",
      price: "4500 INR (Approx.)",
      unit: "Pieces",
      seller: "GREEN ENERGY SOLUTIONS",
      img: "/api/placeholder/200/200",
    },
    {
      name: "LED Bulb 9W Energy Efficient",
      price: "120 INR (Approx.)",
      unit: "Pieces",
      seller: "BRIGHT LIGHTS COMPANY",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Ayurvedic Health Supplement",
      price: "850 INR (Approx.)",
      unit: "Bottles",
      seller: "NATURAL WELLNESS PVT LTD",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Industrial Chemical Powder",
      price: "1200 INR (Approx.)",
      unit: "Kilograms",
      seller: "CHEMICAL SOLUTIONS INC",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Stainless Steel Pipe Fittings",
      price: "75 INR (Approx.)",
      unit: "Pieces",
      seller: "STEEL WORKS INDUSTRIES",
      img: "/api/placeholder/200/200",
    },
  ];

  const moreProducts = [
    {
      name: "Hospital Grade Surgical Mask",
      price: "25 INR (Approx.)",
      unit: "Pieces",
      seller: "MEDCARE SOLUTIONS",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Packaging Corrugated Box",
      price: "45 INR (Approx.)",
      unit: "Pieces",
      seller: "PACK RIGHT INDUSTRIES",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Agricultural Fertilizer NPK",
      price: "580 INR (Approx.)",
      unit: "Kilograms",
      seller: "AGRO TECH SOLUTIONS",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Home Cleaning Supplies Kit",
      price: "350 INR (Approx.)",
      unit: "Sets",
      seller: "CLEAN HOME PRODUCTS",
      img: "/api/placeholder/200/200",
    },
  ];

  const services = [
    {
      name: "Export Documentation Service",
      price: "2500 INR (Approx.)",
      unit: "Per Service",
      seller: "TRADE FACILITATION SERVICES",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Quality Testing & Certification",
      price: "1800 INR (Approx.)",
      unit: "Per Test",
      seller: "QUALITY ASSURANCE LAB",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Logistics & Transportation",
      price: "15 INR (Approx.)",
      unit: "Per KM",
      seller: "SWIFT LOGISTICS PVT LTD",
      img: "/api/placeholder/200/200",
    },
    {
      name: "Business Consultation",
      price: "5000 INR (Approx.)",
      unit: "Per Hour",
      seller: "BIZ CONSULTANTS",
      img: "/api/placeholder/200/200",
    },
  ];

  return (
    <div className="flex gap-6 p-6 bg-yellow-50 min-h-screen">
      {/* Left Sidebar */}
      <div className="hidden lg:block w-60">
        <Card className="p-4 shadow-md hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5]">
          <h2 className="text-lg font-bold mb-3 text-red-700">Top Categories</h2>
          <ul className="space-y-2 text-gray-700">
            {categories.map((cat, i) => (
              <li key={i} className="hover:text-blue-600 cursor-pointer text-sm">
                {cat}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-red-700 underline text-sm cursor-pointer">
            View all Categories
          </p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Banner / Hero */}
        <div className="w-full h-56 bg-orange-200 rounded-2xl mb-6 flex items-center justify-center">
          <h2 className="text-xl font-bold text-red-700">Hero Banner / Ads</h2>
        </div>

        {/* Trending Categories */}
        <h3 className="text-lg font-semibold mb-3 text-red-700">Trending Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {trending.map((t, i) => (
            <Card key={i} className="p-3 text-center shadow-lg hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5]">
              <img src={t.img} alt={t.name} className="h-20 mx-auto mb-2 object-cover" />
              <p className="text-sm font-medium">{t.name}</p>
            </Card>
          ))}
        </div>

        {/* Featured Products */}
        <h3 className="text-lg font-semibold mb-3 text-red-700">Featured Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {products.map((p, i) => (
            <Card key={i} className="transition-shadow hover:shadow-[#ffd500] shadow-lg hover:shadow-lg bg-[#FFF8DE] border-2 border-[#FFF6D5]">
              <CardContent className="p-3">
                <img src={p.img} alt={p.name} className="h-28 w-full object-contain mb-2" />
                <h4 className="text-sm font-semibold mb-1">{p.name}</h4>
                <p className="text-gray-600 text-xs">{p.price}</p>
                <p className="text-gray-500 text-xs">{p.unit}</p>
                <p className="text-gray-700 text-xs mt-1 mb-2">{p.seller}</p>
                <Button className="w-full mt-2 bg-red-700 text-white hover:bg-red-800 text-xs py-1">
                  Send Inquiry
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* More Products Section */}
        <h3 className="text-lg font-semibold mb-3 text-red-700">More Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {moreProducts.map((p, i) => (
            <Card key={i} className="transition-shadow hover:shadow-[#ffd500] shadow-lg hover:shadow-lg bg-[#FFF8DE] border-2 border-[#FFF6D5]">
              <CardContent className="p-3">
                <img src={p.img} alt={p.name} className="h-28 w-full object-contain mb-2" />
                <h4 className="text-sm font-semibold mb-1">{p.name}</h4>
                <p className="text-gray-600 text-xs">{p.price}</p>
                <p className="text-gray-500 text-xs">{p.unit}</p>
                <p className="text-gray-700 text-xs mt-1 mb-2">{p.seller}</p>
                <Button className="w-full mt-2 bg-red-700 text-white hover:bg-red-800 text-xs py-1">
                  Send Inquiry
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services Section */}
        <h3 className="text-lg font-semibold mb-3 text-red-700">Business Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {services.map((p, i) => (
            <Card key={i} className="transition-shadow hover:shadow-[#ffd500] shadow-lg hover:shadow-lg bg-[#FFF8DE] border-2 border-[#FFF6D5]">
              <CardContent className="p-3">
                <img src={p.img} alt={p.name} className="h-28 w-full object-contain mb-2" />
                <h4 className="text-sm font-semibold mb-1">{p.name}</h4>
                <p className="text-gray-600 text-xs">{p.price}</p>
                <p className="text-gray-500 text-xs">{p.unit}</p>
                <p className="text-gray-700 text-xs mt-1 mb-2">{p.seller}</p>
                <Button className="w-full mt-2 bg-red-700 text-white hover:bg-red-800 text-xs py-1">
                  Send Inquiry
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Searches */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-[#FFF6D5]">
          <h3 className="text-lg font-semibold mb-3 text-red-700">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {['LED Lights', 'Solar Equipment', 'Medical Supplies', 'Fashion Apparel', 'Industrial Chemicals', 'Construction Materials', 'Electronics Components', 'Agricultural Products', 'Packaging Materials', 'Home Appliances', 'Beauty Products', 'Machinery Parts'].map((search, i) => (
              <span key={i} className="bg-yellow-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-yellow-200 cursor-pointer">
                {search}
              </span>
            ))}
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-[#FFF6D5]">
          <h3 className="text-lg font-semibold mb-3 text-red-700">Why Choose Our Platform?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold mb-2">Verified Suppliers</h4>
              <p className="text-sm text-gray-600">All suppliers are verified and trusted for quality assurance</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-semibold mb-2">Fast Delivery</h4>
              <p className="text-sm text-gray-600">Quick processing and delivery across India</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-semibold mb-2">Best Prices</h4>
              <p className="text-sm text-gray-600">Competitive pricing with bulk order discounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-64 space-y-4">
        <Card className="p-4 transition-shadow hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5] shadow-lg">
          <h4 className="font-semibold text-red-700 mb-2">Looking for a Product?</h4>
          <p className="text-xs text-gray-600 mb-3">Post your requirements and get quotes from verified suppliers</p>
          <Button className="w-full bg-red-700 text-white hover:bg-red-800 text-sm py-2">
            Post Buy Requirement
          </Button>
        </Card>

        <Card className="p-4 transition-shadow hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5] shadow-lg">
          <h4 className="font-semibold text-red-700 mb-2">Grow Your Business 10X Faster</h4>
          <p className="text-xs text-gray-600 mb-3">Join thousands of sellers on our platform</p>
          <Button className="w-full bg-red-700 text-white hover:bg-red-800 text-sm py-2">
            Sell on Platform
          </Button>
        </Card>

        <Card className="p-4 transition-shadow hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5] shadow-lg">
          <h4 className="font-semibold text-red-700 mb-3">Latest Updates</h4>
          <div className="space-y-3 text-xs">
            <div className="border-b border-yellow-200 pb-2">
              <p className="font-medium">New Export Policies</p>
              <p className="text-gray-600">Updated trade regulations for 2024</p>
            </div>
            <div className="border-b border-yellow-200 pb-2">
              <p className="font-medium">Trade Fair Mumbai</p>
              <p className="text-gray-600">Register now for biggest B2B event</p>
            </div>
            <div>
              <p className="font-medium">Digital Payments</p>
              <p className="text-gray-600">New secure payment options available</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-shadow hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5] shadow-lg">
          <h4 className="font-semibold text-red-700 mb-3">Quick Stats</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Active Products:</span>
              <span className="font-semibold">50,000+</span>
            </div>
            <div className="flex justify-between">
              <span>Verified Suppliers:</span>
              <span className="font-semibold">10,000+</span>
            </div>
            <div className="flex justify-between">
              <span>Happy Buyers:</span>
              <span className="font-semibold">25,000+</span>
            </div>
            <div className="flex justify-between">
              <span>Cities Covered:</span>
              <span className="font-semibold">500+</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}