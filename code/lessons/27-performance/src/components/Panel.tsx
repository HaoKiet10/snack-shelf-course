import type { ReactNode } from 'react'
import './Panel.css'

// A box that doesn't know what goes inside it.
//   children = whatever is written BETWEEN <Panel> and </Panel>
//   action   = a second "slot": any JSX to show at the bottom (a button…)
type PanelProps = {
  title?: string        // the ? makes it optional
  action?: ReactNode
  children: ReactNode
}

export default function Panel({ title, action, children }: PanelProps) {
  return (
    <section className="panel">
      {title && <h2 className="panel-title">{title}</h2>}
      <div className="panel-body">{children}</div>
      {action && <div className="panel-action">{action}</div>}
    </section>
  )
}
