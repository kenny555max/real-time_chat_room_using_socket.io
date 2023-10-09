import { useState } from "react"

const Join = ({ onSubmit, room, username, setRoom, setUsername }) => {
    return (
        <div className="join">
            <h1>Join</h1>
            <div className="divider"></div>
            <form onSubmit={onSubmit}>
                <div className="username">
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                </div>
                <div className="room">
                    <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room" />
                </div>
                <div className="submit">
                    <button disabled={username === '' || room === '' ? true : false} type="submit">sign in</button>
                </div>
            </form>
        </div>
    )
}

export default Join