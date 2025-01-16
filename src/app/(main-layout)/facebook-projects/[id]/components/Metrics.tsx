"use client";

import { MetricCard } from "@/components/MetricCard";
import useFacebookStatistics from "@/hooks/features/facebook/useFacebookStatistics";
import { Angry, Heart } from "lucide-react";
import { BsEmojiGrin, BsEmojiSurprise, BsEmojiTear } from "react-icons/bs";

export default function Metrics() {
  const { data } = useFacebookStatistics();
  return (
    <div className="grid grid-cols-2 gap-3">
      {data && (
        <>
          <div className="col-span-full">
            <MetricCard
              data={{
                value: data.reactions.Haha,
                name: "Haha",
                reactIcon: BsEmojiGrin,
                description: "",
              }}
            />
          </div>
          <MetricCard
            data={{
              value: data.reactions.Love,
              name: "Love",
              lucideIcon: Heart,
              description: "",
            }}
          />
          <MetricCard
            data={{
              value: data.reactions.Angry,
              name: "Angry",
              lucideIcon: Angry,
              description: "",
            }}
          />
          <MetricCard
            data={{
              value: data.reactions.Wow,
              name: "Wow",
              reactIcon: BsEmojiSurprise,
              description: "",
            }}
          />
          <MetricCard
            data={{
              value: data.reactions.Sad,
              name: "Sad",
              reactIcon: BsEmojiTear,
              description: "",
            }}
          />
        </>
      )}
    </div>
  );
}
