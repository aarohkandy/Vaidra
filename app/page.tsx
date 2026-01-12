import Link from 'next/link'
import FeaturedContent from '@/components/FeaturedContent'
import LanguageGrid from '@/components/LanguageGrid'

// Mock data - will be replaced with API calls
const featuredAudiobooks = [
  {
    id: '1',
    title: 'திருவள்ளுவர்-நாயனாரின் \'புனித\' குறள்',
    author: 'திருவள்ளுவர் (Thiruvalluvar)',
    category: 'Self Improvement',
    language: 'Tamil',
    type: 'audiobook' as const,
  },
  {
    id: '2',
    title: 'Bhagavad Gita',
    author: 'Original by Vyasa',
    category: 'Self Improvement',
    language: 'Marathi',
    type: 'audiobook' as const,
  },
  {
    id: '3',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self Improvement',
    language: 'Hindi',
    type: 'audiobook' as const,
  },
]

const featuredCourses = [
  {
    id: '1',
    title: 'Basics of Cell Biology',
    titleNative: 'செல் உயிரியலின் அடிப்படைகள்',
    category: 'Science',
    language: 'Tamil',
    level: 'Advanced',
    type: 'course' as const,
  },
  {
    id: '2',
    title: 'NCERT 10th Class Physics Review',
    titleNative: 'NCERT 10వ తరగతి ఫిజిక్స్ సమీక్ష',
    category: 'Science',
    language: 'Telugu',
    level: 'Advanced',
    type: 'course' as const,
  },
  {
    id: '3',
    title: 'वैश्विक टेपेस्ट्री',
    titleNative: 'Global Tapestry',
    category: 'History',
    language: 'Hindi',
    level: 'Intermediate',
    type: 'course' as const,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Access free educational and self-improvement audiobooks in regional Indian languages.
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Empower yourself with knowledge in your mother tongue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="bg-[#0045A5] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#003a8a] transition-colors"
            >
              Browse Audiobooks
            </Link>
            <Link
              href="/categories"
              className="bg-white text-[#0045A5] px-8 py-3 rounded-lg font-semibold border-2 border-[#0045A5] hover:bg-blue-50 transition-colors"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At Vaidra, we believe that language should never be a barrier to education and self-improvement. 
            Our mission is to create a repository of quality audiobooks in regional Indian languages, making 
            knowledge accessible to everyone regardless of their linguistic background.
          </p>
        </div>
      </section>

      {/* Featured Audiobooks */}
      <FeaturedContent
        title="Featured Audiobooks"
        items={featuredAudiobooks}
        viewAllLink="/browse"
      />

      {/* Featured Courses */}
      <FeaturedContent
        title="Featured Courses"
        items={featuredCourses}
        viewAllLink="/categories"
      />

      {/* Language Grid */}
      <LanguageGrid />

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Self Improvement', 'Education', 'Leadership', 'Business', 'Technology', 'Humanities', 'Health & Wellness', 'Career Development'].map((category) => (
              <Link
                key={category}
                href={`/categories?category=${encodeURIComponent(category)}`}
                className="bg-gray-50 hover:bg-[#0045A5] hover:text-white rounded-lg p-6 text-center transition-colors border border-gray-200 hover:border-[#0045A5] font-medium"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

