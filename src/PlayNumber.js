import React from 'react';

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

const PlayNumber = (props) =>{
  return(
    <button className="number" 
      onClick={()=>props.onClick(props.number,props.status)}
      style={{backgroundColor : colors[props.status]}}
    >
      {props.number}
    </button>
  );
};

export default PlayNumber;