const ToolOptions = ({ options, onOptionsChange, toolSpecificOptions = [] }) => {
  const handleOptionChange = (name, value) => {
    onOptionsChange({
      ...options,
      [name]: value,
    });
  };

  return (
    <div className="tool-options-panel">
      <h3>Options</h3>
      {toolSpecificOptions.map((option) => (
        <div key={option.name} className="option-item">
          <label>{option.label}</label>
          {option.type === "select" ? (
            <select
              value={options[option.name] || ""}
              onChange={(e) => handleOptionChange(option.name, e.target.value)}
            >
              {option.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : option.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={options[option.name] || false}
              onChange={(e) => handleOptionChange(option.name, e.target.checked)}
            />
          ) : (
            <input
              type={option.type || "text"}
              value={options[option.name] || ""}
              onChange={(e) => handleOptionChange(option.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ToolOptions;