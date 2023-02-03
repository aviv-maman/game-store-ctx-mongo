//React
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FC, MutableRefObject } from 'react';
//React Router DOM
import { Form, useFetcher, useLoaderData, useNavigate, useNavigation, useSearchParams, useSubmit } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
//API
import { itemsAPI, PageType } from '../app/services/itemAPI';
import type { Game } from '../app/services/itemAPI';
//Components
import GameList from '../components/GameList';
//PrimeReact
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import type { CheckboxChangeParams } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import type { CalendarChangeParams } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import type { DropdownChangeParams } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import type { PaginatorPageState } from 'primereact/paginator';
import { Slider } from 'primereact/slider';
import type { SliderChangeParams, SliderValueType } from 'primereact/slider';
import { AutoComplete } from 'primereact/autocomplete';
import type { AutoCompleteChangeParams, AutoCompleteSelectParams } from 'primereact/autocomplete';

type SearchPageWithInfiniteScrollingProps = {};

//API calls
const api = itemsAPI();

//Prepare Date
const prepareDate = (date: string) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};

//Loader
export async function searchWithInfiniteScrollingLoader({
  request,
}: LoaderFunctionArgs): Promise<{ fetchedGames?: Game[]; q: string; totalCount: number; currentCount: number }> {
  const url = new URL(request.url);
  if (!url.searchParams.get('page') || Number(url.searchParams.get('page')) === 0) {
    url.searchParams.set('page', '1');
  }

  const q = url.searchParams.get('q') ?? '';

  const type = url.searchParams.get('type') ?? '';

  const orderBy = url.searchParams.get('sort')?.split(',') ?? [];
  const mongoOrderByOperator = orderBy[1] === 'asc' ? '' : '-';
  const mongoOrderByFieldPath = orderBy[0] as string;
  const order = orderBy[0] ? mongoOrderByOperator + mongoOrderByFieldPath : '-release_date';

  const page = Number(url.searchParams.get('page'));
  console.log('loader - page', page);

  const fromDate = url.searchParams.get('from_date') ?? '';
  const from_date = fromDate ? prepareDate(fromDate) : '';

  // const year = new Date(fromDate).getFullYear();
  // const month = new Date(fromDate).getMonth();
  // const day = new Date(fromDate).getDate();

  const untilDate = url.searchParams.get('until_date') ?? '';
  const until_date = untilDate ? prepareDate(untilDate) : '';

  const releaseDate = url.searchParams.get('release_date') ?? '';
  const release_date = releaseDate ? prepareDate(releaseDate) : '';

  const user = JSON.parse(localStorage.getItem('user') as string) ?? undefined;
  const preferred_currency: string = user?.preferred_currency ?? 'usd';

  const isPrice = url.searchParams.get('price');
  const price = isPrice ? Number(url.searchParams.get('price')) : undefined;

  const isMinPrice = url.searchParams.get('min_price');
  const minPrice = isMinPrice ? Number(url.searchParams.get('min_price')) : undefined;

  const isMaxPrice = url.searchParams.get('max_price');
  const maxPrice = isMaxPrice ? Number(url.searchParams.get('max_price')) : undefined;

  // const perPage = Number(url.searchParams.get('limit') ?? 10);

  // const { success, data, totalCount, currentCount } = (await api.getItems({
  //   name: q,
  //   type,
  //   from_date,
  //   until_date,
  //   release_date,
  //   exact_price: { price, currency: preferred_currency },
  //   price_range: { minPrice, maxPrice, currency: preferred_currency },
  //   order,
  //   page,
  // })) as {
  //   success: boolean;
  //   data: Game[];
  //   totalCount: number;
  //   currentCount: number;
  // };

  const { success, data, totalCount, currentCount } = {
    success: true,
    data: [
      { id: Math.random() * 9999, name: `#01 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
      { id: Math.random() * 9999, name: `#02 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
      { id: Math.random() * 9999, name: `#03 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
      { id: Math.random() * 9999, name: `#04 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
      { id: Math.random() * 9999, name: `#05 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
      { id: Math.random() * 9999, name: `#06 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
      { id: Math.random() * 9999, name: `#07 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
      { id: Math.random() * 9999, name: `#08 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
      { id: Math.random() * 9999, name: `#09 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
      { id: Math.random() * 9999, name: `#10 of page ${page}`, price: 2, description: 'bb', developer: ['a'], publisher: ['f'], type: 'game' },
    ] as any[],
    totalCount: 50,
    currentCount: 10,
  };

  if (!success) {
    throw new Response('', {
      status: 404,
      statusText: 'Error 404: Products Not Found',
    });
  }
  return { fetchedGames: data, q, totalCount, currentCount };
}

const SearchPageWithInfiniteScrolling: FC<SearchPageWithInfiniteScrollingProps> = ({}) => {
  const { fetchedGames, q, totalCount, currentCount } = useLoaderData() as {
    fetchedGames: Game[];
    q: string;
    totalCount: number;
    currentCount: number;
  };
  const navigation = useNavigation(); //useNavigation to add global pending UI. navigation.state returns "idle" | "submitting" | "loading". For pagination
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');
  const submit = useSubmit();
  const navigate = useNavigate();

  //The useFetcher hook allows us to communicate with loaders and actions without causing a navigation
  const fetcher = useFetcher();

  //Optimize performance of big lists //
  const [count, setCount] = useState(1_000);
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 30;
  const windowHeight = 500;
  const innerHeight = count * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 3);
  const endIndex = Math.min(Math.floor((scrollTop + windowHeight) / itemHeight) + 3, count);
  const items = Array.from({ length: count }, (_, i) => {
    return {
      index: i + 1,
      name: `Movie ${i + 1}`,
    };
  });

  function displayMovieItems() {
    const displayedItems = items.slice(startIndex, endIndex);
    const movieList = displayedItems.map((item) => {
      return (
        <div
          key={item.index}
          style={{
            height: itemHeight,
            position: 'absolute',
            width: '100%',
            top: `${item.index * itemHeight}px`,
          }}>
          {item.name}
        </div>
      );
    });

    return movieList;
  }

  function onScroll(event: React.UIEvent<HTMLDivElement>) {
    setScrollTop(event.currentTarget.scrollTop);
  }
  ///////////////

  //Search Params
  const [searchParams, setSearchParams] = useSearchParams(q);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) === 0 ? 1 : Number(searchParams.get('page')));
  const [sort, setSort] = useState(
    searchParams.get('sort')?.split(',')[0] && searchParams.get('sort')?.split(',')[1]
      ? {
          field: searchParams.get('sort')?.split(',')[0] as string,
          direction: searchParams.get('sort')?.split(',')[1],
        }
      : {
          field: 'name' as string,
          direction: 'asc',
        }
  );

  const [types, setTypes] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [date1, setDate1] = useState<Date>(new Date(prepareDate(searchParams.get('release_date') ?? '')));
  const [dates2, setDates2] = useState<Date>(new Date(prepareDate(searchParams.get('from_date') ?? '')));
  const [dates3, setDates3] = useState<Date>(new Date(prepareDate(searchParams.get('until_date') ?? '')));

  const onTypeChange = (event: CheckboxChangeParams) => {
    let selectedTypes = [...types];
    if (event.checked) {
      selectedTypes.push(event.value);
    } else {
      selectedTypes.splice(selectedTypes.indexOf(event.value), 1);
    }
    setTypes((prevState) => selectedTypes);
  };

  const orderByItems = [
    { label: 'Name (A-Z)', value: { field: 'name', direction: 'asc' } },
    { label: 'Name (Z-A)', value: { field: 'name', direction: 'desc' } },
    { label: 'Release Date (Old-New)', value: { field: 'release_date', direction: 'asc' } },
    { label: 'Release Date (New-Old)', value: { field: 'release_date', direction: 'desc' } },
    { label: 'Price (Low-High)', value: { field: 'price', direction: 'asc' } },
    { label: 'Price (High-Low)', value: { field: 'price', direction: 'desc' } },
  ];

  function handleOrderBy(event: DropdownChangeParams) {
    setSort((prevState) => event.value);

    //remove page
    searchParams.delete('page');

    //add new params (sort) and redirect to first page
    searchParams.set('sort', `${event.value.field},${event.value.direction}`);
    window.location.search = searchParams.toString();
  }

  const [basicFirst, setBasicFirst] = useState(0);

  const onPageChange = async (event: PaginatorPageState) => {
    setCurrentPage(event.page + 1);
    setBasicFirst(event.first);
    setItemsPerPage(event.rows);

    searchParams.set('page', (1 + event.page).toString());
    console.log('event.first:', event.first, 'event.page+1:', event.page + 1);

    window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);

    const page = Number(searchParams.get('page'));
    const type = searchParams.get('type')?.split(',') ?? [];

    submit({ page: page.toString(), type: type.join(',') }, {});
  };

  const [qValue, setQValue] = useState(q);
  let searchDebounce: NodeJS.Timeout;

  const [rangeValues, setRangeValues] = useState([Number(searchParams.get('min_price')) || 0, Number(searchParams.get('max_price')) || 100]);
  const [selectedCountry1, setSelectedCountry1] = useState<string>('');
  const [filteredCountries, setFilteredCountries] = useState<Game[]>([]);

  const searchCountry = (event: { query: string }) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(async () => {
      let _filteredCountries: Game[];
      if (!event.query.trim().length) {
        _filteredCountries = [];
      } else {
        const { data } = (await api.getItems({ name: selectedCountry1.toLowerCase(), limit: 7 })) as { success: boolean; data: Game[] };
        _filteredCountries = [...data];
      }
      setFilteredCountries(_filteredCountries);
    }, 2000);
  };

  const [infiniteScroll, setInfiniteScroll] = useState(fetchedGames);
  const observer: MutableRefObject<any> = useRef();
  // For infinite scrolling
  const elementRef = useCallback(
    (node: any) => {
      if (fetcher.state !== 'idle') {
        return;
      }
      if (observer?.current) {
        observer?.current?.disconnect();
      }
      const hasNextPage = totalCount > itemsPerPage * (currentPage - 1) + currentCount;
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && fetcher.state === 'idle') {
          //Load next page if last element is visible
          console.log('Load next page if last element is visible');
          setCurrentPage((prevState) => prevState + 1);
          console.log(currentPage);
          searchParams.set('page', (currentPage + 1).toString());
          fetcher.submit({ page: (currentPage + 1).toString() }, {});
        }
      });
      if (node) {
        observer?.current?.observe(node);
      }
    },
    [fetcher, totalCount, itemsPerPage, currentPage, currentCount, searchParams]
  );

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.fetchedGames) {
      console.log(fetcher.data);
      setInfiniteScroll((prevState) => [...prevState, ...fetcher.data?.fetchedGames]);
    }
  }, [fetcher.data?.fetchedGames]);

  return (
    <div>
      <fetcher.Form method='get' id='search-form' role='search'>
        <div className='grid p-fluid'>
          <h1>Search Page</h1>
          <div className='col-12 md:col-4'>
            <div className='p-inputgroup'>
              <InputText
                id='q'
                name={searchParams.get('q') || qValue.length ? 'q' : ''}
                placeholder='Search Products'
                type='search'
                // value={qValue}
              />
              <Button type='submit' icon='pi pi-search' className='p-button-warning' />
              <h5>Basic</h5>
              <AutoComplete
                value={selectedCountry1}
                suggestions={filteredCountries}
                completeMethod={searchCountry}
                field='name'
                onChange={(e: AutoCompleteChangeParams) => setSelectedCountry1(e.value)}
                aria-label='Countries'
                dropdownAriaLabel='Select Country'
                onSelect={(e: AutoCompleteSelectParams) => navigate(`/product/${e.value.type}/${e.value.slug}`)}
              />
            </div>

            <h5>Product Type</h5>
            <div className='field-checkbox'>
              <Checkbox inputId='type1' value={PageType.game} onChange={onTypeChange} checked={types.indexOf(PageType.game) !== -1} />
              <label htmlFor='type1'>{PageType.game}</label>
            </div>
            <div className='field-checkbox'>
              <Checkbox inputId='type2' value={PageType.dlc} onChange={onTypeChange} checked={types.indexOf(PageType.dlc) !== -1} />
              <label htmlFor='type2'>{PageType.dlc}</label>
            </div>
            <div className='field-checkbox'>
              <Checkbox inputId='type3' value={PageType.franchise} onChange={onTypeChange} checked={types.indexOf(PageType.franchise) !== -1} />
              <label htmlFor='type3'>{PageType.franchise}</label>
            </div>
            <div className='field-checkbox'>
              <Checkbox inputId='type4' value={PageType.company} onChange={onTypeChange} checked={types.indexOf(PageType.company) !== -1} />
              <label htmlFor='types4'>{PageType.company}</label>
            </div>
            <InputText name={searchParams.get('type') || types.length ? 'type' : ''} type='text' value={types} className='p-hidden' />

            <div className='col-12 md:col-4'>
              <label htmlFor='release_date'>Release Date</label>
              <Calendar
                id='release_date'
                name={searchParams.get('release_date') || date1.getDate() ? 'release_date' : ''}
                dateFormat='dd/mm/yy'
                value={date1}
                onChange={(e: CalendarChangeParams) => setDate1(e.value as Date)}
                showIcon
              />
            </div>

            <div className='field col-12 md:col-4'>
              <label htmlFor='from_date'>From Date</label>
              <Calendar
                id='from_date'
                name={searchParams.get('from_date') || dates2.getDate() ? 'from_date' : ''}
                dateFormat='dd/mm/yy'
                value={dates2}
                onChange={(e: CalendarChangeParams) => setDates2(e.value as Date)}
                showIcon
              />
            </div>

            <div className='field col-12 md:col-4'>
              <label htmlFor='until_date'>Until Date</label>
              <Calendar
                id='until_date'
                name={searchParams.get('until_date') || dates3.getDate() ? 'until_date' : ''}
                dateFormat='dd/mm/yy'
                value={dates3}
                onChange={(e: CalendarChangeParams) => setDates3(e.value as Date)}
                showIcon
              />
            </div>

            <label>
              <span>Sort By</span>
              <Dropdown options={orderByItems} onChange={handleOrderBy} value={sort} />
              <InputText
                id='sort'
                name={searchParams.get('sort') ? 'sort' : ''}
                type='text'
                value={`${sort.field},${sort.direction}`}
                className='p-hidden'
              />
            </label>

            <h5>
              Range: [{rangeValues[0]}, {rangeValues[1]}]
            </h5>
            <Slider value={rangeValues as SliderValueType} onChange={(e: SliderChangeParams) => setRangeValues(e.value as number[])} range />
            <InputText
              id='min_price'
              name={rangeValues[0] !== 0 || rangeValues[1] !== 100 ? 'min_price' : ''}
              type='number'
              value={rangeValues[0]}
              className='p-hidden'
            />
            <InputText
              id='max_price'
              name={rangeValues[0] !== 0 || rangeValues[1] !== 100 ? 'max_price' : ''}
              type='number'
              value={rangeValues[1]}
              className='p-hidden'
            />
          </div>
        </div>
      </fetcher.Form>
      <GameList items={infiniteScroll} elementRef={elementRef} />

      <div
        className='outerbox'
        style={{
          border: '1px solid red',
          overflowY: 'scroll',
          height: windowHeight,
          width: 300,
          margin: '0 auto',
        }}
        onScroll={onScroll}>
        <div
          className='innerbox'
          style={{
            position: 'relative',
            height: innerHeight,
          }}>
          {displayMovieItems()}
        </div>
      </div>

      <Paginator
        first={currentPage ? itemsPerPage * (currentPage - 1) : 0}
        rows={itemsPerPage}
        totalRecords={totalCount}
        // rowsPerPageOptions={[10, 15, 20]}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SearchPageWithInfiniteScrolling;