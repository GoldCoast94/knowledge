import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  text: string;
};

export default function InfoCard({ icon, title, text }: Props) {
  return (
    <article className="info-card">
      <div className="info-icon">{icon}</div>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}
