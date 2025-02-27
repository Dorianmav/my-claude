import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as Recharts from "recharts";
import * as LucideReact from "lucide-react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { CustomChartContainer } from "@/components/CustomChartContainer";
import { TailwindWrapper } from "@/components/TailwindWrapper";

// Scope de base avec React hooks et utilitaires
export const getBaseScope = () => ({
  React,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  ...LucideReact, // Tous les composants et icônes Lucide
  tw: (className: string) => ({ className }),
  TailwindWrapper,
});

// Scope pour les composants Recharts
export const getRechartsScope = () => ({
  ResponsiveContainer: Recharts.ResponsiveContainer,
  LineChart: Recharts.LineChart,
  BarChart: Recharts.BarChart,
  PieChart: Recharts.PieChart,
  ScatterChart: Recharts.ScatterChart,
  RadialBarChart: Recharts.RadialBarChart,
  AreaChart: Recharts.AreaChart,
  ComposedChart: Recharts.ComposedChart,
  RadarChart: Recharts.RadarChart,
  Line: Recharts.Line,
  Bar: Recharts.Bar,
  Pie: Recharts.Pie,
  Scatter: Recharts.Scatter,
  RadialBar: Recharts.RadialBar,
  Area: Recharts.Area,
  Radar: Recharts.Radar,
  XAxis: Recharts.XAxis,
  YAxis: Recharts.YAxis,
  Tooltip: Recharts.Tooltip,
  Legend: Recharts.Legend,
  Cell: Recharts.Cell,
  LabelList: Recharts.LabelList,
  Sector: Recharts.Sector,
  CartesianGrid: Recharts.CartesianGrid,
  PolarGrid: Recharts.PolarGrid,
  PolarAngleAxis: Recharts.PolarAngleAxis,
  PolarRadiusAxis: Recharts.PolarRadiusAxis,
  Surface: Recharts.Surface,
  Symbols: Recharts.Symbols,
});

// Scope pour les composants Shadcn
export const getShadcnScope = () => ({
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ChartContainer: CustomChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
});

// Obtenir le scope complet avec tous les composants
export const getFullScope = () => ({
  ...getBaseScope(),
  ...getRechartsScope(),
  ...getShadcnScope(),
  console: console,
});
