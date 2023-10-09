import Chat from "./components/Chat";
import Join from "./components/Join";

import './App.css';
import { useState } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();

    setIsLoggedIn(true);
  }

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Join onSubmit={onSubmit} room={room} username={username} setUsername={setUsername} setRoom={setRoom} />
      ): (
        <Chat isLoggedIn={isLoggedIn} room={room} username={username} />   
      )}
    </div>
  )
}

export default App;