
const Layout  = ({ children }: {children: React.ReactNode;home?: boolean;}) =>
{
  return (
    <div className="page-container">
      <div className="marge">
      <div className="file-list">
        <h2>Fichiers de contexte</h2>
        <ul>
          <li>Fichier 1</li>
          <li>Fichier 2</li>
          <li>Fichier 3</li>
        </ul>
      </div>
      <div className="menu">
        <h2>Menu</h2>
        <ul>
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      </div>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};


export default Layout;