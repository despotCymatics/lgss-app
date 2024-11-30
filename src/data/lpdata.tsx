import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import LockIcon from '@mui/icons-material/Lock';
import MedicationIcon from '@mui/icons-material/Medication';
import PestControlIcon from '@mui/icons-material/PestControl';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BathtubIcon from '@mui/icons-material/Bathtub';
import CountertopsIcon from '@mui/icons-material/Countertops';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BathroomIcon from '@mui/icons-material/Bathroom';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import RoofingIcon from '@mui/icons-material/Roofing';
import roofingImage from '../assets/img/roofing.jpg';
import bathroomImage from '../assets/img/bathroom.jpg';
import doorImage from '../assets/img/door.jpg';
import kitchenImage from '../assets/img/kitchen.jpg';
import guttersImage from '../assets/img/gutters.jpg';
import sidingImage from '../assets/img/siding.jpg';
import walkInTubsImage from '../assets/img/walkin-tub.jpg';
import windowImage from '../assets/img/window.jpg';


export const affiliateLinks: { [key: string]: string } = {

  //Leads
  '80': 'https://leadgiant.wufoo.com/forms/affiliate-80-cost-per-sale-application/',

  // Calls
  '79': 'https://leadgiant.wufoo.com/forms/affiliate-79-cost-per-appointment-application/',
  '81': 'https://leadgiant.wufoo.com/forms/affiliate-81-cost-per-transfer-application/',
  '82': 'https://leadgiant.wufoo.com/forms/affiliate-82-branded-call-campaign-application/',

};

export const verticalVisualData: { [key: string]: VerticalVisualData }[] = [
  { '1': { icon: <RoofingIcon sx={{ fontSize: 40 }} />, color: '#f44336', image: roofingImage } },
  { '2': { icon: <SensorWindowIcon sx={{ fontSize: 40 }} />, color: '#e91e63', image: windowImage } },
  { '3': { icon: <HouseSidingIcon sx={{ fontSize: 40 }} />, color: '#9c27b0', image: sidingImage } },
  { '4': { icon: <SolarPowerIcon sx={{ fontSize: 40 }} />, color: '#009688', image: '' } },
  { '5': { icon: <BathroomIcon sx={{ fontSize: 40 }} />, color: '#2196f3', image: bathroomImage } },
  { '6': { icon: <BathtubIcon sx={{ fontSize: 40 }} />, color: '#00bcd4', image: walkInTubsImage } },
  { '7': { icon: <LockIcon sx={{ fontSize: 40 }} />, color: '#9c27b0', image: '' } },
  { '8': { icon: <MedicationIcon sx={{ fontSize: 40 }} />, color: '#b2102f', image: '' } },
  { '9': { icon: <PestControlIcon sx={{ fontSize: 40 }} />, color: '#673ab7', image: '' } },
  { '10': { icon: <HealthAndSafetyIcon sx={{ fontSize: 40 }} />, color: '#009688', image: '' } },
  { '11': { icon: <DashboardIcon sx={{ fontSize: 40 }} />, color: '#ffc107', image: '' } },
  { '12': { icon: <CountertopsIcon sx={{ fontSize: 40 }} />, color: '#795548', image: kitchenImage } },
  { '13': { icon: <AssignmentTurnedInIcon sx={{ fontSize: 40 }} />, color: '#01579b', image: '' } },
  { '14': { icon: <MeetingRoomIcon sx={{ fontSize: 40 }} />, color: '#01579b', image: doorImage } },
  { '22': { icon: <WaterDamageIcon sx={{ fontSize: 40 }} />, color: '#009688', image: guttersImage } },
];

export type VerticalOffer = {
  name: string;
  id: string;
};

