import AllProfilesList from '../components/AllProfilesList';

/**
 * ProfilesPage container component rendering the lists of analyzed database items.
 */
export default function ProfilesPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4">
      {/* Title Header Section */}
      <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
        <h1 className="text-3xl font-bold text-[#e6edf3] tracking-tight">
          All Analyzed Profiles
        </h1>
        <p className="text-sm text-[#8b949e] font-medium">
          All GitHub profiles stored and calculated inside your local MySQL database.
        </p>
      </div>

      {/* Grid or table rendering of database list items */}
      <AllProfilesList />
    </div>
  );
}
