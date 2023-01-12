//*Description: This component is used to add a new game to the database*
//React
import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
//3rd parties
import { Form } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//PrimeReact
import { MultiSelect } from 'primereact/multiselect';
import type { MultiSelectChangeParams } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import type { ToastAppendToType } from 'primereact/toast';
//Context
import { useGlobalContext } from '../core/context/initialContextState';
//Components
import type { EditProductAction, EditProductLoader } from '../pages/EditProductPage';
//API
import type { Game } from '../app/services/itemAPI';

type EditFormProductProps = {
  loaderData: EditProductLoader;
  actionData: EditProductAction;
};

export default function EditFormProduct({ loaderData, actionData }: EditFormProductProps) {
  const { state } = useGlobalContext();
  const { t } = useTranslation();

  const toastRef: MutableRefObject<ToastAppendToType | any> = useRef(null);

  const [editedGame, setEditedGame] = useState<Game>(loaderData.result || ({} as Game)); //For changing and displaying the game data in the form fields only!

  //For displaying the game data in the form fields
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditedGame((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value,
    }));
  }

  const [publishers, setPublishers] = useState('');
  const publisherSelectItems = [
    { label: 'Electronic Arts', value: 'EA' },
    { label: 'Activision Blizzard', value: 'ATVI' },
    { label: 'Ubisoft', value: 'UBI' },
    { label: '2K Games', value: '2K' },
    { label: 'PlayStation PC LLC', value: 'PSPC' },
    { label: 'Microsoft', value: 'MSFT' },
    { label: 'Bethesda Softworks', value: 'BTSW' },
  ];

  function handleSelect(event: MultiSelectChangeParams) {
    setPublishers((prevState) => event.value);
    if (toastRef?.current) {
      toastRef.current?.show({ severity: 'info', summary: 'Selected', detail: event.value, life: 3000 });
    }
  }

  useEffect(() => {
    if (actionData) {
      if (actionData?.success && toastRef?.current) {
        toastRef.current?.show({ severity: 'success', summary: 'Success', detail: 'Product successfully edited', life: 3000 });
      } else {
        toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Error updating the product', life: 3000 });
      }
    }
    return () => {};
  }, [actionData]);

  return (
    <div>
      <Toast ref={toastRef} />
      <p>{t('edit_game')}</p>

      <Form method='post' id='add-game-form'>
        {loaderData.result && typeof loaderData.result === 'object' ? (
          <>
            <label>
              <span>{t('title')}</span>
              <InputText name='title' type='text' value={editedGame.title} onChange={handleChange} required />
            </label>
            <label>
              <span>{t('type')}</span>
              <InputText name='type' type='text' value={editedGame.type} onChange={handleChange} required />
            </label>
            <label>
              <span>{t('publisher')}</span>
              <MultiSelect type='text' value={editedGame.publisher} options={publisherSelectItems} onChange={handleSelect} filter />
              <InputText name='publisher' type='text' value={publishers} className='p-hidden' />
            </label>
          </>
        ) : (
          <>
            <label>
              <span>{t('title')}</span>
              <InputText name='title' type='text' disabled />
            </label>
            <label>
              <span>{t('type')}</span>
              <InputText name='type' type='text' disabled />
            </label>
            <label>
              <span>{t('publisher')}</span>
              <MultiSelect type='text' disabled />
            </label>
          </>
        )}
        <Button
          type='submit'
          label={t('edit', { ns: 'common' }) || 'Edit'}
          className='p-button-secondary'
          icon='pi pi-check'
          disabled={!loaderData.result}
        />
      </Form>
    </div>
  );
}
