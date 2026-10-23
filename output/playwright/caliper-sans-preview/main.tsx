import * as React from 'react'
import { createRoot } from 'react-dom/client'
import CaliperTypeTester from '../../../code/components/CaliperTypeTester'
function Preview() {
    const [paper, setPaper] = React.useState(true)
    return <>
        <nav className="comparison" aria-label="Color comparison">
            <button type="button" aria-pressed={!paper} onClick={() => setPaper(false)}>A — Navy</button>
            <button type="button" aria-pressed={paper} onClick={() => setPaper(true)}>B — Paper</button>
        </nav>
        <CaliperTypeTester background={paper ? '#EEEEEE' : '#1C2440'} foreground={paper ? '#191919' : '#EEEEEE'} outerBorder={paper} />
    </>
}
createRoot(document.getElementById('root')!).render(<Preview />)
