"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';






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

