"use client";

import { COLORS } from "@/constants";
import { Chart } from "react-google-charts";

type Props = {
  data: (string | number)[][];
};

const GoogleSankey = ({ data }: Props) => {
  return (
    <Chart
      data={data}
      chartType="Sankey"
      options={{
        backgroundColor: "white",
        sankey: {
          node: {
            width: 10,
            colors: COLORS,
            label: {
              fontName: "Times-Roman",
              fontSize: 14,
              bold: true,
              italic: true,
            },
            interactivity: true,
          },
          link: {
            colorMode: "gradient",
            colors: COLORS,
          },
        },
        tooltip: {
          isHtml: true,
        },
      }}
      height={"320px"}
    />
  );
};

export default GoogleSankey;
