import { Archive, Inbox, Star } from 'lucide-react'
import type { Folder } from '../chatTypes'

type SideRailProps = {
  folder: Folder
  userName: string
  onFolderChange: (folder: Folder) => void
  onSignOut: () => void
}

export function SideRail({ folder, userName, onFolderChange, onSignOut }: SideRailProps) {
  const initials = userName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside className="side-rail" aria-label="Main navigation">
      <button className="brand-mark" type="button" aria-label="ChatApplication home" title="ChatApplication" onClick={() => onFolderChange('inbox')}>C<span>.</span></button>
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
      <button className="profile-avatar" type="button" title={`Sign out ${userName}`} aria-label={`Sign out ${userName}`} onClick={onSignOut}>{initials}</button>
    </aside>
  )
}