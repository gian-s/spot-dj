
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.css';
import Dashboard from './Dashboard';

const code = new URLSearchParams(window.location.search).get('code');

function App() {
  
  return code ? <Dashboard code ={code}/> : <Login/>

}

export default App;