import React from "react";

const Connected = (props) =>{
    return(
        <div className="login-container">
            <h1 className="connected-header">You are connected to MetaMask</h1>
            <p className="connected-account">MetaMask account: {props.account}</p>
            <p className="connected-account">Remaining time: {props.remainingTime}</p>

            {props.showButton ? (
                <p className="connected-account">You have already voted: {props.account}</p>
            ) : (
                <div>
                    <input type="number" placeholder="Enter candidate index" value={props.number} onChange={props.handleNumberChange}></input>
                    <br></br>
                    <button className="login-button" onClick={props.voteFunction}>Vote</button>
                </div>
            )}

            {props.showFinishButton && (
                <div>
                    <button className="login-button" onClick={props.finishVoting}>Finish Voting</button>
                </div>
            )}

            <table id="myTable" className="candidates-table">
                <thead>
                    <tr>
                    <th>Index</th>
                    <th>Candidate name</th>
                    <th>Candidate votes</th>
                    </tr>
                </thead>
                <tbody>
                  {props.candidates.map((candidate, index) => (
                    <tr key={index}>
                        <td>{candidate.index}</td>
                        <td>{candidate.name}</td>
                        <td>{candidate.voteCount}</td>
                    </tr>
                  ))}  
                </tbody>
            </table>
        </div>
    )
}

export default Connected;
