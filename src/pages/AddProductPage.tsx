//React
import { useRef } from 'react';
import type { MutableRefObject } from 'react';
//React Router DOM
import { useActionData } from 'react-router-dom';
import type { ActionFunctionArgs } from 'react-router-dom';
//API
import { itemsAPI } from '../app/services/itemAPI';
import type { Game } from '../app/services/itemAPI';
//Components
import AddFormProduct from '../components/AddFormProduct';
//PrimeReact
import { Toast } from 'primereact/toast';
import type { ToastProps } from 'primereact/toast';

//API calls
const api = itemsAPI();

export type AddProductAction = { success: boolean; message: string };

export async function addProductAction({ request, params }: ActionFunctionArgs): Promise<AddProductAction> {
  const formData = await request.formData();
  const newGameObject: any = Object.fromEntries(formData);
  const publisher = formData.get('publisher')?.toString() ?? '';
  newGameObject.publisher = publisher.split(',').map((item: string) => item.trim());
  console.log(newGameObject);
  const addedGamePromise = await api.addItem(newGameObject);
  return { success: addedGamePromise.success, message: addedGamePromise.message };
}

export default function AddProductPage() {
  const data = useActionData() as AddProductAction;
  const toastRef: MutableRefObject<ToastProps | any> = useRef(null);

  return (
    <div style={{ border: '1px solid red' }}>
      <h1>Add Product Page</h1>
      <AddFormProduct data={data} />
      <Toast ref={toastRef} />
    </div>
  );
}
