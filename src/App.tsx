import { useState } from 'react'
import styled from 'styled-components'

const Div = styled.div`
  background-color: red;
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid black;
  width: 100px;
  height: 100px;
`;
 
function App() {
   
  return (
    <>
      <h1>Vite + React</h1>
      <i className="fa fa-camera-retro"></i>
      <div>
        <Div>123</Div>
        <p>
         123
        </p>
      </div>
    </>
  )
}

export default App
