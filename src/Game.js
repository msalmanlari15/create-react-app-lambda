import React, { useState, useEffect } from 'react';
import utils from './math-utils';
import DisplayStars from './DisplayStars';
import PlayNumber from './PlayNumber';
import PlayAgain from './PlayAgain';

//Custom Hook
const useGameState=()=>{
  const [stars,setStars]=useState(utils.random(1,9));
  const [availableNums,setAvailableNums]=useState(utils.range(1,9));
  const [candidateNums,setCandidateNums]=useState([]);
  const [secondsLeft, setSecondsLeft]=useState(10);
    
  useEffect(()=>{
    if (secondsLeft>0 && availableNums.length>0){
      const timerId = setTimeout(()=>{
        setSecondsLeft(secondsLeft-1);
      },1000);
      return () => clearTimeout(timerId);
    }
  });
  
  const setGameState=(newCandidateNums)=>{
    if(utils.sum(newCandidateNums) !== stars){
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums= availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums,9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };
    
  return {stars, availableNums, candidateNums, secondsLeft, setGameState};
  
};
  
const Game=(props)=>{
  const {
    stars, 
    availableNums, 
    candidateNums, 
    secondsLeft, 
    setGameState,
  }=useGameState();
    
  const candidateNumsWrong= utils.sum(candidateNums) > stars;
  const gameStatus = availableNums.length===0
    ? 'won'
    : secondsLeft === 0 ? 'lost' : 'active';
    
  const numberStatus=(number)=>{
    if(!availableNums.includes(number)){
      return 'used';
    }
    if(candidateNums.includes(number)){
      return candidateNumsWrong? 'wrong' : 'candidate';
    }
    return 'available';
  };
    
  const onNumberClick=(number, currentStatus)=>{
    if (currentStatus == 'used' || gameStatus!='active'){
      return;
    }
    const newCandidateNums = 
        currentStatus === 'available' 
          ? candidateNums.concat(number)
          : candidateNums.filter(cn => cn!==number);
      
    setGameState(newCandidateNums);
  };
    
  return(
    <div className="fullgame">
      <div className="header">Star Match for Kids</div>
      <div className="game">
        <div className="help">Pick one or more number whose sum is equal to number of stars on the left</div>
        <div className="arena">
          <div className="left">
            {gameStatus !== 'active' 
              ? (<PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>)
              : (<DisplayStars count={stars} />)
            }
          </div>
          <div className="right">
            {utils.range(1,9).map(number=>
              <PlayNumber 
                key={number} 
                status={numberStatus(number)}
                onClick={onNumberClick}
                number={number}/>
            )}
          </div>
        </div>
      </div>
      <div className="timer">Time Remaining : {secondsLeft}</div>
    </div>
  );
};
  
export default Game;