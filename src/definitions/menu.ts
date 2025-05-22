import { JSX } from "react";



export interface MenuGroup {
    title?: string;
    items: MenuItem[];
  }
export type MenuItem = {
  label: string;
  icon?: JSX.Element;
  href?: string;
  children?: { label: string; href: string }[];
};


