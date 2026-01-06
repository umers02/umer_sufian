'use client';

import Header from '../../components/common/Header';
import Navbar from '../../components/common/Navbar';
import HeroSection from '../../components/home/HeroSection';
import BrandLogos from '../../components/home/BrandLogos';
import NewArrivals from '../../components/home/NewArrivals';
import TopSelling from '../../components/home/TopSelling';
import BrowseByStyle from '../../components/home/BrowseByStyle';
import CustomerReviews from '../../components/home/CustomerReviews';
import Newsletter from '../../components/home/Newsletter';
import Footer from '../../components/common/Footer';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navbar />
      <HeroSection />
      <BrandLogos />
      <NewArrivals />
      <TopSelling />
      <BrowseByStyle />
      <CustomerReviews />
      <Newsletter />
      <Footer />
    </div>
  );
}