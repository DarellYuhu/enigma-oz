import { Menus } from "@/components/sidebar/AppSidebar";
import {
  Clapperboard,
  Facebook,
  FileCheck2,
  MonitorStop,
  ServerCrash,
  TrendingUp,
  Twitter,
  UserCog,
  Youtube,
} from "lucide-react";

const platformMenu = {
  title: "Platform",
  items: [
    process.env.NEXT_PUBLIC_OZ_ONLINE_PUBLIC_ATTENTION === "true" && {
      title: "Online Public Attention",
      url: "/trends",
      icon: TrendingUp,
      isActive: true,
    },
    process.env.NEXT_PUBLIC_OZ_SURVEYS === "true" && {
      title: "Surveys",
      url: "/surveys",
      icon: FileCheck2,
      isActive: true,
    },
    {
      title: "Tiktok",
      url: "",
      icon: Clapperboard,
      isActive: true,
      subMenus: [
        { title: "Projects", url: "/tiktok-projects" },
        { title: "Creative Insights", url: "/tiktok-trend" },
      ],
    },
    {
      title: "Twitter",
      url: "",
      icon: Twitter,
      isActive: true,
      subMenus: [{ title: "Projects", url: "/twitter-projects" }],
    },
    {
      title: "Youtube",
      url: "",
      icon: Youtube,
      isActive: true,
      subMenus: [
        { title: "Projects", url: "/youtube-projects" },
        process.env.NEXT_PUBLIC_OZ_YOUTUBE_MAP === "true" && {
          title: "Map",
          url: "/youtube-map",
        },
      ].filter(Boolean) as any,
    },
    {
      title: "Facebook",
      url: "",
      icon: Facebook,
      isActive: true,
      subMenus: [{ title: "Projects", url: "/facebook-projects" }],
    },
  ].filter(Boolean) as any,
};

const managementMenu = {
  title: "Management",
  items: [
    { title: "Accounts", url: "/accounts", icon: UserCog },
    { title: "Serivces", url: "/services", icon: ServerCrash },
    { title: "Workspace", url: "/workspace", icon: MonitorStop },
  ],
};

const creativeOnlyMenu = {
  title: "Platform",
  items: [
    {
      title: "Tiktok",
      url: "",
      icon: Clapperboard,
      isActive: true,
      subMenus: [{ title: "Creative Insights", url: "/tiktok-trend" }],
    },
  ],
};

export const adminMenus: Menus = [platformMenu, managementMenu];
export const analystMenus: Menus = [platformMenu];
export const creativeMenus: Menus = [creativeOnlyMenu];
