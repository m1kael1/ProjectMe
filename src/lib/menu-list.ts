import {
  Settings,
  LayoutGrid,
  GanttChartSquare,
  ListTodo,
  CalendarClockIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, id: string): Group[] {
  const hrefCombine = (href: string) => `/projects/${id}/${href}`;

  return [
    {
      groupLabel: "",
      menus: [
        {
          href: hrefCombine("dashboard"),
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        // {
        //   href: "",
        //   label: "Projects",
        //   active: pathname.includes("/projects"),
        //   icon: Layers2,
        //   submenus: [
        //     {
        //       href: "/projects",
        //       label: "All Projects",
        //       active: pathname === "/projects"
        //     },
        //     {
        //       href: "/projects/create",
        //       label: "Create Project",
        //       active: pathname === "/projects/create"
        //     }
        //   ]
        // },
        // {
        //   href: "/users",
        //   label: "Users",
        //   active: pathname.includes("/users"),
        //   icon: Users,
        //   submenus: []
        // },
        {
          href: hrefCombine("/planners"),
          label: "Planners",
          active: pathname.includes("/planners"),
          icon: CalendarClockIcon,
          submenus: []
        },
        {
          href: hrefCombine("/discussions"),
          label: "Discussions",
          active: pathname.includes("/discussions"),
          icon: GanttChartSquare,
          submenus: []
        },
        {
          href: hrefCombine("/tasks"),
          label: "Tasks",
          active: pathname.includes("/tasks"),
          icon: ListTodo,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: hrefCombine("/settings"),
          label: "Project Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}
