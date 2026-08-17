import { useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Products } from './components/Products'
import { Benefits } from './components/Benefits'
import { Terms } from './components/Terms'
import { Gallery } from './components/Gallery'
import { Process } from './components/Process'
import { Delivery } from './components/Delivery'
import { Faq } from './components/Faq'
import { LeadForm } from './components/LeadForm'
import { Footer } from './components/Footer'
import { MobileCta } from './components/MobileCta'
import { PrivacyDialog } from './components/PrivacyDialog'

export default function App() {
  /** Продукция, выбранная кнопкой в каталоге, подставляется в форму заявки. */
  const [preselectedProduct, setPreselectedProduct] = useState('')
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-forest focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Перейти к основному содержимому
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Products onRequest={setPreselectedProduct} />
        <Benefits />
        <Terms />
        <Gallery />
        <Process />
        <Delivery />
        <Faq />
        <LeadForm
          preselectedProduct={preselectedProduct}
          onOpenPrivacy={() => setPrivacyOpen(true)}
        />
      </main>

      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />

      <MobileCta />

      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  )
}
