import Link from "next/link";
import {
  Car,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#4A5FBF] text-white">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/car-deposit%20Logo.png"
                alt="Car Deposit logo"
                className="object-contain h-8"
              />
            </Link>

            <p className="text-sm text-blue-200 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin
              turpis pretium donec orci semper. Sit suscipit lacus cras commodo
              in lectus sed egestas. Mattis egestas sit viverra pretium
              tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam
              pulvinar. Odio egestas egestas tristique et lectus viverra in sed
              mauris.
            </p>

            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <Facebook className="w-5 h-5 text-blue-200 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-blue-200 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-blue-200 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-blue-200 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Link href="/" className="block text-blue-200 hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/help-center"
                className="block text-blue-200 hover:text-white transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="block text-blue-200 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/my-account"
                className="block text-blue-200 hover:text-white transition-colors"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Link
                href="/car-auction"
                className="block text-blue-200 hover:text-white transition-colors"
              >
                Car Auction
              </Link>
              <Link
                href="/help-center"
                className="block text-blue-200 hover:text-white transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="block text-blue-200 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/my-account"
                className="block text-blue-200 hover:text-white transition-colors"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Link
                href="/about"
                className="block text-blue-200 hover:text-white transition-colors"
              >
                About us
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-200 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-200">Hot Line Number</p>
                  <p className="font-medium">+054 211 4444</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-200 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-200">Email Id :</p>
                  <p className="font-medium break-all">info@cardeposit.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-200 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-200">
                    Office No 6, SKB Plaza next to Bentley showroom,
                  </p>
                  <p className="text-sm text-blue-200">
                    Umm Al Sheif Street, Sheikh Zayed Road, Dubai, UAE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-400 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-blue-200">
            Copyright 2022 All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
