import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-400 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-medium mb-4">CineGhar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Account
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Billing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Plans & Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Supported Devices
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Cookie Preferences
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://www.facebook.com/Rojan.karki.52687" className="hover:text-red-600 transition-colors">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-sm text-center">
          <p>© 2023 CineGhar Nepal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
