import { Menus } from "@/components/sidebar/AppSidebar";
import {
  Clapperboard,
  Facebook,
  MonitorStop,
  ServerCrash,
  TrendingUp,
  Twitter,
  UserCog,
  Youtube,
} from "lucide-react";
export const adminMenus: Menus = [
  {
    title: "Platform",
    items: [
      {
        title: "Online Public Attention",
        url: "/trends",
        icon: TrendingUp,
        isActive: true,
      },
      {
        title: "Tiktok",
        url: "",
        icon: Clapperboard,
        isActive: true,
        subMenus: [
          {
            title: "Projects",
            url: "/tiktok-projects",
          },
          {
            title: "Creative Insights",
            url: "/tiktok-trend",
          },
        ],
      },
      {
        title: "Twitter",
        url: "",
        icon: Twitter,
        isActive: true,
        subMenus: [
          {
            title: "Projects",
            url: "/twitter-projects",
          },
        ],
      },
      {
        title: "Youtube",
        url: "",
        icon: Youtube,
        isActive: true,
        subMenus: [
          {
            title: "Projects",
            url: "/youtube-projects",
          },
        ],
      },
      {
        title: "Facebook",
        url: "",
        icon: Facebook,
        isActive: true,
        subMenus: [
          {
            title: "Projects",
            url: "/facebook-projects",
          },
        ],
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Accounts",
        url: "/accounts",
        icon: UserCog,
      },
      {
        title: "Serivces",
        url: "/services",
        icon: ServerCrash,
      },
      {
        title: "Workspace",
        url: "/workspace",
        icon: MonitorStop,
      },
    ],
  },
];

export const analystMenus: Menus = [
  {
    title: "Platform",
    items: [
      {
        title: "Online Public Attention",
        url: "/trends",
        icon: TrendingUp,
        isActive: true,
      },
      {
        title: "Tiktok",
        url: "",
        icon: Clapperboard,
        isActive: true,
        subMenus: [
          {
            title: "Projects",
            url: "/tiktok-projects",
          },
          {
            title: "Creative Insights",
            url: "/tiktok-trend",
          },
        ],
      },
      {
        title: "Twitter",
        url: "",
        icon: Twitter,
        isActive: true,
        subMenus: [
          {
            title: "Projects",
            url: "/twitter-projects",
          },
        ],
      },
      {
        title: "Youtube",
        url: "",
        icon: Youtube,
        isActive: true,
        subMenus: [
          {
            title: "Projects",
            url: "/youtube-projects",
          },
        ],
      },
      {
        title: "Facebook",
        url: "",
        icon: Facebook,
        isActive: true,
        subMenus: [
          {
            title: "Projects",
            url: "/facebook-projects",
          },
        ],
      },
    ],
  },
];

export const creativeMenus: Menus = [
  {
    title: "Platform",
    items: [
      {
        title: "Tiktok",
        url: "",
        icon: Clapperboard,
        isActive: true,
        subMenus: [
          {
            title: "Creative Insights",
            url: "/tiktok-trend",
          },
        ],
      },
    ],
  },
];