export const verticalIDToLeadOffers: { [key: string]: VerticalOffer[] }[] = [
  {
    '1': [
      { name: 'Compliant Non 1:1 Consent Roofing Leads', id: '68' },
      { name: 'Compliant 1:1 Consent Roofing Leads', id: '315' },
      { name: 'Specialty Campaigns Roofing Leads', id: '306' },
    ],
  },
  {
    '2': [
      { name: 'Compliant Non 1:1 Consent Windows Leads', id: '73' },
      { name: 'Compliant 1:1 Consent Windows Leads', id: '318' },
      { name: 'Specialty Campaigns Windows Leads', id: '304' },
    ],
  },
  {
    '3': [
      { name: 'Compliant Non 1:1 Consent Siding Leads', id: '69' },
      { name: 'Compliant 1:1 Consent Siding Leads', id: '316' },
      { name: 'Specialty Campaigns Siding Leads', id: '307' },
    ],
  },
  {
    '5': [
      { name: 'Compliant Non 1:1 Consent Bathroom Leads', id: '74' },
      { name: 'Compliant 1:1 Consent Bathroom Leads', id: '310' },
      { name: 'Specialty Campaigns Bathroom Leads', id: '303' },
    ],
  },
  {
    '6': [
      { name: 'Compliant Non 1:1 Consent Walk-In Tub Leads', id: '75' },
      { name: 'Compliant 1:1 Consent Walk-In Tub Leads', id: '317' },
      { name: 'Specialty Campaigns Walk-In Tub Leads', id: '308' },
    ],
  },
  {
    '14': [
      { name: 'Compliant Non 1:1 Consent Door Leads', id: '70' },
      { name: 'Compliant 1:1 Consent Door Leads', id: '312' },
    ],
  },
  {
    '22': [
      { name: 'Compliant Non 1:1 Consent Gutters Leads', id: '72' },
      { name: 'Compliant 1:1 Consent Gutters Leads', id: '313' },
      { name: 'Specialty Campaigns Gutters Leads', id: '305' },
    ],
  },
  {
    '12': [
      { name: 'Compliant Non 1:1 Consent Kitchen Leads', id: '71' },
      { name: 'Compliant 1:1 Consent Kitchen Leads', id: '314' },
    ],
  },
];

