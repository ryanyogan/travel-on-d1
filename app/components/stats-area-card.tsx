import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { calculateTrendPercentage } from "~/lib/utils";

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StatsAreaCard({
  title,
  description,
  total,
  currentMonthCount,
  lastMonthCount,
}: {
  title: string;
  description: string;
  total: number;
  currentMonthCount: number;
  lastMonthCount: number;
}) {
  const getMonthName = (monthIndex: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    // Handle negative indices or indices > 11 by wrapping around
    return months[((monthIndex % 12) + 12) % 12];
  };

  const currentMonth = new Date().getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentMonthName = getMonthName(currentMonth);
  const lastMonthName = getMonthName(lastMonth);

  const { percentage, trend } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );

  const isDecrement = trend === "decrement";

  const chartData = [
    { month: lastMonthName, users: lastMonthCount },
    {
      month: currentMonthName,
      users: currentMonthCount,
    },
  ];

  return (
    <Card className="shadow border-none">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{title}</span>
          <span>{total}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="p-2" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="users"
              type="natural"
              fill="url(#fillUsers)"
              fillOpacity={0.4}
              stroke="var(--color-chart-1)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="flex text-slate-500 items-center gap-2 leading-none font-medium">
            Trending up by {percentage}% this month{" "}
            {isDecrement ? (
              <TrendingDown className="size-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
