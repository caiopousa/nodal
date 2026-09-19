import { I18nProvider, useI18n } from "@/lib/i18n"
import { Nav } from "@/components/Nav"
import { HoverPreview } from "@/components/HoverPreview"
// teste: navegação por seções na base da tela; o sumário lateral (SectionsSidebar) segue no projeto pra voltar fácil
import { SectionsProgress } from "@/components/SectionsProgress"
import { Hero } from "@/components/sections/Hero"
import { WhatIs } from "@/components/sections/WhatIs"
import { Types } from "@/components/sections/Types"
import { Feel } from "@/components/sections/Feel"
import { Choose } from "@/components/sections/Choose"
import { Price } from "@/components/sections/Price"
import { Brands } from "@/components/sections/Brands"
import { Market } from "@/components/sections/Market"
import { Glossary } from "@/components/sections/Glossary"

function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t py-10">
      <div className="container-101 text-sm text-muted-foreground">
        <p className="max-w-2xl leading-7">
          {t.footer.intro}{" "}
          <HoverPreview href="https://www.eloshapes.com/mousepads/browse" icon="/favicons/eloshapes.png">EloShapes</HoverPreview>
          {t.footer.mid}{" "}
          <HoverPreview href="https://prosettings.net/gear/lists/mousepads/" icon="/favicons/prosettings.png">ProSettings</HoverPreview>
          {t.footer.outro}
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <Nav />
      <SectionsProgress />
      <main>
        <Hero />
        <WhatIs />
        <Types />
        <Feel />
        <Choose />
        <Price />
        <Brands />
        <Market />
        <Glossary />
      </main>
      <Footer />
    </I18nProvider>
  )
}
