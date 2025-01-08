import {
  PieChart,
  PieArcSeries,
  ChartShallowDataShape,
  PieArc,
  PieArcMouseEvent,
} from "reaviz";

type Props = {
  data: ChartShallowDataShape[];
  onClick?: (e: PieArcMouseEvent) => void;
};

const ReavizPie = ({ data, onClick }: Props) => {
  return (
    <PieChart
      data={data}
      series={
        <PieArcSeries
          doughnut={true}
          colorScheme="cybertron"
          innerRadius={1}
          arc={<PieArc onClick={onClick} />}
        />
      }
    />
  );
};

export default ReavizPie;
