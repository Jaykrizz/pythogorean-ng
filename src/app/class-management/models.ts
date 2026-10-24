export interface ClassSummary {
  id: number;
  name: string;
  studentCount: number;
  subjectCount: number;
}

export interface QuestionItem {
  id: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctLetter: string;
  marks: number;
}

export interface TopicItem {
  id: number;
  name: string;
  shown: boolean;
  questions: QuestionItem[];
}

export interface SubjectItem {
  id: number;
  name: string;
  topics: TopicItem[];
}

export interface StudentCard {
  studentId: number;
  name: string;
  email: string;
  markerId: number;
}

export interface ClassDetail {
  id: number;
  name: string;
  subjects: SubjectItem[];
  students: StudentCard[];
}

export interface PersonOption {
  id: number;
  name: string;
  email: string;
}
