// import abbreviateNumber from "@/utils/abbreviateNumber";
// import { Pie, PieConfig } from "@ant-design/charts";
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";

// type Props<T = unknown> = {
//   data: { [key: string]: T }[];
//   dataKey: string;
//   labelKey: string;
// };

// const CustomPieChart = ({ data, dataKey, labelKey }: Props) => {
//   const { theme } = useTheme();
//   const [color, setColor] = useState("");

//   const config: PieConfig = {
//     data,
//     angleField: dataKey,
//     colorField: labelKey,
//     innerRadius: 0.6,
//     label: {
//       text: dataKey,
//       style: {
//         fontWeight: "bold",
//       },
//       formatter: (_: any, datum: any) => abbreviateNumber(datum[dataKey]),
//     },
//     legend: {
//       color: {
//         title: false,
//         position: "bottom",
//         rowPadding: 5,
//       },
//     },
//     autoFit: true,
//     style: {
//       stroke: color,
//       inset: 1,
//     },
//     onEvent(chart, event) {
//       if (event.type === "click" && event.data !== undefined) {
//         window.open(
//           `https://www.tiktok.com/@${event.data.data.user}`,
//           "_blank"
//         );
//       }
//     },
//   };

//   useEffect(
//     () => (theme === "dark" ? setColor("#475569") : setColor("#ffffff")),
//     [theme]
//   );

//   return <Pie {...config} on />;
// };

// export default CustomPieChart;
