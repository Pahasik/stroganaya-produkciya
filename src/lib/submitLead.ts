export type Lead = {
  name: string
  phone: string
  company: string
  product: string
  volume: string
  comment: string
}

export type SubmitResult =
  /** Заявка принята обработчиком. */
  | { status: 'sent' }
  /** Обработчик не настроен — данные никуда не отправлялись. */
  | { status: 'demo' }

/* ------------------------------------------------------------------ */
/*  КУДА УХОДЯТ ЗАЯВКИ                                                 */
/* ------------------------------------------------------------------ */
/**
 * По умолчанию заявки уходят письмом на почту компании через FormSubmit.
 *
 * ВАЖНО, разовая активация: после первой отправки формы с боевого домена
 * FormSubmit пришлёт на sudik-les@mail.ru письмо со ссылкой активации.
 * Пока по ней не перешли, письма с заявками не доставляются.
 *
 * Как заменить сервис (своя серверная функция, CRM, Telegram-бот через
 * прокси): задайте VITE_LEAD_ENDPOINT в файле .env.local — он имеет
 * приоритет над значением по умолчанию. Обработчик должен принимать POST
 * с JSON-телом `Lead` и отвечать кодом 2xx.
 *
 * Токены и ключи сюда класть нельзя: код фронтенда публичный.
 */
const FORMSUBMIT_EMAIL = 'sudik-les@mail.ru'

/** Эндпоинт для fetch: возвращает JSON вместо редиректа. */
const AJAX_ENDPOINT = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`

/** Эндпоинт для обычной отправки формы, если JavaScript не сработал. */
export const NOSCRIPT_ENDPOINT = `https://formsubmit.co/${FORMSUBMIT_EMAIL}`

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || AJAX_ENDPOINT

/** Служебные поля FormSubmit: тема письма, вид письма и отключение капчи. */
function buildPayload(lead: Lead) {
  return {
    Имя: lead.name,
    Телефон: lead.phone,
    Компания: lead.company || '—',
    Продукция: lead.product || '—',
    'Объём, м³': lead.volume || '—',
    Комментарий: lead.comment || '—',
    _subject: `Заявка с сайта: ${lead.name}, ${lead.phone}`,
    _template: 'table',
    _captcha: 'false',
  }
}

export async function submitLead(lead: Lead): Promise<SubmitResult> {
  if (!ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { status: 'demo' }
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(buildPayload(lead)),
  })

  if (!response.ok) {
    throw new Error(`Сервис приёма заявок ответил кодом ${response.status}.`)
  }

  /*
    ВАЖНО: FormSubmit отвечает кодом 200 даже тогда, когда письмо НЕ отправлено —
    например, пока форма не активирована по ссылке из письма. Проверять только
    response.ok нельзя: посетитель увидит «Заявка отправлена», а заявка потеряется.
    Поэтому разбираем тело ответа и считаем успехом только success: "true".
  */
  const data: unknown = await response.json().catch(() => null)
  const success =
    data && typeof data === 'object' && 'success' in data
      ? String((data as { success: unknown }).success)
      : null

  if (success !== null && success !== 'true') {
    const detail =
      data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : 'неизвестная причина'

    // Техническая причина — в консоль для владельца сайта, посетителю её не показываем.
    console.error('[Заявка не доставлена] Ответ сервиса:', detail)

    throw new Error('Не удалось передать заявку менеджеру.')
  }

  return { status: 'sent' }
}

/* ------------------------------------------------------------------ */
/*  Телефон                                                            */
/* ------------------------------------------------------------------ */

/** Приводит ввод к виду +7 (999) 123-45-67. */
export function formatPhone(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (!digits) return ''

  // 8XXXXXXXXXX и 9XXXXXXXXX приводим к 7XXXXXXXXXX
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
