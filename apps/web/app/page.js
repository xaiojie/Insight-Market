import MarketCard from "../components/MarketCard";

async function getMarkets() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/markets`, {
    cache: "no-store"
  });
  return res.json();
}

export default async function HomePage() {
  const markets = await getMarkets();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">预测市场</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </div>
  );
}
