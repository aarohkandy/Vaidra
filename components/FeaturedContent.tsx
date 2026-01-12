import Link from 'next/link'

interface FeaturedItem {
  id: string
  title: string
  titleNative?: string
  author?: string
  category: string
  language: string
  type: 'audiobook' | 'course' | 'research'
  level?: string
}

interface FeaturedContentProps {
  title: string
  items: FeaturedItem[]
  viewAllLink: string
}

export default function FeaturedContent({ title, items, viewAllLink }: FeaturedContentProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <Link href={viewAllLink} className="text-[#0045A5] hover:underline font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  {item.titleNative && (
                    <p className="text-sm text-gray-600 mb-2">{item.titleNative}</p>
                  )}
                  {item.author && (
                    <p className="text-sm text-gray-500">by {item.author}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {item.category}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  {item.language}
                </span>
                {item.level && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                    {item.level}
                  </span>
                )}
              </div>
              <Link
                href={`/${item.type === 'audiobook' ? 'browse' : item.type === 'course' ? 'categories' : 'research'}/${item.id}`}
                className="mt-4 inline-block text-[#0045A5] hover:underline text-sm font-medium"
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

