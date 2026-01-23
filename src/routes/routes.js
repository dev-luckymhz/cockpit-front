import Tickets from '../pages/Tickets';
import Securite from '../pages/Securite';
import Dashboard from '../pages/Dashboard';
import Parametres from '../pages/Parametres';
import Abonnements from '../pages/Abonnements';
import Sauvegardes from '../pages/Sauvegardes';
import ZonesClients from '../pages/ZonesClients';
import Utilisateurs from '../pages/Utilisateurs';
import AbonnementsM365 from '../pages/AbonnementsM365';
import MonitoringZabbix from '../pages/MonitoringZabbix';
import StatutDesServices from '../pages/StatutDesServices';
import InventaireDetails from '../pages/inventory/InventoryDataTable';
import LicenseTables from '../pages/inventory/LicenseTables';

import Ion from '../pages/ion/Ion';
import IonDetails from '../pages/ion/device-details';


import Eset from '../pages/eset/company-list';
import EsetDevicesList from '../pages/eset/device-list';
import EsetDeviceDetails from '../pages/eset/device-detail';

import Ninja from '../pages/Ninja/Ninja';

import Profile from '../pages/user/profile';
import UserCreate from '../pages/user/UserCreate';

const routes = [
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/zones-clients',
    element: <ZonesClients />,
  },
  {
    path: '/inventaire',
    element: <InventaireDetails />,
  },
  {
    path: '/tickets',
    element: <Tickets />,
  },
  {
    path: '/utilisateurs',
    element: <Utilisateurs />,
  },
  {
    path: '/abonnements',
    element: <Abonnements />,
  },
  {
    path: '/abonnementsM365',
    element: <AbonnementsM365 />,
  },
  {
    path: '/securite',
    element: <Securite />,
  },
  {
    path: '/sauvegardes',
    element: <Sauvegardes />,
  },
  {
    path: '/statut-des-services',
    element: <StatutDesServices />,
  },
  {
    path: '/monitoring-zabbix',
    element: <MonitoringZabbix />,
  },
  {
    path: '/parametres',
    element: <Parametres />,
  },

  {
    path: '/user/profile',
    element: <Profile />,
  },

  {
    path: '/utilisateurs/Create',
    element: <UserCreate />,
  },


  { path: '/ion', element: <Ion /> },
  { path: '/ion/device', element: <IonDetails /> },


  { path: '/eset', element: <Eset /> },
  { path: '/eset/device/list', element: <EsetDevicesList /> },
  { path: '/eset/device/:id/details', element: <EsetDeviceDetails /> },
  { path: '/inventory/pc', element: <InventaireDetails /> },
  
  
  { path: '/inventory/list', element: <LicenseTables /> },

  
  { path: '/ninja', element: <Ninja /> },

];

export default routes;
