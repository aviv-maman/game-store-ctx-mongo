// This component is used to display the list of games
// React
import { useEffect, useState } from 'react';
import type { FC } from 'react';
//Components
import ProductCard from './ProductCard';
//API
import { itemsAPI } from '../app/services/itemAPI';
import type { Game } from '../app/services/itemAPI';

type GameListProps = {
  items: Game[];
  elementRef?: any;
};

//API calls
const api = itemsAPI();

const GameList: FC<GameListProps> = ({ items, elementRef }) => {
  const [filteredItems, setFilteredItems] = useState<Game[]>(items);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteItemById(id);
      if (res.code === 200 || res.success) {
        setFilteredItems(filteredItems.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className='game-list'>
      <ul>
        {filteredItems.map((item) => (
          <ProductCard item={item} key={item.id} handleDelete={handleDelete} elementRef={elementRef} />
        ))}
      </ul>
    </div>
  );
};

export default GameList;
