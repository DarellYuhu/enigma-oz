import { getFacebookApi } from "@/app/api/utils";
import Metrics from "./components/Metrics";
import Timeseries from "./components/Timeseries";
import TopDomain from "./components/TopDomain";
import Topics from "./components/Topics";
import { notFound } from "next/navigation";

const getInfo = async (id: string) => {
  try {
    const response = await fetch(
      `${await getFacebookApi()}/api/v1/project/cat`,
      {
        method: "POST",
        body: JSON.stringify({ type: "getProjectInfo", projectId: id }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    return data;
  } catch {
    return undefined;
  }
};

export default async function FacebookProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await getInfo(params.id);
  if (!response) notFound();
  return (
    <div className="space-y-3">
      <Timeseries lastUpdate={response.lastUpdate} />
      <div className="grid grid-cols-2 gap-3">
        <Metrics />
        <TopDomain />
      </div>
      <Topics />
    </div>
  );
}
