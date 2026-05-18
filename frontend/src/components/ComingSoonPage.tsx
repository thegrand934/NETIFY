import Link from 'next/link';

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-24">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      <p className="text-gray-400 max-w-md mb-8">
        This section is coming soon. Check back later for new content on NETIFY.
      </p>
      <Link
        href="/"
        className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
