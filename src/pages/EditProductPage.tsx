//React
import { useRef } from 'react';
import type { MutableRefObject } from 'react';
//React Router DOM
import { useActionData, useLoaderData } from 'react-router-dom';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';
//API
import { itemsAPI } from '../app/services/itemAPI';
import type { Game } from '../app/services/itemAPI';
//Components
import EditFormProduct from '../components/EditFormProduct';
//PrimeReact
import { Toast } from 'primereact/toast';
import type { ToastAppendToType } from 'primereact/toast';

//API calls
const api = itemsAPI('products');

export type EditProductLoader = { success: boolean; result?: Game; message?: string };
export type EditProductAction = { success: boolean; result?: Game; message?: string };

export async function editProductLoader({ request, params }: LoaderFunctionArgs): Promise<EditProductLoader> {
  if (params.productId) {
    const getItemPromise = await api.getItemById(params.productId);
    if (!getItemPromise.success) {
      throw new Response('', {
        status: 404,
        statusText: 'Product ID was not found',
      });
    }
    return { success: getItemPromise.success, result: getItemPromise.data };
  }
  return { success: false, message: 'Product ID was not found' };
}

export async function editProductAction({ request, params }: ActionFunctionArgs): Promise<EditProductAction> {
  const formData = await request.formData();
  const newGameObject: any = Object.fromEntries(formData);
  const publisher = formData.get('publisher')?.toString() ?? '';
  newGameObject.publisher = publisher.split(',').map((item: string) => item.trim());
  console.log(newGameObject);
  if (params.productId) {
    const addedGamePromise = await api.updateItemById(params.productId, newGameObject);
    return { success: addedGamePromise.success, result: addedGamePromise.data };
  }
  return { success: false, message: 'Product ID was not found' };
}

export default function EditProductPage() {
  const loaderData = useLoaderData() as EditProductLoader;
  const actionData = useActionData() as EditProductAction;
  const toastRef: MutableRefObject<ToastAppendToType | any> = useRef(null);

  return (
    <div style={{ border: '1px solid red' }}>
      <h1>Edit Product Page</h1>
      <EditFormProduct loaderData={loaderData} actionData={actionData} />
      <Toast ref={toastRef} />
    </div>
  );
}
