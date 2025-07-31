import { NavLink } from 'react-router-dom';

const CategoryButtons = ({ activeCategory = 'all', onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'All', icon: '✨' },
    { id: 'optimize', name: 'Optimize', icon: '⚡' },
    { id: 'create', name: 'Create', icon: '🎨' },
    { id: 'modify', name: 'Modify', icon: '✂️' },
    { id: 'convert', name: 'Convert', icon: '🔄' },
    { id: 'security', name: 'Security', icon: '🔒' }
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((category) => (
        <NavLink
          key={category.id}
          to={`/tools?category=${category.id}`}
          className={({ isActive }) => 
            `flex items-center px-5 py-2 rounded-full transition-all ${
              isActive || activeCategory === category.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.name}
        </NavLink>
      ))}
    </div>
  );
};

export default CategoryButtons;