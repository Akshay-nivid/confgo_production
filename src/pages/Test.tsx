import CustomLineChart from '@/components/CustomLineChart/CustomChart'

const Test = () => {
  return (
    <div className='h-screen w-screen bg-[#919191] flex justify-center items-center'>
      <CustomLineChart  chartType='Pie' chartData={[{key:'first',value:200},{key:'first',value:300},{key:'first',value:900},{key:'first',value:900}]}/>
    </div>
  )
}

export default Test