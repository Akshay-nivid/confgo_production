"use client"
import { Rectangle } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// Sample data - replace with your own data
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];




export default function CustomBarChart({ chartData,barProps }: { chartData: any,barProps?: any }) {

  
  return (
    
          <ResponsiveContainer className={'bg-white'} width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3" />
        <XAxis
          tickLine={false} dataKey="name" />
        <YAxis
          tickFormatter={(value)=>`$ ${value}`}
          tickCount={20} />
              <Tooltip />
              <Legend formatter={()=><span>Revenue from Selected Event </span>}/>
              <Bar barSize={15}  fill="green" {...barProps}  />
            </BarChart>
          </ResponsiveContainer>
     
  )
}

