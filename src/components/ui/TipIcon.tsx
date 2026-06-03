/**
 * TipIcon — mapeia emojis vindos da IA para SVGs inline estilizados.
 * Todos os SVGs seguem o estilo "flat food" compatível com a coleção
 * Food & Drinks do SVGRepo.
 */
import type { ReactElement } from 'react'

interface TipIconProps {
  emoji: string
  className?: string
}

/** Conjunto de SVGs inline para os emojis mais comuns gerados pela IA */
const SVG_MAP: Record<string, ReactElement> = {
  // Abacate 🥑
  '🥑': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="34" rx="16" ry="22" fill="#5D8233" />
      <ellipse cx="32" cy="38" rx="10" ry="14" fill="#A7C97B" />
      <ellipse cx="32" cy="42" rx="6" ry="8" fill="#6B3F1F" />
      <ellipse cx="29" cy="22" rx="3" ry="5" fill="#7BB54A" transform="rotate(-15 29 22)" />
    </svg>
  ),

  // Água / gota 💧
  '💧': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8 C32 8 14 30 14 41 a18 18 0 0 0 36 0 C50 30 32 8 32 8Z" fill="#4FC3F7" />
      <ellipse cx="25" cy="38" rx="4" ry="6" fill="white" opacity="0.3" />
    </svg>
  ),

  // Corrida / exercício 🏃
  '🏃': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="38" cy="14" r="6" fill="#FFCC80" />
      <path d="M34 20 L28 36 L20 44" stroke="#FF7043" strokeWidth="4" strokeLinecap="round" />
      <path d="M34 20 L42 30 L50 26" stroke="#FF7043" strokeWidth="4" strokeLinecap="round" />
      <path d="M28 36 L22 50" stroke="#FF7043" strokeWidth="4" strokeLinecap="round" />
      <path d="M36 36 L40 50" stroke="#FF7043" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),

  // Músculo / haltere 💪
  '💪': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="27" width="44" height="10" rx="5" fill="#7986CB" />
      <rect x="6" y="22" width="8" height="20" rx="4" fill="#5C6BC0" />
      <rect x="50" y="22" width="8" height="20" rx="4" fill="#5C6BC0" />
      <rect x="2" y="25" width="6" height="14" rx="3" fill="#3F51B5" />
      <rect x="56" y="25" width="6" height="14" rx="3" fill="#3F51B5" />
    </svg>
  ),

  // Carne / proteína 🥩
  '🥩': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 44 C10 38 14 26 24 20 C34 14 50 16 54 26 C58 36 50 50 40 52 C30 54 14 50 12 44Z" fill="#E57373" />
      <path d="M16 40 C18 36 22 30 30 28 C38 26 46 30 48 36" stroke="#EF9A9A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="36" r="4" fill="#FFCCBC" opacity="0.6" />
    </svg>
  ),

  // Salada 🥗
  '🥗': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="38" rx="24" ry="16" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="1.5" />
      <path d="M16 36 C20 28 28 24 32 24 C36 24 44 28 48 36" fill="#66BB6A" />
      <circle cx="24" cy="33" r="5" fill="#EF5350" opacity="0.9" />
      <circle cx="38" cy="30" r="4" fill="#FFA726" opacity="0.9" />
      <ellipse cx="32" cy="34" rx="6" ry="4" fill="#81C784" />
    </svg>
  ),

  // Lua / sono 🌙
  '🌙': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44 16 A20 20 0 1 1 20 40 A14 14 0 0 0 44 16Z" fill="#FDD835" />
      <circle cx="46" cy="18" r="2" fill="#FFF176" opacity="0.7" />
      <circle cx="14" cy="12" r="1.5" fill="#FFF176" opacity="0.6" />
      <circle cx="52" cy="30" r="1" fill="#FFF176" opacity="0.5" />
    </svg>
  ),

  // Maçã 🍎
  '🍎': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 16 C20 16 12 26 12 36 C12 48 20 56 32 56 C44 56 52 48 52 36 C52 26 44 16 32 16Z" fill="#E53935" />
      <path d="M32 16 C36 10 42 8 44 12" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
      <path d="M34 12 C34 8 38 6 38 6" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="24" cy="30" rx="4" ry="6" fill="white" opacity="0.2" />
    </svg>
  ),

  // Coração ❤️ / 🫀
  '❤️': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 52 C32 52 8 38 8 24 A12 12 0 0 1 32 20 A12 12 0 0 1 56 24 C56 38 32 52 32 52Z" fill="#E53935" />
      <path d="M20 22 C22 18 28 18 30 22" stroke="#EF9A9A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  '🫀': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 52 C32 52 8 38 8 24 A12 12 0 0 1 32 20 A12 12 0 0 1 56 24 C56 38 32 52 32 52Z" fill="#E53935" />
      <path d="M20 22 C22 18 28 18 30 22" stroke="#EF9A9A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  // Balança ⚖️
  '⚖️': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="29" y="12" width="6" height="40" rx="3" fill="#78909C" />
      <rect x="18" y="52" width="28" height="5" rx="2.5" fill="#546E7A" />
      <line x1="32" y1="14" x2="12" y2="26" stroke="#78909C" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="14" x2="52" y2="26" stroke="#78909C" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="12" cy="28" rx="8" ry="5" fill="#90A4AE" />
      <ellipse cx="52" cy="28" rx="8" ry="5" fill="#90A4AE" />
    </svg>
  ),

  // Ovos 🥚 / 🍳
  '🥚': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="34" rx="18" ry="22" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1.5" />
      <ellipse cx="32" cy="36" rx="10" ry="12" fill="#FFEE58" />
    </svg>
  ),
  '🍳': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="34" cy="36" rx="22" ry="18" fill="#37474F" />
      <rect x="6" y="32" width="18" height="6" rx="3" fill="#37474F" />
      <ellipse cx="34" cy="36" rx="18" ry="14" fill="#FAFAFA" />
      <ellipse cx="34" cy="37" rx="8" ry="7" fill="#FDD835" />
    </svg>
  ),

  // Peixe 🐟
  '🐟': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 32 C10 32 22 18 38 22 C48 24 54 32 54 32 C54 32 48 40 38 42 C22 46 10 32 10 32Z" fill="#4FC3F7" />
      <path d="M10 32 L2 22 L2 42 Z" fill="#29B6F6" />
      <circle cx="44" cy="28" r="2.5" fill="#1A237E" />
      <path d="M34 26 C36 28 36 36 34 38" stroke="#81D4FA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Castanha / nozes 🥜
  '🥜': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="26" cy="36" rx="14" ry="18" fill="#A1887F" transform="rotate(-20 26 36)" />
      <ellipse cx="40" cy="32" rx="12" ry="16" fill="#8D6E63" transform="rotate(10 40 32)" />
      <line x1="32" y1="26" x2="34" y2="16" stroke="#6D4C41" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="26" cy="36" rx="8" ry="10" fill="#BCAAA4" opacity="0.4" transform="rotate(-20 26 36)" />
    </svg>
  ),

  // Folha / natureza 🌿
  '🌿': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 52 C32 52 12 40 14 20 C24 14 44 18 50 32 C56 46 32 52 32 52Z" fill="#66BB6A" />
      <path d="M32 52 C32 52 20 34 32 20" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 38 C20 34 16 28 18 22" stroke="#81C784" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M38 36 C44 32 48 26 46 20" stroke="#81C784" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Relógio / horário 🕐 ⏰
  '🕐': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" fill="#FFF9C4" stroke="#F9A825" strokeWidth="3" />
      <line x1="32" y1="32" x2="32" y2="16" stroke="#F57F17" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="32" x2="44" y2="36" stroke="#F57F17" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="3" fill="#F57F17" />
    </svg>
  ),
  '⏰': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" fill="#FFF9C4" stroke="#F9A825" strokeWidth="3" />
      <line x1="32" y1="32" x2="32" y2="16" stroke="#F57F17" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="32" x2="44" y2="36" stroke="#F57F17" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="3" fill="#F57F17" />
    </svg>
  ),

  // Garrafa de água 🫗 / 🧃
  '🫗': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="12" width="20" height="44" rx="8" fill="#4FC3F7" />
      <rect x="22" y="12" width="20" height="8" rx="4" fill="#0288D1" />
      <rect x="24" y="28" width="4" height="20" rx="2" fill="white" opacity="0.3" />
    </svg>
  ),

  // Brócolis 🥦
  '🥦': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="29" y="36" width="6" height="18" rx="3" fill="#558B2F" />
      <circle cx="32" cy="28" r="14" fill="#66BB6A" />
      <circle cx="22" cy="24" r="9" fill="#81C784" />
      <circle cx="42" cy="24" r="9" fill="#81C784" />
      <circle cx="32" cy="18" r="8" fill="#A5D6A7" />
    </svg>
  ),

  // Frango 🍗
  '🍗': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 44 C14 36 16 22 26 18 C36 14 48 20 50 32 C52 44 44 54 36 52 C28 50 26 52 20 44Z" fill="#FFCC80" />
      <path d="M20 44 C16 40 14 36 16 30" stroke="#FFA726" strokeWidth="2" strokeLinecap="round" />
      <rect x="15" y="42" width="10" height="12" rx="5" fill="#F5F5F5" />
      <ellipse cx="32" cy="32" rx="10" ry="8" fill="#FFB74D" opacity="0.5" />
    </svg>
  ),

  // Arroz 🍚
  '🍚': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="40" rx="24" ry="16" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1.5" />
      <ellipse cx="32" cy="34" rx="20" ry="12" fill="#FAFAFA" />
      <ellipse cx="24" cy="32" rx="3" ry="2" fill="#E0E0E0" opacity="0.7" />
      <ellipse cx="32" cy="30" rx="3" ry="2" fill="#E0E0E0" opacity="0.7" />
      <ellipse cx="40" cy="32" rx="3" ry="2" fill="#E0E0E0" opacity="0.7" />
      <ellipse cx="28" cy="36" rx="3" ry="2" fill="#E0E0E0" opacity="0.7" />
      <ellipse cx="36" cy="36" rx="3" ry="2" fill="#E0E0E0" opacity="0.7" />
    </svg>
  ),

  // Vitaminas / pílula 💊
  '💊': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="24" width="36" height="16" rx="8" fill="#EF9A9A" transform="rotate(-45 32 32)" />
      <path d="M22.3 41.7 L41.7 22.3" stroke="white" strokeWidth="2" />
      <rect x="14" y="24" width="18" height="16" rx="8" fill="#EF5350" transform="rotate(-45 32 32)" clipPath="url(#left-half)" />
    </svg>
  ),

  // Estrela / destaque ⭐
  '⭐': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="32,8 38,24 56,24 42,36 48,52 32,42 16,52 22,36 8,24 26,24" fill="#FDD835" stroke="#F9A825" strokeWidth="1.5" />
    </svg>
  ),

  // Lâmpada 💡 (fallback padrão)
  '💡': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="26" r="16" fill="#FDD835" />
      <path d="M26 42 L38 42" stroke="#F9A825" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 46 L36 46" stroke="#F9A825" strokeWidth="3" strokeLinecap="round" />
      <rect x="26" y="42" width="12" height="4" rx="2" fill="#FFF176" />
      <path d="M22 22 C20 16 24 10 32 10 C40 10 44 16 42 22" stroke="#FBC02D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
}

/** Retorna o SVG correspondente ao emoji, ou o SVG de fallback (💡). */
export default function TipIcon({ emoji, className = 'w-5 h-5' }: TipIconProps) {
  const svg = SVG_MAP[emoji] ?? SVG_MAP['💡']
  return (
    <span className={className} aria-hidden role="img">
      {svg}
    </span>
  )
}
