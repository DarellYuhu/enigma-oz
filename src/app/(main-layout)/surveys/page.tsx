import { ApprovalCard } from "./components/approval-card";
import { SurveyCard } from "./components/survey-card";

export default function SurveysPage() {
  return (
    <div className="space-y-4">
      <SurveyCard />
      <ApprovalCard />
    </div>
  );
}
