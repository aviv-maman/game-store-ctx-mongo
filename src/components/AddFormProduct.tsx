//*Description: This component is used to add a new game to the database*
//React
import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
//3rd parties
import { Form } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//PrimeReact
import { MultiSelect } from 'primereact/multiselect';
import type { MultiSelectChangeEvent } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import type { ToastProps } from 'primereact/toast';
//Context
import { useGlobalContext } from '../core/context/initialContextState';
//Components
import type { AddProductAction } from '../pages/AddProductPage';

type FormAddProductProps = {
  data: AddProductAction;
};

export default function AddFormProduct({ data }: FormAddProductProps) {
  const { state } = useGlobalContext();
  const { t } = useTranslation();

  const toastRef: MutableRefObject<ToastProps | any> = useRef(null);

  //For Validation etc
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    // setNewGame((previousState) => ({
    //   ...previousState,
    //   [event.target.name]: event.target.value,
    // }));
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

  function handleSelect(event: MultiSelectChangeEvent) {
    setPublishers((prevState) => event.value);
    if (toastRef?.current) {
      toastRef.current?.show({ severity: 'info', summary: 'Selected', detail: event.value, life: 3000 });
    }
  }

  useEffect(() => {
    if (data?.message?.length > 0 && toastRef?.current) {
      if (data.success) {
        toastRef.current?.show({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
      } else {
        toastRef.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
      }
    }
    return () => {};
  }, [data]);

  return (
    <div>
      <Toast ref={toastRef} />

      <p>{t('add_new_game')}</p>
      <Form method='post' id='add-game-form'>
        <label>
          <span>{t('name')}</span>
          <InputText name='name' type='text' onChange={handleChange} required />
        </label>

        <label>
          <span>{t('type')}</span>
          <InputText name='type' type='text' onChange={handleChange} />
        </label>

        <label>
          <span>{t('price')}</span>
          <InputText name='price' type='number' onChange={handleChange} />
        </label>

        <label>
          <span>{t('publisher')}</span>
          <MultiSelect type='text' value={publishers} options={publisherSelectItems} onChange={handleSelect} filter />
          <InputText name='publisher' type='text' value={publishers} className='p-hidden' />
        </label>

        <Button type='submit' label={t('add', { ns: 'common' }) || 'Add'} className='p-button-secondary' icon='pi pi-check' />
      </Form>
    </div>
  );
}
