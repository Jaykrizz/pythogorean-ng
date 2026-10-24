export interface AssessmentItem {
  id: number;
  name: string;
  className: string;
  subjectName: string;
  topicName: string;
}

export interface TopicChoice {
  id: number;
  label: string;
}

export interface LiveQuestion {
  id: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctLetter: string;
  marks: number;
}

export interface LiveStudent {
  studentId: number;
  name: string;
  email: string;
  markerId: number;
}

export interface LiveSession {
  id: number;
  name: string;
  className: string;
  questions: LiveQuestion[];
  students: LiveStudent[];
}

export interface CapturedAnswer {
  studentId: number;
  markerId: number;
  letter: string;
}
