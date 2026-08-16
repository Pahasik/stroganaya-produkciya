export type Lead = {
  name: string
  phone: string
  company: string
  product: string
  volume: string
  comment: string
}

export type SubmitResult =
  /** Заявка действительно отправлена настроенному обработчику. */
  | { status: 'sent' }
  /** Обработчик не подключён — данные никуда не отправлялись. */
  | { status: 'demo' }

/* ------------------------------------------------------------------ */
/*  ТОЧКА ПОДКЛЮЧЕНИЯ РЕАЛЬНОГО ОБРАБОТЧИКА ЗАЯВОК                     */
/* ------------------------------------------------------------------ */
/**
 * TODO(владелец сайта): укажите адрес обработчика заявок в переменной
 * окружения `VITE_LEAD_ENDPOINT` (файл `.env.local`), например:
 *
 *   VITE_LEAD_ENDPOINT=https://ваш-домен.ру/api/lead
 *
 * Обработчик должен принимать POST с JSON-телом вида `Lead` и отвечать
 * кодом 2xx при успешной обработке. До тех пор форма работает в
 * демонстрационном режиме: проверка полей и все состояния интерфейса
 * работают, но данные НЕ отправляются на несуществующий сервер.
 *
 * Если вместо собственного бэкенда используется внешний сервис (CRM,
 * почтовый шлюз, форма Яндекс/Тильда и т. п.) — замените тело функции
 * `sendToEndpoint` соответствующим вызовом.
 */
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT

async function sendToEndpoint(endpoint: string, lead: Lead): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  })

  if (!response.ok) {
    throw new Error(`Обработчик заявок ответил кодом ${response.status}`)
  }
}

export async function submitLead(lead: Lead): Promise<SubmitResult> {
  if (!ENDPOINT) {
    // Демонстрационный режим: имитируем только задержку интерфейса,
    // сетевого запроса не происходит.
    await new Promise((resolve) => setTimeout(resolve, 700))
    return { status: 'demo' }
  }

  await sendToEndpoint(ENDPOINT, lead)
  return { status: 'sent' }
}

/* ------------------------------------------------------------------ */
/*  Телефон                                                            */
/* ------------------------------------------------------------------ */

/** Приводит ввод к виду +7 (999) 123-45-67. */
export function formatPhone(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (!digits) return ''

  // 8XXXXXXXXXX и XXXXXXXXXX приводим к 7XXXXXXXXXX
  if (digits[0] === '8' || digits[0] === '9') {
    digits = digits[0] === '8' ? `7${digits.slice(1)}` : `7${digits}`
  } else if (digits[0] !== '7') {
    digits = `7${digits}`
  }
  digits = digits.slice(0, 11)

  const rest = digits.slice(1)
  let out = '+7'
  if (rest.length > 0) out += ` (${rest.slice(0, 3)}`
  if (rest.length >= 3) out += ')'
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`
  return out
}

export function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, '').length === 11
}
