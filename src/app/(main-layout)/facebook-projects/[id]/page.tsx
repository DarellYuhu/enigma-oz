import Metrics from "./components/Metrics";
import Timeseries from "./components/Timeseries";
import TopDomain from "./components/TopDomain";

export default function FacebookProjectDetailPage() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Metrics />
        <TopDomain />
      </div>
      <Timeseries />
    </div>
  );
}
