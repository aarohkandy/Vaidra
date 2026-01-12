export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            At Vaidra, we believe that language should never be a barrier to education and self-improvement. 
            Our mission is to create a repository of quality audiobooks in regional Indian languages, making 
            knowledge accessible to everyone regardless of their linguistic background.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Vaidra is a Section 8 Company registered under the Companies Act, 2013 (India).
          </p>
        </div>
      </div>
    </div>
  )
}

