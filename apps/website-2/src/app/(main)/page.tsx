"use client";
import Configuration from "./components/Configuration";
import Metrics from "./components/Metrics";
import TimeSeries from "./components/TimeSeries";
// import PageTable from "./components/PageTable";

export default function Home() {
  // const { token } = useSessionStore.getState();
  // if (!token) redirect("/sign-in");

  return (
    <div className="p-4 space-y-4">
      <Configuration />

      <Metrics />

      <TimeSeries />
      {/* <PageTable /> */}
    </div>
  );
}
