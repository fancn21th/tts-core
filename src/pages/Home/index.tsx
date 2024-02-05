import React from "react";

const Home: React.FC = () => {
  return (
    <div>
      <h1>这是父应用列表</h1>
      <iframe title="App" src="./detail" width="600" height="400"></iframe>
    </div>
  );
};

export default Home;
