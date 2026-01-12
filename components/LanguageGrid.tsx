import Link from 'next/link'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
]

export default function LanguageGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose Your Language</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={`/browse?language=${lang.code}`}
              className="bg-gray-50 hover:bg-[#0045A5] hover:text-white rounded-lg p-6 text-center transition-colors border border-gray-200 hover:border-[#0045A5]"
            >
              <div className="font-semibold text-lg mb-1">{lang.name}</div>
              {lang.native && (
                <div className="text-sm text-gray-600 hover:text-white">{lang.native}</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

