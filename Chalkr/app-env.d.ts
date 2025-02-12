// @ts-ignore
/// <reference types="nativewind/types" />
type ClimbingStyle = "slab" | "dyno" | "traverse" | "overhang" | "cave" | "";
type ClimbAttempt = {
  ascentTime: number;
  isSent: boolean;
  grade: number;
  id: number;
  style: ClimbingStyle;
};
