import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { toggleCart, getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const cartItemsCount = getCartItemsCount()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_166_115" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
                <rect width="48" height="48" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_166_115)">
                <path d="M22 42V26.05C19.8667 26.05 17.8167 25.6413 15.85 24.824C13.8833 24.008 12.15 22.85 10.65 21.35C9.15 19.85 8 18.1167 7.2 16.15C6.4 14.1833 6 12.1333 6 10V6H10C12.1 6 14.1333 6.408 16.1 7.224C18.0667 8.04133 19.8 9.2 21.3 10.7C22.3333 11.7333 23.192 12.8667 23.876 14.1C24.5587 15.3333 25.0833 16.65 25.45 18.05C25.6167 17.8167 25.8 17.592 26 17.376C26.2 17.1587 26.4167 16.9333 26.65 16.7C28.15 15.2 29.8833 14.0413 31.85 13.224C33.8167 12.408 35.8667 12 38 12H42V16C42 18.1333 41.592 20.1833 40.776 22.15C39.9587 24.1167 38.8 25.85 37.3 27.35C35.8 28.85 34.0747 30 32.124 30.8C30.1747 31.6 28.1333 32 26 32V42H22Z" fill="#1C1B1F"/>
              </g>
            </svg>
            <span 
              className="text-gray-900" 
              style={{
                fontFamily: 'Prosto One',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '20px',
                letterSpacing: '0.1px',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
            >
              Brand Name
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/collection" className="text-gray-700 hover:text-gray-900 font-medium" style={{fontFamily: 'Montserrat, sans-serif'}}>
              TEA COLLECTIONS
            </Link>
            <Link to="/accessories" className="text-gray-700 hover:text-gray-900 font-medium" style={{fontFamily: 'Montserrat, sans-serif'}}>
              ACCESSORIES
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-gray-900 font-medium" style={{fontFamily: 'Montserrat, sans-serif'}}>
              BLOG
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium" style={{fontFamily: 'Montserrat, sans-serif'}}>
              CONTACT US
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            {/* Search - Hidden on mobile */}
            <div className="relative hidden sm:block">
              {showSearch ? (
                <div className="flex items-center">
                  <Input 
                    placeholder="Search..." 
                    className="w-64"
                    autoFocus
                    onBlur={() => setShowSearch(false)}
                  />
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSearch(true)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_166_99" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                      <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_166_99)">
                      <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z" fill="#282828"/>
                    </g>
                  </svg>
                </Button>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="mask0_166_102_logged" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                      </mask>
                      <g mask="url(#mask0_166_102_logged)">
                        <path d="M12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM4 20V17.2C4 16.6333 4.146 16.1123 4.438 15.637C4.72933 15.1623 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6457 8.75 13.387C9.81667 13.129 10.9 13 12 13C13.1 13 14.1833 13.129 15.25 13.387C16.3167 13.6457 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2707 15.1623 19.562 15.637C19.854 16.1123 20 16.6333 20 17.2V20H4ZM6 18H18V17.2C18 17.0167 17.9543 16.85 17.863 16.7C17.771 16.55 17.65 16.4333 17.5 16.35C16.6 15.9 15.6917 15.5623 14.775 15.337C13.8583 15.1123 12.9333 15 12 15C11.0667 15 10.1417 15.1123 9.225 15.337C8.30833 15.5623 7.4 15.9 6.5 16.35C6.35 16.4333 6.22933 16.55 6.138 16.7C6.046 16.85 6 17.0167 6 17.2V18ZM12 10C12.55 10 13.021 9.804 13.413 9.412C13.8043 9.02067 14 8.55 14 8C14 7.45 13.8043 6.97933 13.413 6.588C13.021 6.196 12.55 6 12 6C11.45 6 10.9793 6.196 10.588 6.588C10.196 6.97933 10 7.45 10 8C10 8.55 10.196 9.02067 10.588 9.412C10.9793 9.804 11.45 10 12 10Z" fill="black"/>
                      </g>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </DropdownMenuItem>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Admin Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => navigate('/login')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_166_102" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_166_102)">
                    <path d="M12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM4 20V17.2C4 16.6333 4.146 16.1123 4.438 15.637C4.72933 15.1623 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6457 8.75 13.387C9.81667 13.129 10.9 13 12 13C13.1 13 14.1833 13.129 15.25 13.387C16.3167 13.6457 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2707 15.1623 19.562 15.637C19.854 16.1123 20 16.6333 20 17.2V20H4ZM6 18H18V17.2C18 17.0167 17.9543 16.85 17.863 16.7C17.771 16.55 17.65 16.4333 17.5 16.35C16.6 15.9 15.6917 15.5623 14.775 15.337C13.8583 15.1123 12.9333 15 12 15C11.0667 15 10.1417 15.1123 9.225 15.337C8.30833 15.5623 7.4 15.9 6.5 16.35C6.35 16.4333 6.22933 16.55 6.138 16.7C6.046 16.85 6 17.0167 6 17.2V18ZM12 10C12.55 10 13.021 9.804 13.413 9.412C13.8043 9.02067 14 8.55 14 8C14 7.45 13.8043 6.97933 13.413 6.588C13.021 6.196 12.55 6 12 6C11.45 6 10.9793 6.196 10.588 6.588C10.196 6.97933 10 7.45 10 8C10 8.55 10.196 9.02067 10.588 9.412C10.9793 9.804 11.45 10 12 10Z" fill="black"/>
                  </g>
                </svg>
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" onClick={toggleCart} className="hidden sm:block relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_166_105" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_166_105)">
                  <path d="M5 22C4.45 22 3.979 21.8043 3.587 21.413C3.19567 21.021 3 20.55 3 20V8C3 7.45 3.19567 6.97933 3.587 6.588C3.979 6.196 4.45 6 5 6H7C7 4.61667 7.48767 3.43733 8.463 2.462C9.43767 1.48733 10.6167 1 12 1C13.3833 1 14.5627 1.48733 15.538 2.462C16.5127 3.43733 17 4.61667 17 6H19C19.55 6 20.021 6.196 20.413 6.588C20.8043 6.97933 21 7.45 21 8V20C21 20.55 20.8043 21.021 20.413 21.413C20.021 21.8043 19.55 22 19 22H5ZM5 20H19V8H5V20ZM12 14C13.3833 14 14.5627 13.5123 15.538 12.537C16.5127 11.5623 17 10.3833 17 9H15C15 9.83333 14.7083 10.5417 14.125 11.125C13.5417 11.7083 12.8333 12 12 12C11.1667 12 10.4583 11.7083 9.875 11.125C9.29167 10.5417 9 9.83333 9 9H7C7 10.3833 7.48767 11.5623 8.463 12.537C9.43767 13.5123 10.6167 14 12 14ZM9 6H15C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6Z" fill="#282828"/>
                </g>
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link 
                to="/collection" 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                style={{fontFamily: 'Montserrat, sans-serif'}}
                onClick={() => setMobileMenuOpen(false)}
              >
                TEA COLLECTIONS
              </Link>
              <Link 
                to="/accessories" 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                style={{fontFamily: 'Montserrat, sans-serif'}}
                onClick={() => setMobileMenuOpen(false)}
              >
                ACCESSORIES
              </Link>
              <Link 
                to="/blog" 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                style={{fontFamily: 'Montserrat, sans-serif'}}
                onClick={() => setMobileMenuOpen(false)}
              >
                BLOG
              </Link>
              <Link 
                to="/contact" 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                style={{fontFamily: 'Montserrat, sans-serif'}}
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT US
              </Link>
              
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <Input placeholder="Search..." className="w-full" />
              </div>
              
              {/* Mobile Cart */}
              <button 
                onClick={() => {
                  toggleCart()
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 font-medium flex items-center justify-between"
                style={{fontFamily: 'Montserrat, sans-serif'}}
              >
                CART
                {cartItemsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}