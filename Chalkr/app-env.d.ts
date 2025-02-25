// @ts-ignore
/// <reference types="nativewind/types" />
declare module "*.png";

type ClimbingStyle =
  | "board"
  | "cave"
  | "dyno"
  | "overhang"
  | "slab"
  | "traverse"
  | "other";
type ClimbAttempt = {
  ascentTime: number;
  isSent: boolean;
  grade: number;
  id: number;
  style: ClimbingStyle;
};
type ClimbingWorkout = {
  id: number;
  date: string;
  timestamp: string;
  climb_time: number;
  rest_time: number;
  warmup_time: number;
};
type Problem = {
  id: number;
  name: string | null;
  grade: number | null;
  area: string | null;
  description: string | null;
  photo_url: string | null;
  thumbnail_url: string | null;
  style: string | null;
};
