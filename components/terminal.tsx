const Terminal = () => {
    return (
      <div className="terminal">
        <div className="terminal__line">Une ligne du terminal</div>
        <div className="terminal__prompt">
          <div className="terminal__prompt__label">Vous:</div>
          <div className="terminal__prompt__input">
            <input title="entrez" type="text" />
          </div>
        </div>
      </div>
    );
  };

  export default Terminal;