import GameList from '../components/GameList';
import { useRouteLoaderData } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { itemsAPI } from '../app/services/itemAPI';
import SpinnerChase from '../components/spinners/SpinnerChase';
import SpinnerFlow from '../components/spinners/SpinnerFlow';
import SpinnerWave from '../components/spinners/SpinnerWave';

//API calls
const api = itemsAPI('products');

export async function rootLoader({ request }: LoaderFunctionArgs): Promise<any> {
  const url = new URL(request.url);
  const qValue = url.searchParams.get('q') ?? '';
  const q = { value: qValue };
  // const fetchedGames = await api.getItems({ q });
  const fetchedGames = [] as any;
  return { fetchedGames, q };
}

export default function HomePage() {
  // const { fetchedGames }: any = useRouteLoaderData('root'); //loader function: not real time data
  // const realTimeData = useCollection<Item>('products', where('title', '==', 'Marvel’s Spider-Man Remastered'), limit(1));

  return (
    <div>
      <SpinnerFlow />
      <SpinnerChase />
      <SpinnerWave />
      {/* {realTimeData.data && <GameList items={realTimeData.data} />}
      {realTimeData.count && <p>{realTimeData.count}</p>} */}
    </div>
  );
}
