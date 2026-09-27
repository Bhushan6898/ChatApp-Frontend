import { Archive, Inbox, Star } from 'lucide-react'
import type { Folder } from '../chatTypes'

type SideRailProps = {
  folder: Folder
  onFolderChange: (folder: Folder) => void
}

export function SideRail({ folder, onFolderChange }: SideRailProps) {
  return (
    <aside className="side-rail" aria-label="Main navigation">
      <button className="brand-mark" type="button" aria-label="Morrow home" onClick={() => onFolderChange('inbox')}>m<span>.</span></button>
      <div className="rail-rule" />
      <button className={`rail-button${folder === 'inbox' ? ' is-active' : ''}`} type="button" aria-label="Inbox" title="Inbox" onClick={() => onFolderChange('inbox')}>
        <Inbox size={19} strokeWidth={1.8} />
        <span className="rail-indicator" />
      </button>
      <button className={`rail-button${folder === 'starred' ? ' is-active' : ''}`} type="button" aria-label="Starred" title="Starred" onClick={() => onFolderChange('starred')}>
        <Star size={19} strokeWidth={1.8} />
      </button>
      <button className={`rail-button${folder === 'archived' ? ' is-active' : ''}`} type="button" aria-label="Archived" title="Archived" onClick={() => onFolderChange('archived')}>
        <Archive size={19} strokeWidth={1.8} />
      </button>
      <div className="rail-spacer" />
      <button className="profile-avatar" type="button" title="Your profile" aria-label="Your profile">SK</button>
      <span className="profile-avatar" title="Signed in as Sam" aria-label="Signed in as Sam">SK</span>
    </aside>
  )
}