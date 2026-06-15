/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SANITY_STUDIO_GENERATOR_API_URL?: string
  readonly SANITY_STUDIO_GENERATOR_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
