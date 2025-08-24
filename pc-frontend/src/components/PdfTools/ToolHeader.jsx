const ToolHeader = ({ title, description, icon }) => {
  return (
    <div className="tool-header">
      {icon && <div className="tool-icon">{icon}</div>}
      <h1>{title}</h1>
      <p className="tool-description">{description}</p>
    </div>
  );
};

export default ToolHeader;