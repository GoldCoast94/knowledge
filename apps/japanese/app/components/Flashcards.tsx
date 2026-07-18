"use client";

import { ArrowLeft, ArrowRight, RotateCcw, Shuffle } from "lucide-react";
import { useCallback, useState } from "react";

type Card = {
  word: string;
  reading: string;
  meaning: string;
  usage: string;
};

type Props = {
  cards: Card[];
};

function createCardOrder(length: number) {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Flashcards({ cards }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [order, setOrder] = useState<number[]>(() =>
    createCardOrder(cards.length)
  );

  const shuffle = useCallback(() => {
    const arr = createCardOrder(cards.length);
    setOrder(arr);
    setIndex(0);
    setFlipped(false);
  }, [cards.length]);

  const current = cards[order[index]] ?? cards[0];

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i > 0 ? i - 1 : order.length - 1));
  };

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i < order.length - 1 ? i + 1 : 0));
  };

  if (!cards.length) return null;

  return (
    <article className="section">
      <h3>
        词汇闪卡
        <span className="card-counter">
          {index + 1} / {cards.length}
        </span>
      </h3>

      <div
        className={`flashcard ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <span className="flashcard-word">{current.word}</span>
            <span className="flashcard-hint">点击翻转</span>
          </div>
          <div className="flashcard-back">
            <span className="flashcard-reading">{current.reading}</span>
            <span className="flashcard-meaning">{current.meaning}</span>
            <span className="flashcard-usage">{current.usage}</span>
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button className="flashcard-btn" onClick={prev} type="button">
          <ArrowLeft size={18} /> 上一张
        </button>
        <button
          className="flashcard-btn"
          onClick={() => setFlipped(!flipped)}
          type="button"
        >
          <RotateCcw size={18} /> 翻转
        </button>
        <button className="flashcard-btn" onClick={shuffle} type="button">
          <Shuffle size={18} /> 洗牌
        </button>
        <button className="flashcard-btn" onClick={next} type="button">
          下一张 <ArrowRight size={18} />
        </button>
      </div>
    </article>
  );
}
