
const Navbar = ({ onViewChange, currentView, views }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Tzolk'in Matrix</h1>
        <div className="view-selector">
          <button 
            className={currentView === views.FRACTAL ? 'active' : ''}
            onClick={() => onViewChange(views.FRACTAL)}
          >
            4D Fractal
          </button>
          <button 
            className={currentView === views.TODAY ? 'active' : ''}
            onClick={() => onViewChange(views.TODAY)}
          >
            Today
          </button>
          <button 
            className={currentView === views.CIRCULAR ? 'active' : ''}
            onClick={() => onViewChange(views.CIRCULAR)}
          >
            Circular
          </button>
          <button 
            className={currentView === views.SPIRAL ? 'active' : ''}
            onClick={() => onViewChange(views.SPIRAL)}
          >
            Spiral
          </button>
          <button 
            className={currentView === views.TIMELINE ? 'active' : ''}
            onClick={() => onViewChange(views.TIMELINE)}
          >
            Timeline
          </button>
          <button 
            className={currentView === views.MATRIX ? 'active' : ''}
            onClick={() => onViewChange(views.MATRIX)}
          >
            Matrix
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;