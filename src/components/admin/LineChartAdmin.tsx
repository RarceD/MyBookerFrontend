import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

const LineChartAdmin = (props: { data: any }) => (
  <LineChart width={1200} height={300} data={props.data}>
    <Line type="monotone" dataKey="countNOK" stroke="#ff0000" />
     <Line type="monotone" dataKey="count" stroke="#00ff00" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="date" angle={300} />
    <YAxis />
  </LineChart>
)
export default LineChartAdmin;