import React from 'react'
import { createRoot } from 'react-dom/client'
import IndexPage from 'preview-component'
import { projects } from './fixtures.mjs'
const q = new URLSearchParams(location.search)
const scenario=q.get('scenario') || 'manual'
const initialView=q.get('view') === 'grid' ? 'grid' : 'list'
const mode=q.get('version') === 'before' ? 'before' : 'after'
const cms=scenario !== 'manual'
function Preview() {
 return <>
   <div className="preview-page-label">{mode==='before'?'Approved Polish baseline':'Proposed motion adjustments'} · preview data{q.get('motion')==='reduce' ? ' · reduced-motion simulation' : ''}</div>
   <header className="preview-hero"><h1>Index</h1><p>Interactive component review</p></header>
   <IndexPage view={initialView} useCMS={cms} projects={cms ? [] : projects}
     cmsModuleUrl={cms ? `${location.origin}/mock-cms.mjs?scenario=${scenario}&run=${q.get('run')||'0'}&delay=${q.get('delay')||'1800'}` : ''} />
 </>
}
// Preview links are inert destinations; filter links and buttons still work.
document.addEventListener('click',event=>{
 const link=(event.target as Element)?.closest?.('a[href]')
 if(link?.getAttribute('href')?.startsWith('/case-studies/')) event.preventDefault()
})
createRoot(document.getElementById('app')!).render(<Preview />)
