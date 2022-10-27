import Login from "./Login";
import "bootstrap/dist/css/bootstrap.css";
import Dashboard from "./Dashboard";
import CollapsibleTable from "./CollapsibleTable";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  //
  return code ? <CollapsibleTable code={code} /> : <Login />;
}

export default App;
