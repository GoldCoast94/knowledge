export type Exercise = {
  type: string;
  question: string;
  items?: string[];
  answer: string;
  analysis: string;
};

export type Lesson = {
  id: string;
  title: string;
  focus: string;
  time: string;
  method: string;
  tags: string[];
  objectives: string[];
  explain: { title: string; body: string[] }[];
  patterns: string[][];
  vocabulary: string[][];
  examples: { jp: string; cn: string; note: string }[];
  exercises: Exercise[];
  review: string[];
};

export type Month = {
  month: number;
  level: string;
  title: string;
  goal: string;
  weeks: Lesson[];
};

export type TopicWeek = {
  title: string;
  focus: string;
  tags: string[];
  grammar: string[];
  vocab: string[];
  task: string;
};

export type Topic = {
  level: string;
  monthTitle: string;
  monthGoal: string;
  weeks: TopicWeek[];
};

export type SidebarWeek = {
  id: string;
  title: string;
  focus: string;
  tags: string[];
};

export type SidebarMonth = {
  title: string;
  level: string;
  weeks: SidebarWeek[];
};
