import { ICONS } from "@/constants";

const getIcon = (name: keyof typeof ICONS) => ICONS[name] || {};

export default getIcon;
