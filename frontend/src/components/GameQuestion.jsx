import React from 'react';
import { Typography } from '@material-ui/core';
import { Video } from './PlayerGame';

export default function GameQuestion ({ CurrentQuestion, handleAnswersEnter, handleAnswersLeave, handleClickAnswers, remainingTime }) {
  function getColor (index) {
    const colors = ['#FF9800', '#2196F3', '#4CAF50', '#E91E63', '#9C27B0', '#00BCD4'];
    return colors[index];
  }
  return (
        <div style={{ textAlign: 'center' }}>
            {CurrentQuestion.question
              ? (
                <>
                <Typography variant="h2">{CurrentQuestion.question.question}</Typography>
                {CurrentQuestion.question.photo
                  ? (
                    <img src={CurrentQuestion.question.photo} alt="Image displayed for Question" style={{ maxWidth: '50%' }} />
                    )
                  : null}
                {CurrentQuestion.question.url
                  ? (<Video alt="Question Video" videoUrl={CurrentQuestion.question.url} />)
                  : null}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                    <Typography variant="h5">
                    {CurrentQuestion.question.type === 'single-answer' ? 'Single Choice' : 'Multiple Choice'}
                    </Typography>
                    <Typography variant="h5">
                    {CurrentQuestion.question.points} points
                    </Typography>
                </div>
                <br />
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '80px' }}>
                    {Object.entries(CurrentQuestion.question.answers).map(([key, value], index) => (
                    <div key={key} value={index} style={{
                      backgroundColor: getColor(index),
                      width: '40%',
                      height: '150px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: remainingTime !== 0 ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease-in-out',
                      transform: remainingTime === 0
                        ? CurrentQuestion.question.checkedAnswers[index] ? 'scale(1.15)' : 'scale(1)'
                        : 'scale(1)',
                      opacity: remainingTime === 0
                        ? CurrentQuestion.question.checkedAnswers[index] ? 1 : 0.5
                        : 1,
                      border: remainingTime === 0
                        ? CurrentQuestion.question.checkedAnswers[index] ? '3px solid green' : 'none'
                        : 1
                    }} onMouseEnter={handleAnswersEnter}
                        onMouseLeave={handleAnswersLeave}
                        onClick={handleClickAnswers}
                    >
                        <Typography variant="h3">{value}</Typography>
                    </div>
                    ))}
                    </div>
                    <br />
                    <Typography variant="h5">Time remaining: {remainingTime} seconds</Typography>
                </>
                )
              : (
            <Typography variant="h2">No questions available</Typography>
                )}
        </div>
  )
}
