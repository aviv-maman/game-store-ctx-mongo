//React
import { useState } from 'react';
import type { FC } from 'react';
//API
import type { Game } from '../app/services/itemAPI';
//CSS
import './ProductCard.css';
//React Router DOM
import { useNavigate } from 'react-router-dom';

type ProductCardProps = {
  item: Game;
  handleDelete: (id: string) => void;
};

const ProductCard: FC<ProductCardProps> = ({ item, handleDelete }) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const toggleShowMore = (): void => setShowMore(!showMore);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') as string) ?? undefined;
  const preferred_currency = user?.preferred_currency ?? 'usd';

  return (
    <li className='ticket'>
      <div className='styledHeader'>
        <span className='hiddenStyledButton'>Hide</span>
      </div>

      <h1>{item.name}</h1>
      <h5 className={`${showMore ? 'title' : 'title show-more'}`}>{item.description}</h5>
      <span className='styledLink' onClick={toggleShowMore}>
        {`${showMore ? 'Show Less' : 'Show More'}`}
      </span>
      <footer>
        <div className='meta-data'>
          by {item.developer} | {item.release_date} |
          {preferred_currency === 'nis' ? `₪${item.price.nis}` : preferred_currency === 'eur' ? `€${item.price.eur}` : `$${item.price.usd}`}
        </div>
        <div className='meta-data2'>
          <span className='styledLink' onClick={() => navigate(`/product/${item.id}/edit`)}>
            Edit
          </span>{' '}
          |{' '}
          {/* <span className='styledLink' onClick={() => handleDelete(item.id)}>
            Delete
          </span> */}
        </div>
      </footer>
    </li>
  );
};

export default ProductCard;
