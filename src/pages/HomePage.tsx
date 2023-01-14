import GameList from '../components/GameList';
import { useRouteLoaderData } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { itemsAPI } from '../app/services/itemAPI';
import SpinnerChase from '../components/spinners/SpinnerChase';
import SpinnerFlow from '../components/spinners/SpinnerFlow';
import SpinnerWave from '../components/spinners/SpinnerWave';

//API calls
const api = itemsAPI();

export async function rootLoader({ request }: LoaderFunctionArgs): Promise<any> {
  const url = new URL(request.url);
  const qValue = url.searchParams.get('q') ?? '';
  const q = { value: qValue };
  // const fetchedGames = await api.getItems({ q });
  const fetchedGames = [] as any;
  return { fetchedGames, q };
}

export default function HomePage() {
  return (
    <div>
      <SpinnerFlow />
      <SpinnerChase />
      <SpinnerWave />

      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
        scroll to top
      </button>
    </div>
  );
}
