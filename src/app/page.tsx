/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";

// --- Types ---
type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

// --- Icons (Inline SVGs to avoid extra dependencies) ---
const SearchIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- Main Application UI ---
export default function ProfessionalDashboard() {
  // --- Task 1: Product Listing State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and Sort Effect
  useEffect(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Sort
    if (sortOrder === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [searchQuery, sortOrder, products]);

  // --- Task 2: Registration Form State ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    let err = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) err = "Full Name is required.";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) err = "Email is required.";
        else if (!emailRegex.test(value)) err = "Please enter a valid email address.";
        break;
      case "phone":
        if (!value.trim()) err = "Phone number is required.";
        else if (!/^\d{10,15}$/.test(value.replace(/\D/g, ""))) err = "Please enter a valid phone number.";
        break;
      case "password":
        if (!value) err = "Password is required.";
        else if (value.length < 6) err = "Password must be at least 6 characters long.";
        break;
    }
    return err;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof typeof prev]: value }));

    // Real-time validation if the field has already been touched or currently typing
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields on submit attempt
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof typeof formData;
      const errorStr = validateField(fieldKey, formData[fieldKey]);
      if (errorStr) {
        newErrors[fieldKey] = errorStr;
        isValid = false;
      }
    });

    setFormErrors(newErrors);

    // Mark all as touched to display errors
    const allTouched = Object.keys(formData).reduce<Record<string, boolean>>((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});

    setTouchedFields(allTouched);

    if (isValid) {
      // Simulate successful registration
      setSuccessMessage("Registration successful! Welcome to the dashboard.");
      setFormData({ fullName: "", email: "", phone: "", password: "" });
      setTouchedFields({});

      // Auto-Hide clear success message after 4 seconds
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Professional Task Dashboard</h1>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-12 w-full">

        {/* === Task 1: Product Listing === */}
        <section aria-labelledby="product-listing-heading">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 id="product-listing-heading" className="text-xl font-semibold text-slate-800 mb-1">
                Product Catalog
              </h2>
              <p className="text-sm text-slate-500">Discover top vehicles and accessories.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Live Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-sm bg-white"
                />
              </div>

              {/* Sort Component */}
              <div className="relative inline-flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SortIcon />
                </div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "")}
                  className="pl-10 pr-8 py-2 w-full sm:w-auto appearance-none border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-white text-sm cursor-pointer"
                >
                  <option value="">Default sorting</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Status states: Loading, Error, Empty, Standard */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Spinner />
              <p className="mt-4 text-slate-500 text-sm font-medium">Loading products...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center justify-center max-w-2xl mx-auto mt-10 shadow-sm">
              <ErrorIcon />
              <div className="text-red-700">
                <h3 className="font-semibold">Unable to load products</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p>No products found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col group cursor-pointer"
                >
                  <div className="relative h-48 bg-white p-6 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow border-t border-slate-50">
                    <div className="mb-2">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wide text-indigo-800 bg-indigo-50 rounded-full uppercase">
                        {product.category}
                      </span>
                    </div>
                    <h3 title={product.title} className="text-sm font-semibold text-slate-900 leading-tight mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <hr className="border-slate-200" />

        {/* === Task 2: User Registration Form === */}
        <section aria-labelledby="registration-heading" className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <h2 id="registration-heading" className="text-xl font-semibold text-slate-800 mb-1 text-center">
              Create an Account
            </h2>
            <p className="text-sm text-slate-500 text-center mb-6">Join to track your favorites.</p>

            {/* Success Toast */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start animate-fade-in-up">
                <div className="flex-shrink-0 pt-0.5"><CheckIcon /></div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm ${formErrors.fullName && touchedFields.fullName ? 'border-red-400 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                  placeholder="John Doe"
                />
                {formErrors.fullName && touchedFields.fullName && (
                  <p className="mt-1.5 text-[13px] text-red-500 font-medium">{formErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm ${formErrors.email && touchedFields.email ? 'border-red-400 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                  placeholder="john@example.com"
                />
                {formErrors.email && touchedFields.email && (
                  <p className="mt-1.5 text-[13px] text-red-500 font-medium">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm ${formErrors.phone && touchedFields.phone ? 'border-red-400 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                  placeholder="(555) 123-4567"
                />
                {formErrors.phone && touchedFields.phone && (
                  <p className="mt-1.5 text-[13px] text-red-500 font-medium">{formErrors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm ${formErrors.password && touchedFields.password ? 'border-red-400 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                  placeholder="••••••••"
                />
                {formErrors.password && touchedFields.password && (
                  <p className="mt-1.5 text-[13px] text-red-500 font-medium">{formErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-slate-600 font-medium">Assignment by Shahzar Ahmad</p>
          <p className="text-slate-500 text-sm mt-1">Email: shahzarahmadlive@gmail.com</p>
        </div>
      </footer>

      {/* CSS For the toast transition */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}
