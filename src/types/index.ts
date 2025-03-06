// 定义选考科目类型
export type SubjectType = '物理' | '化学' | '生物' | '历史' | '地理' | '政治' | '技术';

// 定义学考成绩类型
export type GradeType = 'A' | 'B' | 'C' | 'D' | 'E';

// 定义学科成绩映射
export interface SubjectGradeMap {
  语文: GradeType;
  数学: GradeType;
  外语: GradeType;
  物理: GradeType;
  化学: GradeType;
  生物: GradeType;
  历史: GradeType;
  地理: GradeType;
  政治: GradeType;
  技术: GradeType;
}

// 定义用户选择的数据
export interface UserSelection {
  selectedSubjects: SubjectType[];
  subjectGrades: SubjectGradeMap;
}

// 定义专业组数据结构
export interface MajorGroup {
  school: string;
  group: string;
  A_rate: number;
  B_rate: number;
  C_rate: number;
  D_rate: number;
  E_rate: number;
  required_subjects: SubjectType[];
  score: number;
}

// 定义计算结果
export interface CalculationResult {
  school: string;
  group: string;
  totalScore: number;
  isEligible: boolean;
}