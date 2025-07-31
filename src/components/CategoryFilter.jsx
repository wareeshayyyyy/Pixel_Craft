import { useSearchParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const CategoryFilter = ({ tools }) => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const categories = [
    { id: 'all', name: 'All Tools', icon: '🧰' },
    { id: 'optimize', name: 'Optimize', icon: '⚡', desc: 'Compress, resize & more' },
    { id: 'edit', name: 'Edit', icon: '✏️', desc: 'Crop, rotate & enhance' },
    { id: 'convert', name: 'Convert', icon: '🔄', desc: 'Change image formats' },
    { id: 'other', name: 'Other Tools', icon: '🔧', desc: 'Specialized utilities' }
  ];

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Category Navigation - matches iloveimg style */}
      <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar">
        {categories.map((category) => (
          <NavLink
            key={category.id}
            to={`?category=${category.id}`}
            className={({ isActive }) => `
              flex flex-col items-center px-6 py-4 rounded-lg mx-1 min-w-[120px]
              transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}
            `}
          >
            <span className="text-2xl mb-2">{category.icon}</span>
            <span className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
              {category.name}
            </span>
            {category.desc && (
              <span className="text-xs text-gray-500 mt-1">{category.desc}</span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Tool Grid - iloveimg style cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map(tool => (
          <div key={tool.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <div className="p-5">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{tool.icon}</span>
                <h3 className="font-semibold text-lg">{tool.name}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
              <NavLink
                to={tool.path}
                className="inline-block w-full py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Select
              </NavLink>
            </div>
          </div>
        ))}
      </div>

      {/* CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;