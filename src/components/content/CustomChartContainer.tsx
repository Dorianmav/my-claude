import React from "react";
import { ChartContainer } from "../ui/chart";
import { defaultChartConfig } from "../../utils/chartConfig";

interface CustomChartContainerProps {
  children: React.ReactElement;
  className?: string;
}

export const CustomChartContainer: React.FC<CustomChartContainerProps> = ({ children, className, ...props }) => {
  return (
    <ChartContainer className={className} config={defaultChartConfig} {...props}>
      {children}
    </ChartContainer>
  );
};
