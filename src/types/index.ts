// 기본 타입 정의
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// 놀이 관련 타입
export interface PlayItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

// 사운드 관련 타입
export interface SoundItem {
  id: string;
  name: string;
  src: string;
  category: 'animal' | 'vehicle' | 'instrument' | 'nature' | 'food';
  volume?: number;
}

// 색상/도형 관련 타입
export interface ShapeItem {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'rectangle' | 'star';
  color: string;
  x: number;
  y: number;
  size: number;
  speed?: number;
}

// 퍼즐 관련 타입
export interface PuzzlePiece {
  id: string;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  imageUrl: string;
  isPlaced: boolean;
}

// 스티커 관련 타입
export interface Sticker {
  id: string;
  imageUrl: string;
  category: 'animal' | 'object' | 'character' | 'nature';
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

// 게임 상태 관련 타입
export interface GameState {
  score: number;
  level: number;
  isPlaying: boolean;
  timeLeft?: number;
  completedItems: string[];
}

// 설정 관련 타입
export interface AppSettings {
  soundEnabled: boolean;
  volume: number;
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  debugMode: boolean;
}

// 색깔/도형 놀이 관련 타입
export type ColorType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan';
export type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond';

export interface ColorShapeQuestion {
  id: string;
  type: 'color' | 'shape';
  target: ColorType | ShapeType;
  options: ColorShapeOption[];
  correctOptionIndex: number;
}

export interface ColorShapeOption {
  id: string;
  color: ColorType;
  shape: ShapeType;
  isCorrect: boolean;
}

export type ColorShapeDifficulty = 'easy' | 'hard';

export interface ColorShapeGameState {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  correctAnswers: number;
  isCompleted: boolean;
  startTime: number | null;
  endTime: number | null;
  difficulty: ColorShapeDifficulty | null;
}
