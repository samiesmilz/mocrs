import { Link } from "react-router-dom";
import logo from "../../assets/mocrs.gif";

import "./Home.css";

const Home = () => {
  return (
    <div className="Home">
      <img
        src={logo}
        href="https://mocrs.com"
        alt="mocrs logo"
        className="App-logo"
      />
      <Link to="/spaces">
        <button className="App-in">Enter mocrs</button>
      </Link>
      <p className="App-join">
        Join <span className="live">live</span> spaces.
      </p>
    </div>
  );
};

export default Home;
