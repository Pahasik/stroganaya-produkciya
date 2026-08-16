/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * URL обработчика заявок (POST, JSON).
   * Пока переменная не задана, форма работает в демонстрационном режиме
   * и НИКУДА не отправляет данные. См. src/lib/submitLead.ts.
   */
  readonly VITE_LEAD_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
