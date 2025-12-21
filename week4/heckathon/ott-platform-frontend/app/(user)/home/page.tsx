'use client'

import { useState, useEffect } from 'react'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import CategoryCard from '@/components/CategoryCard'
import SectionHeader from '@/components/SectionHeader'
import FreeTrialCTA from '@/components/FreeTrialCTA'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Check if user should be redirected based on role
  useEffect(() => {
    const user = auth.getUser()
    const role = user?.role?.toLowerCase()
    if (user && (role === 'admin' || role === 'superadmin')) {
      router.push(auth.getRoleBasedRedirect())
    }
  }, [router])

  // Mock data for movies/shows
  const heroMovies = [
    { id: 1, title: 'The Witcher', image: '/api/placeholder/1200/600', rating: 8.7 },
    { id: 2, title: 'Stranger Things', image: '/api/placeholder/1200/600', rating: 9.1 },
    { id: 3, title: 'The Crown', image: '/api/placeholder/1200/600', rating: 8.9 }
  ]

  const categories = [
    {
      name: 'Action',
      movies: [
        { id: 1, title: 'John Wick', image: '/img/john-wick.jpg', year: '2023' },
        { id: 2, title: 'Fast X', image: '/img/fast-x.jpg', year: '2023' },
        { id: 3, title: 'Mission Impossible', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 4, title: 'The Batman', image: '/img/batman.jpg', year: '2022' }
      ]
    },
    {
      name: 'Adventure',
      movies: [
        { id: 5, title: 'Avatar', image: '/img/john-wick.jpg', year: '2022' },
        { id: 6, title: 'Jurassic World', image: '/img/fast-x.jpg', year: '2022' },
        { id: 7, title: 'Indiana Jones', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 8, title: 'Guardians', image: '/img/batman.jpg', year: '2023' }
      ]
    },
    {
      name: 'Comedy',
      movies: [
        { id: 9, title: 'The Hangover', image: '/img/john-wick.jpg', year: '2023' },
        { id: 10, title: 'Deadpool', image: '/img/fast-x.jpg', year: '2024' },
        { id: 11, title: 'Superbad', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 12, title: 'Anchorman', image: '/img/batman.jpg', year: '2022' }
      ]
    },
    {
      name: 'Drama',
      movies: [
        { id: 13, title: 'The Godfather', image: '/img/john-wick.jpg', year: '2023' },
        { id: 14, title: 'Shawshank', image: '/img/fast-x.jpg', year: '2022' },
        { id: 15, title: 'Forrest Gump', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 16, title: 'Titanic', image: '/img/batman.jpg', year: '2022' }
      ]
    },
    {
      name: 'Horror',
      movies: [
        { id: 17, title: 'The Conjuring', image: '/img/john-wick.jpg', year: '2023' },
        { id: 18, title: 'IT', image: '/img/fast-x.jpg', year: '2022' },
        { id: 19, title: 'Scream', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 20, title: 'Halloween', image: '/img/batman.jpg', year: '2022' }
      ]
    }
  ]

  const devices = [
    { name: 'Smartphones', icon: '📱', description: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'Tablet', icon: '📱', description: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'Smart TV', icon: '📺', description: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'Laptops', icon: '💻', description: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'Gaming Consoles', icon: '🎮', description: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'VR Headsets', icon: '🥽', description: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' }
  ]

  const faqs = [
    { question: 'What is StreamVibe?', answer: 'StreamVibe is a streaming service that allows you to watch movies and shows on demand.' },
    { question: 'How much does StreamVibe cost?', answer: 'We offer various subscription plans starting from $9.99/month.' },
    { question: 'What content is available on StreamVibe?', answer: 'We have a vast library of movies, TV shows, documentaries and exclusive content.' },
    { question: 'How can I watch StreamVibe?', answer: 'You can watch on any device - smartphone, tablet, laptop, smart TV, and more.' },
    { question: 'How do I sign up for StreamVibe?', answer: 'Simply click the sign up button and follow the registration process.' },
    { question: 'What is the StreamVibe free trial?', answer: 'We offer a 30-day free trial for new subscribers.' },
    { question: 'How do I contact StreamVibe customer support?', answer: 'You can reach our support team 24/7 through chat, email, or phone.' },
    { question: 'What are the StreamVibe payment methods?', answer: 'We accept all major credit cards, PayPal, and digital wallets.' }
  ]

  const plans = [
    {
      name: 'Basic Plan',
      description: 'Enjoy an extensive library of movies and shows, featuring a range of content, including recently released titles.',
      price: '$9.99',
      features: ['Access to a wide selection of movies and shows, including some new releases.', 'Ad-free streaming', 'Limited to 720p resolution', 'Can stream on 1 device simultaneously']
    },
    {
      name: 'Standard Plan',
      description: 'Access to a wider selection of movies and shows, including most new releases and exclusive content',
      price: '$12.99',
      features: ['Access to a wider selection of movies and shows, including most new releases and exclusive content', 'Ad-free streaming', 'Full HD (1080p) streaming', 'Can stream on 2 device simultaneously'],
      popular: true
    },
    {
      name: 'Premium Plan',
      description: 'Access to a widest selection of movies and shows, including all new releases and Offline Viewing',
      price: '$14.99',
      features: ['Access to a widest selection of movies and shows, including all new releases and Offline Viewing', 'Ad-free streaming', 'Ultra HD (4K) streaming', 'Can stream on 4 device simultaneously']
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMovies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#141414'}}>
      {/* Navigation */}
      <Navbar transparent={true} />

      {/* Hero Image Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="w-full h-full">
          <img 
            src="./img/hero-img.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        {/* Enhanced Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/40 to-[#141414]" />
        
        {/* Play Button SVG Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="300" height="300" viewBox="0 0 470 470" fill="none" xmlns="http://www.w3.org/2000/svg">
            <foreignObject x="-12" y="-12" width="494" height="494"><div style={{backdropFilter:'blur(6px)', clipPath:'url(#bgblur_0_1_62_clip_path)', height:'100%', width:'100%'}}></div></foreignObject>
            <g data-figma-bg-blur-radius="12">
              <path d="M389.97 188.658C386.681 85.6396 303.206 2.505 199.84 0C197.178 0 194.985 2.03531 194.985 4.69687L194.828 73.8974C194.828 77.3418 192.166 80.0033 188.72 80.1599C85.6681 83.2911 2.50583 166.895 0 270.227C0 272.888 2.03599 275.08 4.69843 275.08L73.7654 275.236C77.2109 275.236 79.8734 277.898 80.03 281.342C83.3189 384.36 166.951 467.495 270.16 470C272.822 470 275.015 467.965 275.015 465.303L275.172 396.103C275.172 392.658 277.834 389.997 281.28 389.84C384.332 386.552 467.494 302.948 470 199.773C470 197.112 467.964 194.92 465.302 194.92L396.235 194.763C392.789 194.763 390.127 192.102 389.97 188.658ZM268.281 389.37C209.707 385.926 162.722 338.331 160.53 279.464C160.373 276.959 158.337 274.923 155.831 274.923L86.921 274.767C83.3189 274.767 80.4998 271.792 80.6564 268.191C84.102 209.637 131.713 162.668 190.6 160.476C193.106 160.32 195.142 158.284 195.142 155.779L195.298 86.7355C195.298 83.1346 198.274 80.3165 201.876 80.473C260.45 83.9174 307.434 131.512 309.627 190.38C309.783 192.885 311.819 194.92 314.325 194.92L383.236 195.077C386.838 195.077 389.657 198.051 389.5 201.652C386.055 261.772 336.095 309.524 275.172 309.524L275.015 383.108C274.858 386.709 271.883 389.527 268.281 389.37Z" fill="url(#paint0_linear_1_62)" fillOpacity="0.3"/>
              <path d="M281.264 389.34L281.257 389.341C277.558 389.509 274.672 392.378 274.672 396.102L274.515 465.302V465.303C274.515 467.665 272.571 469.496 270.166 469.499C167.225 466.997 83.8097 384.077 80.5293 281.326V281.319C80.361 277.621 77.4908 274.736 73.7656 274.736H73.7666L4.69922 274.58H4.69824C2.33692 274.58 0.50597 272.64 0.5 270.238C2.99957 167.173 85.9489 83.7825 188.735 80.6592V80.6602L188.743 80.6592C192.442 80.4911 195.328 77.6224 195.328 73.8984L195.485 4.69824V4.69727C195.485 2.33548 197.428 0.503565 199.833 0.5C302.93 3.00115 386.189 85.9215 389.47 188.673V188.674L389.471 188.681C389.639 192.379 392.509 195.262 396.233 195.263V195.264L465.301 195.42H465.302C467.667 195.42 469.5 197.367 469.5 199.773C466.994 302.677 384.047 386.061 281.264 389.34ZM201.897 79.9736C198.015 79.805 194.798 82.8459 194.798 86.7344L194.642 155.778V155.779C194.642 158 192.834 159.831 190.577 159.977C131.433 162.18 83.6177 209.353 80.1572 268.162V268.17C79.9886 272.051 83.0306 275.265 86.9199 275.266V275.267L155.83 275.424H155.831C157.986 275.424 159.775 277.124 160.013 279.284L160.031 279.495C162.24 338.616 209.426 386.41 268.251 389.869L268.259 389.87C272.146 390.039 275.346 386.997 275.515 383.13V383.109L275.67 310.02C336.633 309.76 386.548 261.9 389.999 201.681L390 201.674C390.169 197.792 387.125 194.576 383.235 194.576H383.236L314.326 194.42H314.325C312.101 194.42 310.267 192.608 310.126 190.349H310.125C307.917 131.228 260.73 83.4328 201.905 79.9736H201.897Z" stroke="url(#paint1_linear_1_62)" strokeOpacity="0.5"/>
            </g>
            <foreignObject x="180.938" y="168.875" width="125.569" height="133.271"><div style={{backdropFilter:'blur(6px)', clipPath:'url(#bgblur_1_1_62_clip_path)', height:'100%', width:'100%'}}></div></foreignObject>
            <g data-figma-bg-blur-radius="12">
              <path fillRule="evenodd" clipRule="evenodd" d="M192.938 193.348C192.938 183.875 203.094 177.869 211.395 182.435L288.054 224.598C296.658 229.33 296.658 241.692 288.054 246.424L211.395 288.587C203.094 293.152 192.938 287.147 192.938 277.674V193.348Z" fill="url(#paint2_linear_1_62)" fillOpacity="0.3"/>
              <path d="M193.438 193.348C193.438 184.255 203.186 178.491 211.154 182.873L287.814 225.036C296.072 229.577 296.072 241.444 287.814 245.986L211.154 288.149C203.186 292.53 193.438 286.766 193.438 277.673V193.348Z" stroke="url(#paint3_linear_1_62)" strokeOpacity="0.5"/>
            </g>
            <defs>
              <clipPath id="bgblur_0_1_62_clip_path" transform="translate(12 12)"><path d="M389.97 188.658C386.681 85.6396 303.206 2.505 199.84 0C197.178 0 194.985 2.03531 194.985 4.69687L194.828 73.8974C194.828 77.3418 192.166 80.0033 188.72 80.1599C85.6681 83.2911 2.50583 166.895 0 270.227C0 272.888 2.03599 275.08 4.69843 275.08L73.7654 275.236C77.2109 275.236 79.8734 277.898 80.03 281.342C83.3189 384.36 166.951 467.495 270.16 470C272.822 470 275.015 467.965 275.015 465.303L275.172 396.103C275.172 392.658 277.834 389.997 281.28 389.84C384.332 386.552 467.494 302.948 470 199.773C470 197.112 467.964 194.92 465.302 194.92L396.235 194.763C392.789 194.763 390.127 192.102 389.97 188.658ZM268.281 389.37C209.707 385.926 162.722 338.331 160.53 279.464C160.373 276.959 158.337 274.923 155.831 274.923L86.921 274.767C83.3189 274.767 80.4998 271.792 80.6564 268.191C84.102 209.637 131.713 162.668 190.6 160.476C193.106 160.32 195.142 158.284 195.142 155.779L195.298 86.7355C195.298 83.1346 198.274 80.3165 201.876 80.473C260.45 83.9174 307.434 131.512 309.627 190.38C309.783 192.885 311.819 194.92 314.325 194.92L383.236 195.077C386.838 195.077 389.657 198.051 389.5 201.652C386.055 261.772 336.095 309.524 275.172 309.524L275.015 383.108C274.858 386.709 271.883 389.527 268.281 389.37Z"/></clipPath>
              <clipPath id="bgblur_1_1_62_clip_path" transform="translate(-180.938 -168.875)"><path fillRule="evenodd" clipRule="evenodd" d="M192.938 193.348C192.938 183.875 203.094 177.869 211.395 182.435L288.054 224.598C296.658 229.33 296.658 241.692 288.054 246.424L211.395 288.587C203.094 293.152 192.938 287.147 192.938 277.674V193.348Z"/></clipPath>
              <linearGradient id="paint0_linear_1_62" x1="235" y1="0" x2="235" y2="470" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0.5"/><stop offset="1" stopColor="white"/></linearGradient>
              <linearGradient id="paint1_linear_1_62" x1="235" y1="0" x2="235" y2="470" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0"/><stop offset="1" stopColor="white"/></linearGradient>
              <linearGradient id="paint2_linear_1_62" x1="243.722" y1="180.875" x2="243.722" y2="290.146" gradientUnits="userSpaceOnUse"><stop offset="0.147231" stopColor="white"/><stop offset="0.42761" stopColor="white" stopOpacity="0.5"/><stop offset="1" stopColor="#1600FD" stopOpacity="0"/></linearGradient>
              <linearGradient id="paint3_linear_1_62" x1="243.722" y1="180.875" x2="243.722" y2="290.146" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0"/><stop offset="1" stopColor="white"/></linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Hero Content Section */}
      <section className="py-12 px-4 -mt-18" style={{backgroundColor: '#141414'}}>
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
            The Best Streaming Experience
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed">
            StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more. You can also create your own watchlists, so you can easily find the content you want to watch.
          </p>
          <button className="bg-red-600 hover:bg-red-700 px-6 py-3 text-base font-semibold rounded-md inline-flex items-center transition-colors">
            <Play className="w-5 h-5 mr-2 fill-white" />
            Start Watching Now
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Explore our wide variety of categories</h2>
              <p className="text-gray-400">Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new</p>
            </div>
            <div className="flex items-center space-x-2 bg-black rounded-lg px-3 py-2">
              <button className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors" style={{backgroundColor: '#1A1A1A'}}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex space-x-1">
                <div className="w-2 h-1 bg-red-600 rounded-full"></div>
                <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
                <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
                <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
              </div>
              <button className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors" style={{backgroundColor: '#1A1A1A'}}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Devices Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">We Provide you streaming experience across various devices.</h2>
            <p className="text-gray-400">With StreamVibe, you can enjoy your favorite movies and TV shows anytime, anywhere. Our platform is designed to be compatible with a wide range of devices, ensuring that you never miss a moment of entertainment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-md p-6 text-left" style={{background: 'linear-gradient(221.52deg, #E50000 -208.03%, rgba(229, 0, 0, 0) 41.32%), #0F0F0F', border: '1px solid #262626'}}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 2v2h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3V2h2v2h6V2h2zM4 9v10h16V9H4zm2 2h2v2H6v-2zm0 4h2v2H6v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Smartphones</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>

            <div className="rounded-xl p-6 text-left" style={{background: 'linear-gradient(221.52deg, #E50000 -208.03%, rgba(229, 0, 0, 0) 41.32%), #0F0F0F', border: '1px solid #262626'}}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Tablet</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>

            <div className="rounded-xl p-6 text-left" style={{background: 'linear-gradient(221.52deg, #E50000 -208.03%, rgba(229, 0, 0, 0) 41.32%), #0F0F0F', border: '1px solid #262626'}}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 3H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h6l-2 2v1h8v-1l-2-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V5h18v11z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Smart TV</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>

            <div className="rounded-xl p-6 text-left" style={{background: 'linear-gradient(221.52deg, #E50000 -208.03%, rgba(229, 0, 0, 0) 41.32%), #0F0F0F', border: '1px solid #262626'}}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 8h2v2H6zm0 4h2v2H6zm4-4h8v2h-8zm0 4h8v2h-8z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Laptops</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>

            <div className="rounded-xl p-6 text-left" style={{background: 'linear-gradient(221.52deg, #E50000 -208.03%, rgba(229, 0, 0, 0) 41.32%), #0F0F0F', border: '1px solid #262626'}}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.58 16.09l-1.09-7.66A1.996 1.996 0 0 0 18.53 7H16V6c0-2.76-2.24-5-5-5S6 3.24 6 6v1H3.47c-.95 0-1.75.74-1.96 1.66l-1.09 7.66c-.23 1.61.61 3.08 2.22 3.08h16.72c1.61 0 2.45-1.47 2.22-3.08zM8 6c0-1.66 1.34-3 3-3s3 1.34 3 3v1H8V6z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Gaming Consoles</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>

            <div className="rounded-xl p-6 text-left" style={{background: 'linear-gradient(221.52deg, #E50000 -208.03%, rgba(229, 0, 0, 0) 41.32%), #0F0F0F', border: '1px solid #262626'}}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">VR Headsets</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400">
                Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about StreamVibe.
              </p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-medium">
              Ask a Question
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <div className="p-6 rounded-lg cursor-pointer" onClick={() => toggleFaq(index)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-white mr-4">{String(index + 1).padStart(2, '0')}</span>
                        <h4 className="font-medium text-white">{faq.question}</h4>
                      </div>
                      {openFaq === index && (
                        <div className="ml-8 mt-4">
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center ml-4">
                      <div className="relative">
                        <div className="w-4 h-0.5 bg-white"></div>
                        {openFaq !== index && (
                          <div className="w-0.5 h-4 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {index < faqs.length - 1 && index !== 6 && (
                  <div className="mx-8 h-px" style={{background: 'linear-gradient(to right, transparent, #E50000, transparent)'}}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4">Choose the plan that's right for you</h2>
              <p className="text-gray-400 max-w-2xl">
                Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!
              </p>
            </div>
            <div className="flex items-center rounded-lg p-1" style={{backgroundColor: '#0F0F0F', border: '1px solid #262626'}}>
              <button className="px-6 py-2 text-white rounded-md" style={{backgroundColor: '#1A1A1A'}}>Monthly</button>
              <button className="px-6 py-2 text-gray-400 rounded-md hover:text-white transition-colors">Yearly</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className="rounded-xl p-8 flex flex-col" style={{backgroundColor: '#1A1A1A', border: '1px solid #262626'}}>
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed flex-grow">{plan.description}</p>
                <div className="text-4xl font-bold mb-8">
                  {plan.price}<span className="text-lg text-gray-400 font-normal">/month</span>
                </div>
                <div className="flex gap-3 mt-auto">
                  <button className="flex-1 py-3 text-white rounded-md transition-colors" style={{backgroundColor: '#0F0F0F'}}>
                    Start Free Trial
                  </button>
                  <button className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FreeTrialCTA />
      <Footer />
    </div>
  )
}