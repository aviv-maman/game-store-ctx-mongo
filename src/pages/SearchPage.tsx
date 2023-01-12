//React
import { useEffect, useState } from 'react';
import type { FC } from 'react';
//React Router DOM
import { Form, useLoaderData, useNavigation, useSearchParams } from 'react-router-dom';
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

type SearchPageProps = {};

//API calls
const api = itemsAPI('products');

//Loader
export async function searchLoader({ request }: LoaderFunctionArgs): Promise<{ fetchedGames?: Game[]; qValue: string }> {
  const url = new URL(request.url);
  if (!url.searchParams.get('page') || Number(url.searchParams.get('page')) === 0) {
    url.searchParams.set('page', '1');
  }

  const qValue = url.searchParams.get('q') ?? '';
  const q = { value: qValue };

  const typeValue = url.searchParams.get('type')?.split(',') ?? [];
  const type = { value: typeValue };

  const orderByValue = url.searchParams.get('sort')?.split(',') ?? [];
  const orderBy = { fieldPath: orderByValue[0] as string, directionStr: orderByValue[1] as 'asc' | 'desc' };

  const page = Number(url.searchParams.get('page'));

  const perPage = Number(url.searchParams.get('perPage') ?? 10);

  const { success, data } = (await api.getItems({ q, type, orderBy, perPage, page })) as {
    success: boolean;
    data: Game[];
  };

  console.log(request.url);

  if (!success) {
    throw new Response('', {
      status: 404,
      statusText: 'Error 404: Products Not Found',
    });
  }
  return { fetchedGames: data, qValue };
}

const SearchPage: FC<SearchPageProps> = ({}) => {
  const { fetchedGames, qValue } = useLoaderData() as { fetchedGames: Game[]; qValue: string };
  const navigation = useNavigation(); //useNavigation to add global pending UI. useNavigation returns "idle" | "submitting" | "loading"
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

  //Search Params
  const [searchParams, setSearchParams] = useSearchParams(qValue);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) === 0 ? 1 : Number(searchParams.get('page')));
  const [sort, setSort] = useState(
    searchParams.get('sort')?.split(',')[0] && searchParams.get('sort')?.split(',')[1]
      ? {
          field: searchParams.get('sort')?.split(',')[0] as string,
          direction: searchParams.get('sort')?.split(',')[1],
        }
      : {
          field: 'title' as string,
          direction: 'asc',
        }
  );

  const [types, setTypes] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [date1, setDate1] = useState<Date | Date[] | undefined>(new Date(searchParams.get('release_date') ?? ''));
  const [dates2, setDates2] = useState<Date | Date[] | undefined>(new Date(searchParams.get('from_date') ?? ''));
  const [dates3, setDates3] = useState<Date | Date[] | undefined>(new Date(searchParams.get('until_date') ?? ''));

  const onTypeChange = (event: CheckboxChangeParams) => {
    let selectedTypes = [...types];
    if (event.checked) {
      selectedTypes.push(event.value);
    } else {
      selectedTypes.splice(selectedTypes.indexOf(event.value), 1);
    }
    setTypes((prevState) => selectedTypes);
    //remove page
    searchParams.delete('page');

    //add new params (type) and redirect to first page
    searchParams.set('type', selectedTypes.join(','));
    window.location.search = searchParams.toString();
  };

  const orderByItems = [
    { label: 'Name (A-Z)', value: { field: 'title', direction: 'asc' } },
    { label: 'Name (Z-A)', value: { field: 'title', direction: 'desc' } },
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

  const [newFetchedGames, setNewFetchedGames] = useState(fetchedGames);

  const onPageChange = async (event: PaginatorPageState) => {
    setCurrentPage(event.first);
    setItemsPerPage(event.rows);

    searchParams.set('page', (1 + event.page).toString());
    window.location.search = searchParams.toString();
  };

  useEffect(() => {
    (document.getElementById('q') as HTMLInputElement).value = qValue;
    if (searchParams.get('type') !== null && searchParams.get('type') !== '') {
      setTypes((prevState) => searchParams.get('type')?.split(',') ?? []);
    }
  }, [qValue]);

  useEffect(() => {
    //Delete empty params
    searchParams.forEach((value, key) => {
      if (value.length === 0 || value === undefined || value === null || value === '') {
        searchParams.delete(key);
        console.log('deleted:', key);
        // window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
      }
    });
  }, [searchParams]);

  return (
    <div>
      <Form method='get' id='search-form' role='search'>
        <div className='grid p-fluid'>
          <h1>Search Page</h1>
          <div className='col-12 md:col-4'>
            <div className='p-inputgroup'>
              <InputText id='q' name='q' placeholder='Search Products' type='search' />
              <Button type='submit' icon='pi pi-search' className='p-button-warning' />
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
            <InputText name='type' type='text' value={types} className='p-hidden' />

            <div className='col-12 md:col-4'>
              <label htmlFor='release_date'>Release Date</label>
              <Calendar
                id='release_date'
                name='release_date'
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
                name='from_date'
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
                name='until_date'
                dateFormat='dd/mm/yy'
                value={dates3}
                onChange={(e: CalendarChangeParams) => setDates3(e.value as Date)}
                showIcon
              />
            </div>

            <label>
              <span>Sort By</span>
              <Dropdown options={orderByItems} onChange={handleOrderBy} value={sort} />
              <InputText name='sort' type='text' value={`${sort.field},${sort.direction}`} className='p-hidden' />
            </label>

            {/* <InputText name='page' type='text' value={Number(searchParams.get('page'))} className='p-hidden' /> */}
          </div>
        </div>
      </Form>
      <GameList items={newFetchedGames} />
      <Paginator
        first={currentPage ? itemsPerPage * (currentPage - 1) : 0}
        rows={itemsPerPage}
        totalRecords={30}
        // rowsPerPageOptions={[10, 15, 20]}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SearchPage;
