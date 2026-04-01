import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getShopData, getCoinHistory } from "@/app/actions/shop";
import { QuestShopClient } from "@/components/dashboard/quest-shop";

export default async function ShopPage() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const shopData = await getShopData();
  if (!shopData) redirect("/login");

  const coinHistory = await getCoinHistory();

  return <QuestShopClient data={shopData} coinHistory={coinHistory} />;
}