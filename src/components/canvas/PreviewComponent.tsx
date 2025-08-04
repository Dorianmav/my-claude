import React from "react";
import { Runner } from "react-runner";
import { PreviewComponentProps } from "../../types/components";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { getFullScope } from "../../utils/componentScopes";

export const PreviewComponent: React.FC<PreviewComponentProps> = ({ code, scope }) => {
  const modifiedCode = code.replace(/import[\s\S]*?from.*?;(\n|$)/g, "").trim();
  const hasRechartsChart = /(\w+Chart|Pie)\s+data=/.test(modifiedCode);

  let finalCode = modifiedCode;
  if (hasRechartsChart && !modifiedCode.includes('ResponsiveContainer')) {
    const returnMatch = (/return\s*\(([\s\S]*?)\);/).exec(modifiedCode);
    if (returnMatch) {
      const chartJSX = returnMatch[1];
      finalCode = modifiedCode.replace(
        /return\s*\(([\s\S]*?)\);/,
        `return (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              ${chartJSX}
            </ResponsiveContainer>
          </div>
        );`
      );
    }
  }

  return (
    <ErrorBoundary>
      <div
        className="w-full h-full flex items-center justify-center bg-white p-4 rounded-lg"
        style={{ width: "100%", height: "400px" }}
      >
        <div className="w-full h-full" style={{ minHeight: "300px" }}>
          <style>
            {`
              @tailwind base;
              @tailwind components;
              @tailwind utilities;
            `}
          </style>
          <Runner
            code={finalCode}
            scope={{
              ...scope,
              ...getFullScope(),
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};
