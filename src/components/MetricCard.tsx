import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

type MetricCardProps = {
  name: string;
  description: string;
  lucideIcon?: LucideIcon;
  reactIcon?: IconType;
  value: number;
};

export const MetricCard = ({ data }: { data: MetricCardProps }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{data.name}</CardTitle>
      {data.lucideIcon && <data.lucideIcon className="size-4" />}
      {data.reactIcon && <data.reactIcon className="size-4" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{data.value}</div>
      <p className="text-xs text-muted-foreground">{data.description}</p>
    </CardContent>
  </Card>
);
