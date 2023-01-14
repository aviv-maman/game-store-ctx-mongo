//Franchise => Games => Editions => DLCs

import axios from 'axios';

export enum PageType {
  franchise = 'franchise',
  game = 'game',
  dlc = 'dlc',
  company = 'company',
}

export type Franchise = {
  id: string;
  name: string;
  description: string;
  developer: string[];
  publisher: string[];
  children: Game[];
  type: PageType.franchise;
};

export enum EditionName {
  standard = 'Standard',
  deluxe = 'Deluxe',
  gold = 'Gold',
  ultimate = 'Ultimate',
  collector = 'Collector',
  anniversary = 'Anniversary',
  definitive = 'Definitive',
  complete = 'Complete',
  remake = 'Remake',
  remaster = 'Remaster',
  remastered = 'Remastered',
  hd = 'HD',
}

export type Game = {
  id: string;
  name: string;
  description: string;
  editions: EditionName[];
  dlcs?: DLC[];
  developer: string[];
  publisher: string[];
  release_date: number;
  genres: string[];
  price: number[];
  steam_url?: string;
  epic_url?: string;
  official_url?: string;
  languages: string[];
  age_rating: string[];
  tags?: string[];
  imageCover?: string;
  screenshots?: string[];
  videos?: string[];
  achievements?: string[];
  achievements_count?: number;
  drm: string;
  platforms: string[];
  system_requirements: string[];
  parent: Franchise;
  type: PageType.game;
};

export type DLC = {
  id: string;
  name: string;
  description: string;
  developer: string[];
  publisher: string[];
  release_date: number;
  genres: string[];
  price: number[];
  steam_url?: string;
  epic_url?: string;
  official_url?: string;
  languages?: string[];
  age_rating?: string[];
  tags?: string[];
  imageCover?: string;
  screenshots?: string[];
  videos?: string[];
  achievements?: string[];
  achievements_count?: number;
  drm?: string;
  platforms?: string[];
  system_requirements?: string[];
  parent: Game;
  type: PageType.dlc;
};

export type ServerResponse = {
  message?: string;
  items: Game[];
  length: number;
  totalLength: number;
  page: number;
  totalPages: number;
};

export type Query = {
  q?: string;
  type?: string[];
  genre?: string[];
  perPage?: number;
  orderBy?: { fieldPath: string; directionStr: 'asc' | 'desc' };
  page?: number;
};

export type ItemsAPI = {
  getItems: (query: Query) => Promise<{ success: boolean; data: Game[] }> | unknown;
  getItemById: (itemId: string) => Promise<any>;
  addItem: (formData: Game) => Promise<any>;
  deleteItemById: (itemId: string) => Promise<any>;
  updateItemById: (itemId: string, formData: Game) => Promise<any>;
};

export const itemsAPI = (): ItemsAPI => {
  return {
    getItems: async (queryObject) => {
      const controller = new AbortController();
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/products`, { params: queryObject, withCredentials: true });
        return { success: true, ...res.data };
      } catch (error) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('Could not fetch the data.');
          console.error(error);
          throw error;
        }
      }
      return () => controller.abort();
    },
    getItemById: async (docId: string) => {
      const controller = new AbortController();
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/products/${docId}`, { withCredentials: true });
        return { success: true, ...res.data };
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with getting the document.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    addItem: async (formData) => {
      const controller = new AbortController();
      try {
        const res = await axios.post(`http://localhost:8000/api/v1/products`, formData, { withCredentials: true });
        return { success: true, message: 'A document was successfully added.', ...res.data };
      } catch (error) {
        if (controller.signal.aborted) {
          console.log('the request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with adding the document.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    deleteItemById: async (docId: string) => {
      const controller = new AbortController();
      try {
        await axios.delete(`http://localhost:8000/api/v1/products/${docId}`, { withCredentials: true });
        return { success: true, message: 'A document was successfully deleted.', id: docId };
      } catch (error) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with deleting the document.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    updateItemById: async (docId: string, formData: Game) => {
      const controller = new AbortController();
      try {
        await axios.put(`http://localhost:8000/api/v1/products/${docId}`, formData, { withCredentials: true });
        return { success: true, message: 'A document was successfully updated.', id: docId };
      } catch (error) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with updating the document.');
          throw error;
        }
      }
      return () => controller.abort();
    },
  };
};
