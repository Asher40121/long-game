import type { PortfolioBrand } from "@/lib/model";

/** The fictional acquirer. Every name here is invented. */
export const ACQUIRER = {
  name: "Larkspur Hobby Group",
  oneLiner: "A fictional, long-term owner of hobby and collectibles brands.",
};

export const PORTFOLIO: PortfolioBrand[] = [
  {
    name: "Fieldstone Card Co.",
    oneLiner: "Publisher of a science-fiction trading card game with a national organized-play program.",
    categories: ["tcg-publishing"],
    channels: ["hobby-stores", "wholesale"],
    regions: ["us-national"],
  },
  {
    name: "Brightkeep Supplies",
    oneLiner: "Card sleeves, binders and deck boxes for mass retail and hobby stores.",
    categories: ["card-accessories"],
    channels: ["mass-retail", "hobby-stores"],
    regions: ["us-national", "canada"],
  },
  {
    name: "Corner Pocket Games",
    oneLiner: "Six hobby stores in the US Midwest with in-store tournaments.",
    categories: ["hobby-retail"],
    channels: ["hobby-stores"],
    regions: ["us-midwest"],
  },
  {
    name: "Tallgrass Dice Co.",
    oneLiner: "RPG dice and accessories sold through hobby stores and distributors.",
    categories: ["rpg-accessories"],
    channels: ["hobby-stores", "wholesale"],
    regions: ["us-national"],
  },
  {
    name: "Pinewick Puzzles",
    oneLiner: "Jigsaw puzzles for mass retail and gift stores.",
    categories: ["puzzles"],
    channels: ["mass-retail"],
    regions: ["us-national"],
  },
];
