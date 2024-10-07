import { DataGridList } from "@/components/DataGrid/DataGridList"
/**
 * Method used to render coupon list
 * @returns 
 */
const Coupon = () => {

  const columns = [
    { type: 'default', field: 'id', headerName: "ID", width: 50 },
    { type: 'default', field: 'coin', headerName: "Coin", width: 150 },
    { type: 'default', field: 'date', headerName: "Date", width: 150 },
    { type: 'status', field: 'status', headerName: "Status", width: 300 },
    { type: 'default', field: 'agent_name', headerName: "Agent Name", width: 300 }
  ]

  const getData = () => {
    const rowData = [
      {
        id: 1,
        coin: "Bitcoin",
        date: "10/01/2024",
        status: "0",
        agent_name: "John Doe",
      },
      {
        id: 2,
        coin: "Ethereum",
        date: "10/02/2024",
        status: "2",
        agent_name: "Jane Smith",
      },
      {
        id: 3,
        coin: "Ripple",
        date: "10/03/2024",
        status: "7",
        agent_name: "Alice Johnson",
      },
      {
        id: 4,
        coin: "Litecoin",
        date: "10/04/2024",
        status: "1",
        agent_name: "Bob Brown",
      },
      {
        id: 5,
        coin: "Dogecoin",
        date: "10/05/2024",
        status: "2",
        agent_name: "Charlie Green",
      },
    ];

    return rowData.map((item) => ({
      ...item
    }));
  }
  return (
    <DataGridList data={getData()} title="Coupon" hideFooterPagination={true} columns={columns} id="coupon-datagrid" />
  )
}

export default Coupon