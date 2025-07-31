const PdfToolList = ({ tools }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <div key={tool.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">{tool.icon}</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{tool.name}</h3>
          <p className="text-gray-600 mb-4">{tool.description}</p>
          {tool.path && (
            <a
              href={`/pdf-tools${tool.path}`}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              Use Tool →
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default PdfToolList;