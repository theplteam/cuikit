import { XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';

type Props = {
  data: string,
};

const Chart: React.FC<Props> = ({ data }) => {
  const chartData = JSON.parse(data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart width={600} height={300} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" barSize={30} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
