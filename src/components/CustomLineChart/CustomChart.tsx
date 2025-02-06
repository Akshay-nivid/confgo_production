import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxisProps,
  YAxisProps,
  CartesianGridProps,
  TooltipProps,
  LegendProps,
  LineProps,
  PieChart,
  Pie,
  Cell,

} from "recharts";

import './CustomChart.scss'

interface CommonChartProps {
  chartData: ChartDataType[];
  xAxisProps?: XAxisProps;
  yAxisProps?: YAxisProps;
  gridProps?: CartesianGridProps;
  tooltipProps?: TooltipProps<number, string>;
  legendProps?: Omit<LegendProps, "ref">;
  lineProps?: Omit<LineProps, "ref">;
  chartType: "LineGreen" | "Pie" | "LineOrange";
  lineChartProps?: any;
  CartesianProps?: any;

}

type ChartDotType = {
  cx: number;
  cy: number;
  dataKey: string;
  fill: string;
  height: number;
  index: number;
  payload: {
    date: string;
    users: number;
  };
  r: number;
  stroke: string;
  strokeWidth: number;
  value: number;
  width: number;
};



type ChartDataType = {
  key: string | number;
  value: number;
  name?:string | number
}





const CustomDot = (props: ChartDotType) => {
  const { cx, cy } = props;
  return (
    <>
      <circle cx={cx} cy={cy} r={7} fill="white" />
      <circle cx={cx} cy={cy} r={4} fill="#AC8EE3" />
    </>
  );
};




const CustomChart: React.FC<CommonChartProps> = ({
  chartType,
  chartData,
  xAxisProps,
  yAxisProps,
  tooltipProps,
  legendProps,
  lineProps,
  CartesianProps,
  lineChartProps
}) => {


  const data = chartType === "Pie" ? chartData.map((item) => ({ name: item.key, value: item.value })) : chartData;


  const LinGreen = () => {
    return (
      <ResponsiveContainer width="100%"  >
        <LineChart data={data} {...lineChartProps}>
          <CartesianGrid vertical={false} stroke="#96E3B0" strokeWidth={1} strokeDasharray="0"  {...CartesianProps} />
          <XAxis tick={{ dy: 10 }} axisLine={false} dataKey={"key"} {...xAxisProps} />
          <YAxis tick={{ dx: -10 }} axisLine={false} tickLine={false} tickCount={chartData.length < 5 ? 5 : chartData.length}  {...yAxisProps} />
          <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", padding: ".5rem", borderRadius: ".5rem" }} {...tooltipProps} />
          {/* <Legend  {...legendProps} /> */}
          <Line dataKey="value" stroke="#2EAC2B" strokeWidth={3} dot={(props) => <CustomDot {...props} key={props.key} />} />
        </LineChart>
      </ResponsiveContainer>
    )
  }



  const LineOrange = () => {
    return (
      <ResponsiveContainer width="100%" height={'100%'}>
        <LineChart data={data}  {...lineChartProps}>
          <CartesianGrid vertical={true} stroke="#E9E9E9" strokeDasharray="0"  {...CartesianProps} />
          <XAxis tick={{ dy: 10, fill: 'black' }} stroke="#E9E9E9" dataKey={"key"} {...xAxisProps} />
          <YAxis tick={{ dx: -10, fill: 'black' }} tickCount={chartData.length < 10 ? 10 : chartData.length} stroke="#E9E9E9" {...yAxisProps} />
          <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", padding: ".5rem", borderRadius: ".5rem" }} {...tooltipProps} />
          <Legend {...legendProps} />
          <Line dataKey="value" stroke="#F57F17" strokeWidth={2} dot={<></>}  {...lineProps} />
        </LineChart>
      </ResponsiveContainer>
    )
  }


 


  const CustomPieChart = () => {

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


    return (
     
      <div className="w-full max-w-lg">
        <div>
          <div className="h-[11.66rem]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={70}
                  paddingAngle={0}
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} ></Cell>
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              {/* <div content={<ChartTooltipContent />} /> */}
            </ResponsiveContainer>
          </div>
          <div className="mt-8 flex flex-col gap-2">
            {data.map((entry, index) => {
              console.log(entry)
              return(
              <div key={entry.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <div className="flex items-center justify-between w-full">
                <span className="text-lg text-muted-foreground ">
                  {entry.name} 
                  </span>
                  <span className="text-lg text-muted-foreground font-semibold">
                   {entry.value}%
                </span>
                </div>
                
              </div>
            )})}
          </div>
        </div>
      </div>
    )
  }


  return (
    <>
      {
        chartType === "LineGreen" ? <LinGreen /> : chartType === "LineOrange" ? <LineOrange /> : <CustomPieChart />
      }
    </>
  );
};

export default CustomChart;
