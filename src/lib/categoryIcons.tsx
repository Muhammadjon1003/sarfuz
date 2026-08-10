import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWallet,
  faMoneyBillTrendUp,
  faUtensils,
  faCartShopping,
  faCar,
  faGasPump,
  faLightbulb,
  faBolt,
  faHouse,
  faBuilding,
  faBagShopping,
  faShirt,
  faHeartPulse,
  faStethoscope,
  faFilm,
  faGamepad,
  faMugHot,
  faGraduationCap,
  faBook,
  faBriefcase,
  faStore,
  faPiggyBank,
  faChartLine,
  faMobileScreen,
  faWifi,
  faGift,
  faHandshake,
  faReceipt,
  faFolderOpen,
  faTag,
  faBoxesPacking,
  faPlane,
  faWrench,
  faCircleDollarToSlot,
  faCreditCard,
  faCoins,
  faTv,
  faScissors,
  faTruckFast,
  faPercent,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons'

// Palette of distinct icons for deterministic hash mapping
const ICON_PALETTE: IconDefinition[] = [
  faWallet,
  faUtensils,
  faCar,
  faBagShopping,
  faHouse,
  faLightbulb,
  faHeartPulse,
  faGraduationCap,
  faBriefcase,
  faPiggyBank,
  faMobileScreen,
  faFilm,
  faGift,
  faStore,
  faPlane,
  faWrench,
  faTv,
  faCoins,
  faBuilding,
  faCreditCard,
  faStethoscope,
  faMugHot,
  faBook,
  faChartLine,
  faReceipt,
  faFolderOpen,
  faBoxesPacking,
  faCircleDollarToSlot,
  faScissors
]

function getHashIndex(str: string, max: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % max
}

/**
 * Returns a dedicated Font Awesome icon based on category name or fallback emoji/slug
 */
export function getCategoryFAIcon(categoryName?: string, rawIcon?: string): IconDefinition {
  const name = (categoryName || '').toLowerCase().trim()

  if (name.includes('maosh') || name.includes('oylik') || name.includes('salary') || name.includes('daromad') || name.includes('stipend')) {
    return faMoneyBillTrendUp
  }
  if (name.includes('oziq') || name.includes('food') || name.includes('bozor') || name.includes('supermarket') || name.includes('ovqat') || name.includes('grocery')) {
    return faCartShopping
  }
  if (name.includes('kafe') || name.includes('restoran') || name.includes('tushlik') || name.includes('kofe') || name.includes('coffee') || name.includes('dinning')) {
    return faUtensils
  }
  if (name.includes('taksi') || name.includes('transport') || name.includes('benzin') || name.includes('avto') || name.includes('car') || name.includes('yo\'l')) {
    return name.includes('benzin') || name.includes('gaz') ? faGasPump : faCar
  }
  if (name.includes('kommunal') || name.includes('svet') || name.includes('elektr') || name.includes('utility')) {
    return faLightbulb
  }
  if (name.includes('suv') || name.includes('gaz')) {
    return faBolt
  }
  if (name.includes('arenda') || name.includes('rent') || name.includes('uy') || name.includes('ijara') || name.includes('house')) {
    return faHouse
  }
  if (name.includes('kiyim') || name.includes('shopp') || name.includes('xarid') || name.includes('clothes')) {
    return faShirt
  }
  if (name.includes('sog\'liq') || name.includes('dori') || name.includes('vrach') || name.includes('health') || name.includes('shifoxona')) {
    return faHeartPulse
  }
  if (name.includes('ko\'ngil') || name.includes('kino') || name.includes('o\'yin') || name.includes('cinema') || name.includes('game') || name.includes('entertainment')) {
    return name.includes('o\'yin') || name.includes('game') ? faGamepad : faFilm
  }
  if (name.includes('ta\'lim') || name.includes('o\'qish') || name.includes('kurs') || name.includes('edu') || name.includes('kitob') || name.includes('maktab')) {
    return faGraduationCap
  }
  if (name.includes('biznes') || name.includes('savdo') || name.includes('tadbirkor') || name.includes('business')) {
    return faBriefcase
  }
  if (name.includes('invest') || name.includes('jamg\'arma') || name.includes('depozit') || name.includes('saving')) {
    return faPiggyBank
  }
  if (name.includes('internet') || name.includes('telefon') || name.includes('aloqa') || name.includes('mobil') || name.includes('mobile')) {
    return name.includes('internet') || name.includes('wifi') ? faWifi : faMobileScreen
  }
  if (name.includes('sovg\'a') || name.includes('gift') || name.includes('hadya') || name.includes('bayram')) {
    return faGift
  }
  if (name.includes('qarz') || name.includes('debt') || name.includes('nasiya')) {
    return faHandshake
  }
  if (name.includes('soliq') || name.includes('shtraf') || name.includes('jarima') || name.includes('tax')) {
    return faPercent
  }
  if (name.includes('remont') || name.includes('xizmat') || name.includes('usta') || name.includes('service')) {
    return faWrench
  }
  if (name.includes('sayohat') || name.includes('travel') || name.includes('bilet') || name.includes('samolyot')) {
    return faPlane
  }
  if (name.includes('dostavka') || name.includes('kuryer') || name.includes('delivery')) {
    return faTruckFast
  }

  // Check rawIcon keyword if provided
  if (rawIcon && rawIcon.length > 4) {
    const raw = rawIcon.toLowerCase()
    if (raw.includes('food') || raw.includes('cart')) return faCartShopping
    if (raw.includes('car')) return faCar
    if (raw.includes('home')) return faHouse
  }

  // String hash fallback
  if (name) {
    const idx = getHashIndex(name, ICON_PALETTE.length)
    return ICON_PALETTE[idx]
  }

  return faTag
}

interface Props {
  name?: string
  icon?: string
  className?: string
}

export function CategoryIcon({ name, icon, className = 'w-4 h-4' }: Props) {
  if (icon && icon.length <= 4 && icon !== '💰' && icon !== '💸' && icon !== '📦' && icon !== '📁' && icon !== '✨') {
    return <span className="inline-block leading-none">{icon}</span>
  }

  const faIcon = getCategoryFAIcon(name, icon)
  return <FontAwesomeIcon icon={faIcon} className={className} />
}
