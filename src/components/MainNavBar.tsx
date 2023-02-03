//3rd party
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//API
import { authAPI } from '../app/services/authAPI';
//Core
import { languages } from '../core/languages';
import { useGlobalContext } from '../core/context/initialContextState';
import { GlobalActionKeys } from '../core/context/action';
//PrimeReact
import { Menubar } from 'primereact/menubar';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
//API calls
const api = authAPI();

export default function MainNavBar() {
  const navigate = useNavigate();
  const { dispatch, state } = useGlobalContext();

  const { i18n, t } = useTranslation();

  const handleLogout = async () => {
    try {
      const res = await api.logOut();
      console.log(res);
      if (res.message) {
        dispatch({ type: GlobalActionKeys.UpdateUser, payload: null });
        navigate('/');
      } else {
        throw new Error(`${res.code}: ${res.message}`);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const toggleMode = () => {
    dispatch({ type: GlobalActionKeys.UpdateTheme, payload: state.siteTheme === 'dark' ? 'light' : 'dark' });
  };

  const handleChangeLanguage = (event: any) => {
    i18n.changeLanguage(event.item.code);
  };

  const items = [
    {
      label: t('home'),
      icon: PrimeIcons.HOME,
      command: () => navigate('/'),
    },
    {
      label: t('products'),
      icon: PrimeIcons.BOX,
      items: [
        {
          label: t('genres'),
          icon: 'pi pi-plus',
          items: [
            {
              label: 'Bookmark',
              icon: PrimeIcons.BOOKMARK,
            },
            {
              label: 'Bookmark',
              icon: PrimeIcons.BOOKMARK,
            },
          ],
        },
        {
          label: t('platforms'),
          icon: PrimeIcons.BOOKMARK,
          items: [
            {
              label: 'Bookmark',
              icon: PrimeIcons.BOOKMARK,
            },
            {
              label: 'Bookmark',
              icon: PrimeIcons.BOOKMARK,
            },
          ],
        },
        {
          separator: true,
        },
        {
          label: t('search.noun_one', { ns: 'common' }),
          icon: PrimeIcons.SEARCH,
          command: () => navigate('/search'),
        },
      ],
    },
    {
      label: t('profile'),
      icon: PrimeIcons.USER,
      items: [
        {
          label: t('log_in'),
          icon: PrimeIcons.SIGN_IN,
          visible: state?.user ? false : true,
          command: () => navigate('/login'),
        },
        {
          label: t('sign_up'),
          icon: PrimeIcons.SIGN_IN,
          visible: state?.user ? false : true,
          command: () => navigate('/signup'),
        },
        {
          label: t('account', { ns: 'common' }),
          icon: PrimeIcons.BOOKMARK,
          visible: state?.user ? true : false,
          command: () => navigate('/profile'),
        },
        {
          label: t('wishlist', { ns: 'common' }),
          icon: PrimeIcons.BOOKMARK,
          visible: state?.user ? true : false,
        },
        {
          separator: state?.user ? true : false,
          visible: state?.user ? true : false,
        },
        {
          label: t('log_out'),
          icon: PrimeIcons.SIGN_OUT,
          visible: state?.user ? true : false,
          command: handleLogout,
        },
      ],
    },
    {
      label: t('language', { ns: 'common' }),
      icon: 'pi pi-language',
      items: [
        {
          label: languages.en.nativeLabel,
          icon: PrimeIcons.FLAG,
          code: languages.en.code,
          command: handleChangeLanguage,
        },
        {
          label: languages.he.nativeLabel,
          icon: PrimeIcons.FLAG,
          code: languages.he.code,
          command: handleChangeLanguage,
        },
      ],
    },
    {
      label: t('add_new_product'),
      icon: PrimeIcons.PLUS,
      visible: state?.user ? true : false,
      command: () => navigate('/product/add'),
    },
  ];

  return (
    <Menubar
      model={items}
      start={<InputText placeholder='Search' type='text' />}
      end={<Button label='' icon={state.siteTheme === 'dark' ? PrimeIcons.SUN : PrimeIcons.MOON} onClick={toggleMode} />}
    />
  );
}
