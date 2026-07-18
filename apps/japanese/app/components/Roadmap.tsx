import { ChevronRight } from "lucide-react";

type Props = {
  items: string[];
};

export default function Roadmap({ items }: Props) {
  return (
    <section className="roadmap" aria-label="年度路线">
      {items.map((item) => (
        <article key={item}>
          <ChevronRight size={18} />
          <p>{item}</p>
        </article>
      ))}
    </section>
  );
}
