import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  X,
} from "lucide-react";
import Image from "next/image";

function Footer() {
  return (
    <div className="relative bottom-0 left-0 right-0 mt-12">
      {/* WhatsApp Group Section */}
      <div className="bg-[#1c2b3a] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold mb-2">
                Join our WhatsApp Group
              </h3>
              <p className="text-sm text-gray-300">
                Stay up to date, give feedback, and get the latest news directly
                in our WhatsApp group.
              </p>
            </div>
            <div className="md:w-1/3 w-full">
              <a
                href="https://chat.whatsapp.com/C07aVRHcM8SHb02BZzBCJH"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#fcecd8] to-[#fcecd8] text-[#1c2b3a] font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-center w-full"
              >
                Join WhatsApp Group
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer
        className="relative bg-cover bg-center text-[#1c2b3a] px-4 py-12"
        style={{
          backgroundImage:
            "url('/stock-market-chart-abstract-financial-background-67569652.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#fcecd8]/80 backdrop-blur-sm"></div>

        <div className="relative max-w-7xl mx-auto z-10">
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Column 1: About */}
            <div>
              <div className="mb-4 flex items-center">
                <Image
                  src="/jale logo.png"
                  alt="Jàle Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <div>
                  <h3 className="font-bold text-xl">Jàle</h3>
                  <p className="text-xs opacity-80">Market wey you fit price</p>
                </div>
              </div>
              <p className="text-sm mb-4">
                Jàle is Nigeria's premier marketplace where buyers and sellers
                connect to negotiate and trade goods at the best prices.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1c2b3a] text-white p-2 rounded-full hover:opacity-80 transition-opacity"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1c2b3a] text-white p-2 rounded-full hover:opacity-80 transition-opacity"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1c2b3a] text-white p-2 rounded-full hover:opacity-80 transition-opacity"
                >
                  <X size={16} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-[#1c2b3a]/20 pb-2">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {/* <li>
                  <Link
                    href="/"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    About Us
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/myproducts"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    Sell on Jàle
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    FAQ
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="mailto:jale.official.contact@gmail.com"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Categories */}
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-[#1c2b3a]/20 pb-2">
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    Fashion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    Home & Office
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    Phones & Tablets
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/"
                    className="text-sm flex items-center hover:text-[#1c2b3a]/70 transition-colors"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    Services
                  </Link>
                </li> */}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-[#1c2b3a]/20 pb-2">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin
                    size={18}
                    className="mr-2 mt-0.5 flex-shrink-0 text-[#1c2b3a]"
                  />
                  <span className="text-sm">Unilag, Lagos, Nigeria</span>
                </li>
                <li className="flex items-center">
                  <Phone
                    size={18}
                    className="mr-2 flex-shrink-0 text-[#1c2b3a]"
                  />
                  <span className="text-sm">+234 704 693 8727</span>
                </li>
                <li className="flex items-center">
                  <Mail
                    size={18}
                    className="mr-2 flex-shrink-0 text-[#1c2b3a]"
                  />
                  <span className="text-sm">
                    jale.official.contact@gmail.com
                  </span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-xs font-medium">Business Hours:</p>
                <p className="text-xs">Monday - Friday: 9am - 6pm</p>
                <p className="text-xs">Saturday: 10am - 4pm</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-6 border-t border-[#1c2b3a]/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex space-x-6 text-xs font-medium">
              <Link href="/" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="/" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/" className="hover:underline">
                Shipping Policy
              </Link>
            </div>

            <p className="text-xs opacity-60">
              &copy; {new Date().getFullYear()} Jàle Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* App Banner */}
      <div className="bg-gradient-to-r from-[#1c2b3a] to-[#1c2b3a]/90 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <p className="font-bold">Download the Jàle App</p>
            <p className="text-xs text-gray-300">
              Get exclusive deals and faster negotiations
            </p>
          </div>
          <div className="flex space-x-3">
            <a
              href="#"
              className="bg-black text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-900 transition-colors"
            >
              <div className="mr-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.5,2H8.5C6.5,2,5,3.5,5,5.5v13C5,20.5,6.5,22,8.5,22h9c2,0,3.5-1.5,3.5-3.5v-13C21,3.5,19.5,2,17.5,2z M13,20.5h-2v-1h2V20.5z M18,17.5H8V5h10V17.5z" />
                </svg>
              </div>
              <div>
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-bold">App Store</div>
              </div>
            </a>
            <a
              href="#"
              className="bg-black text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-900 transition-colors"
            >
              <div className="mr-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.9,3.9,2.6,4.3,3l12.3,8.5c0.4,0.3,0.4,0.9,0,1.2L4.3,21.4C3.9,21.7,3,21.4,3,20.5z" />
                </svg>
              </div>
              <div>
                <div className="text-xs">GET IT ON</div>
                <div className="text-sm font-bold">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
