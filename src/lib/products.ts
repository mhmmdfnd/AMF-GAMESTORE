export type Product = {
  id: string; name: string; category: string; price: number;
  description: string; image: string; badge?: string; popular?: boolean;
};

export const demoProducts: Product[] = [
  { id:"ml-86", name:"Mobile Legends Diamonds", category:"Mobile Legends", price:18000, description:"Top up diamond Mobile Legends dengan proses cepat.", image:"🎮", badge:"Populer", popular:true },
  { id:"ff-70", name:"Free Fire Diamonds", category:"Free Fire", price:15000, description:"Top up diamond Free Fire untuk kebutuhan in-game.", image:"🔥", badge:"Best seller", popular:true },
  { id:"pubg-60", name:"PUBG Mobile UC", category:"PUBG Mobile", price:17000, description:"Isi UC PUBG Mobile dengan proses praktis.", image:"🎯", popular:true },
  { id:"ef-50", name:"eFootball Coins", category:"eFootball", price:22000, description:"Kebutuhan coin eFootball untuk tim impianmu.", image:"⚽" },
  { id:"ml-172", name:"Mobile Legends Weekly Pass", category:"Mobile Legends", price:28500, description:"Weekly Diamond Pass Mobile Legends.", image:"💎" },
  { id:"ff-355", name:"Free Fire Membership", category:"Free Fire", price:32000, description:"Pilihan membership Free Fire.", image:"👑" }
];

export const rupiah = (value:number) => new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value);
