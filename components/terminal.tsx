const Terminal = () => {
    return (
      <div className="terminal">
        <div className="terminal__line">A terminal line</div>
        <div className="terminal__prompt">
          <div className="terminal__prompt__label">alexandru.tasica:</div>
          <div className="terminal__prompt__input">
            <input type="text" />
          </div>
        </div>
      </div>
    );
  };

  export default Terminal;