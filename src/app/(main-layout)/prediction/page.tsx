import { Prediction } from "./components/prediction";
import { WinContender } from "./components/win-contender";

export default function PredictionPage() {
  return (
    <div className="space-y-4">
      <WinContender />
      <Prediction />
    </div>
  );
}