export const verticalIDToCallOffers: { [key: string]: VerticalOffer[] }[] = [
  {
    '5': [
      { id: '253', name: 'Inbounds Bathroom 30 Sec.' },
      { id: '254', name: 'Inbounds Bathroom 60 Sec.' },
      { id: '255', name: 'Inbounds Bathroom 90 Sec.' },
      { id: '252', name: 'Inbounds Bathroom 120 Sec.' },
      { id: '238', name: 'Transfers Bathroom 30 Sec.' },
      { id: '229', name: 'Transfers Bathroom 60 Sec.' },
      { id: '220', name: 'Transfers Bathroom 90 Sec.' },
      { id: '211', name: 'Transfers Bathroom 120 Sec.' },
      { name: 'Specialty Campaigns Bathroom Calls', id: '295' },
    ]
  },
  {
    '19': [
      { id: '257', name: 'Inbounds Cabinet Replacing 30 Sec.' },
      { id: '258', name: 'Inbounds Cabinet Replacing 60 Sec.' },
      { id: '259', name: 'Inbounds Cabinet Replacing 90 Sec.' },
      { id: '256', name: 'Inbounds Cabinet Replacing 120 Sec.' },
      { id: '239', name: 'Transfers Cabinet Replacing 30 Sec.' },
      { id: '230', name: 'Transfers Cabinet Replacing 60 Sec.' },
      { id: '221', name: 'Transfers Cabinet Replacing 90 Sec.' },
      { id: '212', name: 'Transfers Cabinet Replacing 120 Sec.' }
    ]
  },
  {
    '14': [
      { id: '261', name: 'Inbounds Doors 30 Sec.' },
      { id: '262', name: 'Inbounds Doors 60 Sec.' },
      { id: '263', name: 'Inbounds Doors 90 Sec.' },
      { id: '260', name: 'Inbounds Doors 120 Sec.' },
      { id: '240', name: 'Transfers Doors 30 Sec.' },
      { id: '231', name: 'Transfers Doors 60 Sec.' },
      { id: '222', name: 'Transfers Doors 90 Sec.' },
      { id: '213', name: 'Transfers Doors 120 Sec.' }
    ]
  },
  {
    '22': [
      { id: '265', name: 'Inbounds Gutters 30 Sec.' },
      { id: '266', name: 'Inbounds Gutters 60 Sec.' },
      { id: '169', name: 'Inbounds Gutters 90 Sec.' },
      { id: '267', name: 'Inbounds Gutters 120 Sec.' },
      { id: '264', name: 'Transfers Gutters 30 Sec.' },
      { id: '232', name: 'Transfers Gutters 60 Sec.' },
      { id: '223', name: 'Transfers Gutters 90 Sec.' },
      { id: '214', name: 'Transfers Gutters 120 Sec.' },
      { name: 'Specialty Campaigns Gutters Calls', id: '300' },
    ]
  },
  {
    '12': [
      { id: '269', name: 'Inbounds Kitchen 30 Sec.' },
      { id: '270', name: 'Inbounds Kitchen 60 Sec.' },
      { id: '271', name: 'Inbounds Kitchen 90 Sec.' },
      { id: '268', name: 'Inbounds Kitchen 120 Sec.' },
      { id: '242', name: 'Transfers Kitchen 30 Sec.' },
      { id: '233', name: 'Transfers Kitchen 60 Sec.' },
      { id: '224', name: 'Transfers Kitchen 90 Sec.' },
      { id: '215', name: 'Transfers Kitchen 120 Sec.' },
      { name: 'Specialty Campaigns Kitchen Calls', id: '302' },
    ]
  },
  {
    '1': [
      { id: '273', name: 'Inbounds Roofing 30 Sec.' },
      { id: '274', name: 'Inbounds Roofing 60 Sec.' },
      { id: '275', name: 'Inbounds Roofing 90 Sec.' },
      { id: '272', name: 'Inbounds Roofing 120 Sec.' },
      { id: '243', name: 'Transfers Roofing 30 Sec.' },
      { id: '234', name: 'Transfers Roofing 60 Sec.' },
      { id: '225', name: 'Transfers Roofing 90 Sec.' },
      { id: '216', name: 'Transfers Roofing 120 Sec.' },
      { name: 'Specialty Campaigns Roofing Calls', id: '299' },
    ]
  },
  {
    '2': [
      { id: '286', name: 'Inbounds Windows 30 Sec.' },
      { id: '287', name: 'Inbounds Windows 60 Sec.' },
      { id: '288', name: 'Inbounds Windows 90 Sec.' },
      { id: '285', name: 'Inbounds Windows 120 Sec.' },
      { id: '244', name: 'Transfers Windows 30 Sec.' },
      { id: '235', name: 'Transfers Windows 60 Sec.' },
      { id: '226', name: 'Transfers Windows 90 Sec.' },
      { id: '217', name: 'Transfers Windows 120 Sec.' },
      { name: 'Specialty Campaigns Windows Calls', id: '296' },
    ]
  },
  {
    '6': [
      { id: '282', name: 'Inbounds Walk-In Tub 30 Sec.' },
      { id: '283', name: 'Inbounds Walk-In Tub 60 Sec.' },
      { id: '284', name: 'Inbounds Walk-In Tub 90 Sec.' },
      { id: '281', name: 'Inbounds Walk-In Tub 120 Sec.' },
      { id: '245', name: 'Transfers Walk-In Tub 30 Sec.' },
      { id: '236', name: 'Transfers Walk-In Tub 60 Sec.' },
      { id: '227', name: 'Transfers Walk-In Tub 90 Sec.' },
      { id: '218', name: 'Transfers Walk-In Tub 120 Sec.' },
      { name: 'Specialty Campaigns Walk-In Tub Calls', id: '297' },
    ]
  },
  {
    '3': [
      { id: '277', name: 'Inbounds Siding 30 Sec.' },
      { id: '278', name: 'Inbounds Siding 60 Sec.' },
      { id: '279', name: 'Inbounds Siding 90 Sec.' },
      { id: '276', name: 'Inbounds Siding 120 Sec.' },
      { id: '246', name: 'Transfers Siding 30 Sec.' },
      { id: '237', name: 'Transfers Siding 60 Sec.' },
      { id: '228', name: 'Transfers Siding 90 Sec.' },
      { id: '219', name: 'Transfers Siding 120 Sec.' },
      { name: 'Specialty Campaigns Siding Calls', id: '298' },
    ]
  }
];


export type VerticalVisualData = {
  icon: JSX.Element;
  color: string;
  image: string;
};
