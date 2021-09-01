import SportsImageIcon from '../data/icons/events-sports-icon.svg';
import CryptoImageIcon from '../data/icons/events-other-icon.svg';
import PoliticsImageIcon from '../data/icons/events-politics-icon.svg';
import CelebritiesImageIcon from '../data/icons/events-celebrities-icon.svg';
import AllImageIcon from '../data/icons/events-all-icon.svg';
import CoDImage from '../data/images/Call of Duty_ Warzone-144x192.jpeg';
import FifaImage from '../data/images/FIFA 21-144x192.jpeg';
import LoLImage from '../data/images/League of Legends-144x192.jpeg';
import MinecraftImage from '../data/images/Minecraft-144x192.jpeg';
import AllImage from '../data/images/wallfair-all-category.png';
import FortniteImage from '../data/images/Fortnite-144x192.jpeg';
import ApexLegendsImage from '../data/images/Apex Legends-144x192.jpeg';
import GTAImage from '../data/images/Grand Theft Auto V-144x192.jpeg';
import CSImage from '../data/images/Counter-Strike_ Global Offensive-144x192.jpeg';

export const EVENT_CATEGORIES = [
  {
    value: 'all',
    image: AllImageIcon,
    isActive: true,
    type: 'icon',
  },
  {
    value: 'sports',
    image: SportsImageIcon,
    isActive: false,
    type: 'icon',
  },
  {
    value: 'celebrities',
    image: CelebritiesImageIcon,
    isActive: false,
    type: 'icon',
  },
  {
    value: 'politics',
    image: PoliticsImageIcon,
    isActive: false,
    type: 'icon',
  },
  {
    value: 'crypto',
    image: CryptoImageIcon,
    isActive: false,
    type: 'icon',
  },
  // {
  //     value: 'other',
  //     image: OtherImage,
  //     isActive: false,
  //     type: 'icon',
  // },
];

export const LIVE_EVENTS_CATEGORIES = [
  {
    value: 'all',
    image: AllImage,
    isActive: true,
    type: 'image',
  },
  {
    // value: 'streamed-esports',
    value: 'League of Legends',
    image: LoLImage,
    isActive: false,
    type: 'image',
  },
  {
    // value: 'streamed-shooter',
    value: 'Fortnite',
    image: FortniteImage,
    isActive: false,
    type: 'image',
  },
  {
    // value: 'streamed-mmorpg',
    value: 'Counter Strike: Global Offensive',
    image: CSImage,
    isActive: false,
    type: 'image',
  },
  {
    // value: 'streamed-other',
    value: 'Grand Theft Auto V',
    image: GTAImage,
    isActive: false,
    type: 'image',
  },
  {
    // value: 'streamed-other',
    value: 'Minecraft',
    image: MinecraftImage,
    isActive: false,
    type: 'image',
  },
  {
    // value: 'streamed-other',
    value: 'Apex Legends',
    image: ApexLegendsImage,
    isActive: false,
    type: 'image',
  },
];
