export type products = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const products = [
  {
    id: "clymn30ff0000po023sxf54wf",
    name: "Routerboard CCR2004-1G-12S+2XS",
    description:
      "The Connectivity Router - your best companion when it comes to               SFP, SFP+ and SFP28 management! 1, 10 and 25 Gbps ports in a               single device to make your life easier",
    price: 8240000,
    stock: 9,
    category: "Router",
    imageUrl: "/CCR3.png",
    createdAt: "2024-07-15T07:04:33.004Z",
    updatedAt: "2024-07-15T07:02:31.207Z",
    ShoppingCartItem: [],
  },
  {
    id: "clymn51mh0001po02j4r9zrm2",
    name: "RB4011iGS+RM",
    description:
      "10xGigabit port router with a Quad-core 1.4Ghz CPU 1GB RAM, SFP+               10Gbps cage and desktop case with rack ears",
    price: 3500000,
    stock: 7,
    category: "Router",
    imageUrl: "/4011.png",
    createdAt: "2024-07-15T07:06:07.865Z",
    updatedAt: "2024-07-15T07:04:36.043Z",
    ShoppingCartItem: [],
  },
];
