"use client";

import { useState } from "react";
import type { Exercise } from "@/lib/types";

type Props = {
  exercises: Exercise[];
  lessonId: string;
};

export default function Exercises({ exercises, lessonId }: Props) {
  return (
    <article className="section">
      <h3>练习题</h3>
      {exercises.map((exercise, index) => (
        <ExerciseItem key={`${lessonId}-${index}`} exercise={exercise} index={index} />
      ))}
    </article>
  );
}

function ExerciseItem({ exercise, index }: { exercise: Exercise; index: number }) {
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (value: string) => {
    if (submitted) return;
    setSelected(value);
    setShowResult(true);
    setSubmitted(true);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResult(true);
  };

  const handleReset = () => {
    setShowResult(false);
    setSelected(null);
    setUserInput("");
    setSubmitted(false);
  };

  const isCorrect = selected === exercise.answer;

  return (
    <section className={`exercise-item ${submitted ? (isCorrect ? "correct" : "incorrect") : ""}`}>
      <div className="exercise-header">
        <span className="exercise-num">{index + 1}</span>
        <h4>{exercise.type}</h4>
        {submitted && (
          <span className={`exercise-badge ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? "正确" : "再想想"}
          </span>
        )}
      </div>
      <p className="exercise-question">{exercise.question}</p>

      {exercise.items && (exercise.type === "选择题" || exercise.type === "判断对错") ? (
        <div className="choice-grid">
          {exercise.items.map((item) => {
            const isChoiceType = exercise.type === "选择题";
            const label = isChoiceType ? item.slice(0, 1) : item.slice(0, 1);
            const text = isChoiceType ? item.slice(3) : item;
            let stateClass = "";
            if (submitted) {
              if (item === exercise.answer) stateClass = "is-correct";
              else if (selected === item) stateClass = "is-wrong";
            }
            return (
              <button
                key={item}
                className={`choice-btn ${stateClass} ${selected === item ? "selected" : ""}`}
                onClick={() => handleSelect(item)}
                disabled={submitted}
                type="button"
              >
                <span className="choice-label">{label}</span>
                <span>{text}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {(exercise.type === "填空题" || exercise.type === "助词填空" || exercise.type === "词形变换" || exercise.type === "配对题") ? (
        <div className="fill-input-group">
          <input
            className="fill-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="输入你的答案..."
            disabled={submitted}
          />
          {!submitted ? (
            <button className="submit-btn" onClick={handleSubmit} type="button">
              提交
            </button>
          ) : null}
        </div>
      ) : null}

      {exercise.type === "翻译题" || exercise.type === "造句题" ? (
        <div className="fill-input-group">
          <textarea
            className="fill-input fill-textarea"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="输入你的翻译..."
            disabled={submitted}
            rows={3}
          />
          {!submitted ? (
            <button className="submit-btn" onClick={handleSubmit} type="button">
              提交
            </button>
          ) : null}
        </div>
      ) : null}

      {showResult ? (
        <div className="result-box">
          <div className="result-answer">
            <strong>答案：</strong>
            <span>{exercise.answer}</span>
          </div>
          <div className="result-analysis">
            <strong>解析：</strong>
            <span>{exercise.analysis}</span>
          </div>
          <button className="retry-btn" onClick={handleReset} type="button">
            重新练习
          </button>
        </div>
      ) : null}
    </section>
  );
}
