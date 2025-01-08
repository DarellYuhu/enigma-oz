import Metrics from "./components/Metrics";
import TimeSeries from "./components/TimeSeries";
// import PageTable from "./components/PageTable";

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <Metrics />

      <TimeSeries />
      {/* <PageTable /> */}
    </div>
  );
}
