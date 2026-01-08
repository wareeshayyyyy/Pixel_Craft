import { PdfIcons } from './PdfIcons';

const PdfToolList = ({ tools }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <div key={tool.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="mb-4">
            {PdfIcons[tool.iconType] || PdfIcons.pdf}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{tool.name}</h3>
          <p className="text-gray-600 mb-4 text-sm">{tool.description}</p>
          {tool.path && (
            <a
              href={`/pdf-tools${tool.path}`}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Use Tool <span className="ml-2">→</span>
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default PdfToolList;