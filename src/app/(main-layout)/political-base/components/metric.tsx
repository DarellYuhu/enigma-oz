"use client";

import { useState } from "react";
import data from "@/data/politicalbase_metric.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Maps } from "./maps";
import { PieChart } from "./pie-chart";
import { BarChart } from "./bar-chart";
import SingleSelect from "@/components/SingleSelect";

export const Metric = () => {
  const [side, setSide] = useState<keyof typeof data.data>("Pro-Duterte");

  return (
    <>
      <div className="col-span-full">
        <SingleSelect
          selections={[
            { value: "Pro-Duterte", label: "Pro-Duterte" },
            { value: "Pro-Marcos", label: "Pro-Marcos" },
          ]}
          value={side}
          setValue={(v) => setSide(v as typeof side)}
        />
      </div>
      <Card className="relative col-span-7">
        <CardHeader>
          <CardTitle>Voters Preferences by Region</CardTitle>
        </CardHeader>
        <CardContent className="h-[540px] w-full">
          <Maps item={data.data[side].Region} />
        </CardContent>
      </Card>

      <div className="col-span-5 grid grid-rows-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Locale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-fit">
              <PieChart item={data.data[side]["Locale"]} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender</CardTitle>
          </CardHeader>
          <CardContent className="h-fit">
            <PieChart item={data.data[side].Gender} legendPosition="bottom" />
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Generation</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <BarChart item={data.data[side]["Generation"]} />
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Social Status</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <BarChart item={data.data[side]["Social Status"]} />
        </CardContent>
      </Card>
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Religious Affiliation</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart
            item={data.data[side]["Religious Affiliation"]}
            legendPosition="bottom"
          />
        </CardContent>
      </Card>
    </>
  );
};
