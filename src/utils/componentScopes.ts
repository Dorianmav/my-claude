import React, { useState, useEffect, useRef, useCallback, useMemo, PureComponent } from "react";
import * as Recharts from "recharts";
import * as LucideReact from "lucide-react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { CustomChartContainer } from "@/components/content/CustomChartContainer";
import { TailwindWrapper } from "@/components/common/TailwindWrapper";

// Scope de base avec React hooks et utilitaires
export const getBaseScope = () => ({
  React,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  PureComponent,
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
  FunnelChart: Recharts.FunnelChart,
  Sankey: Recharts.Sankey,
  Line: Recharts.Line,
  Bar: Recharts.Bar,
  Pie: Recharts.Pie,
  Treemap: Recharts.Treemap,
  Scatter: Recharts.Scatter,
  RadialBar: Recharts.RadialBar,
  Area: Recharts.Area,
  Radar: Recharts.Radar,
  Funnel: Recharts.Funnel,
  XAxis: Recharts.XAxis,
  YAxis: Recharts.YAxis,
  ZAxis: Recharts.ZAxis,
  Tooltip: Recharts.Tooltip,
  Legend: Recharts.Legend,
  Brush: Recharts.Brush,
  Cell: Recharts.Cell,
  Label: Recharts.Label,
  LabelList: Recharts.LabelList,
  Sector: Recharts.Sector,
  CartesianAxis: Recharts.CartesianAxis,
  CartesianGrid: Recharts.CartesianGrid,
  PolarGrid: Recharts.PolarGrid,
  PolarAngleAxis: Recharts.PolarAngleAxis,
  PolarRadiusAxis: Recharts.PolarRadiusAxis,
  ReferenceLine: Recharts.ReferenceLine,
  ReferenceDot: Recharts.ReferenceDot,
  ReferenceArea: Recharts.ReferenceArea,
  ErrorBar: Recharts.ErrorBar,
  Customized: Recharts.Customized,
  Text: Recharts.Text,
  Surface: Recharts.Surface,
  Cross: Recharts.Cross,
  Curve: Recharts.Curve,
  Dot: Recharts.Dot,
  Polygon: Recharts.Polygon,
  Rectangle: Recharts.Rectangle,
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
