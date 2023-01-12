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

  return (
    <li className='ticket'>
      <div className='styledHeader'>
        <span className='hiddenStyledButton'>Hide</span>
      </div>

      <h1>{item.title}</h1>
      <h5 className={`${showMore ? 'title' : 'title show-more'}`}>{item.description}</h5>
      <span className='styledLink' onClick={toggleShowMore}>
        {`${showMore ? 'Show Less' : 'Show More'}`}
      </span>
      <footer>
        <div className='meta-data'>
          by {item.developer} | {item.release_date} | ${item.price}
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
