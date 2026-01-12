export default function ContactPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-700 mb-4">
            For inquiries, please contact us at:
          </p>
          <a href="mailto:contact@vaidra.org" className="text-[#0045A5] hover:underline text-lg font-medium">
            contact@vaidra.org
          </a>
        </div>
      </div>
    </div>
  )
}

