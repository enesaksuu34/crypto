import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Define the type for the cryptocurrency data
interface CryptoData {
  market_cap_rank: number;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

function App() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: CryptoData[] = await response.json();
        setCryptoData(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatChange = (change: number) => {
    const value = change.toFixed(2);
    const color = change >= 0 ? 'text-green-500' : 'text-red-500';
    const sign = change >= 0 ? '+' : '';
    return <span className={color}>{`${sign}${value}%`}</span>;
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Cryptocurrency Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                <TableHead className="text-right">24h Change (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        <Skeleton className="h-5 w-5 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-12" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-20 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-16 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : cryptoData.map((crypto) => (
                    <TableRow key={crypto.symbol}>
                      <TableCell className="font-medium text-center">
                        {crypto.market_cap_rank}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="h-6 w-6"
                          />
                          <span className="font-medium">{crypto.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="uppercase text-muted-foreground">
                        {crypto.symbol}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatPrice(crypto.current_price)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatChange(crypto.price_change_percentage_24h)}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
