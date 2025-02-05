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

interface CommonChartProps {
  chartData: ChartDataType[] ;
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
  key: string | number ;
  value: number;
}





const CustomDot = (props: ChartDotType) => {
  console.log(props, 'props')
  const { cx, cy } = props;
  return (
    <>
      <circle cx={cx} cy={cy} r={7} fill="white" />
      <circle cx={cx} cy={cy} r={4} fill="#ff4d6d" />
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
      <ResponsiveContainer width="100%" className={'bg-white py-10'} height={'100%'}>
        <LineChart data={data} {...lineChartProps}>
          <CartesianGrid vertical={false} stroke="green" strokeDasharray="0"  {...CartesianProps} />
          <XAxis tick={{ dy: 10 }} tickLine={false} axisLine={false} dataKey={"key"} {...xAxisProps} />
          <YAxis tick={{ dx: -10 }} axisLine={false} tickCount={chartData.length < 10 ? 10 : chartData.length}  {...yAxisProps} />
          <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", padding: ".5rem", borderRadius: ".5rem" }} {...tooltipProps} />
          <Legend  {...legendProps} />
          <Line dataKey="value" stroke="green" strokeWidth={2} dot={(props) => <CustomDot {...props} />} />
        </LineChart>
      </ResponsiveContainer>
    )
  }



  const LineOrange = () => {
    return (
      <ResponsiveContainer width="100%" className={'bg-white py-10'} height={'100%'}>
        <LineChart data={data}  {...lineChartProps}>
          <CartesianGrid vertical={true} stroke="#E9E9E9" strokeDasharray="0"  {...CartesianProps} />
          <XAxis tick={{ dy: 10, fill: 'black' }} stroke="#E9E9E9" dataKey={"key"} {...xAxisProps} />
          <YAxis tick={{ dx: -10, fill: 'black' }} tickCount={chartData.length < 10 ? 10 : chartData.length} stroke="#E9E9E9" {...yAxisProps} />
          <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", padding: "8px", borderRadius: "5px" }} {...tooltipProps} />
          <Legend {...legendProps} />
          <Line dataKey="value" stroke="#F57F17" strokeWidth={2} dot={<></>}  {...lineProps} />
        </LineChart>
      </ResponsiveContainer>
    )
  }



 

  const CustomPieChart = () => {

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>

          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            labelLine={false}
          
          >
        
             {data.map((entry, index) => (
              <Cell  key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="vertical"
            align="left"
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              lineHeight: '30px',
              color: 'black'
            }}
            
             formatter={(key) => <span style={{ color: 'black',fontSize:'1.2rem',marginLeft:'.3rem' }}>{key}</span>}
          >
            
         </Legend>

        </PieChart>
      </ResponsiveContainer>
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
