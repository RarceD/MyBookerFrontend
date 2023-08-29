import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

const LineChartHours = (props: { data: any }) => (
  <LineChart width={1200} height={300} data={props.data}>
     <Line type="monotone" dataKey="count" stroke="#00ff00" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="date" angle={300} />
    <YAxis />
    <Legend />
  </LineChart>
)
export default LineChartHours;