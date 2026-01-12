import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-[#0045A5]">
            VAIDRA
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#0045A5] transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-gray-700 hover:text-[#0045A5] transition-colors">
              Browse Audiobooks
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-[#0045A5] transition-colors">
              Categories
            </Link>
            <Link href="/research" className="text-gray-700 hover:text-[#0045A5] transition-colors">
              Research Papers
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#0045A5] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#0045A5] transition-colors">
              Contact
            </Link>
          </div>
          <div className="md:hidden">
            <button className="text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

