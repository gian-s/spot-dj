import React from 'react'
import { Container } from 'react-bootstrap';

//import { AUTH_URL } from './server';


//console.log(process.env.REACT_APP_APP_URL);

const AUTH_URL = import.meta.env.VITE_APP_URL;
console.log(AUTH_URL);
export default function Login() {
  return (
    <div>

     <Container className = "d-flex justify-content-center align-items-center">
        <a className='btn btn-success btn-lg' href={AUTH_URL}>
            Login With Spotify
        </a>
    
    </Container>

    </div>
  )
}
