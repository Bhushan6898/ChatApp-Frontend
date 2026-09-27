import { ChevronDown, MessageCircle, Plus, Search } from 'lucide-react'
import type { Conversation, Folder } from '../chatTypes'

type InboxPanelProps = {
  folder: Folder
  visibleConversations: Conversation[]
  activeId: number
  search: string
  onSearchChange: (search: string) => void
  onCreateConversation: () => void
  onSelectConversation: (conversation: Conversation) => void
}

export function InboxPanel({
  folder,
  visibleConversations,
  activeId,
  search,
  onSearchChange,
  onCreateConversation,
  onSelectConversation,
}: InboxPanelProps) {
  return (
    <section className="inbox-panel" aria-label="Conversations">
      <header className="inbox-header">
        <div className="workspace-switcher">
          <span className="workspace-dot" />
          <span>Northstar </span>
          <ChevronDown size={14} />
        </div>
        <div className="inbox-title-row">
          <div>
            <p className="eyebrow">YOUR SPACE</p>
            <h1>{folder === 'starred' ? 'Starred' : folder === 'archived' ? 'Archive' : 'Messages'}</h1>
          </div>
          <button className="icon-button add-button" type="button" title="New conversation" aria-label="New conversation" onClick={onCreateConversation}>
            <Plus size={19} />
          </button>
        </div>
        <label className="search-field">
          <Search size={16} />
          <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search conversations" aria-label="Search conversations" />
        </label>
        <div className="list-label-row">
          <span>{folder === 'archived' ? 'OLDER CONVERSATIONS' : 'RECENT'}</span>
          <span>{visibleConversations.length.toString().padStart(2, '0')}</span>
        </div>
      </header>

      <div className="conversation-list">
        {visibleConversations.map((conversation) => (
          <button
            className={`conversation-item${activeId === conversation.id ? ' is-selected' : ''}`}
            key={conversation.id}
            type="button"
            onClick={() => onSelectConversation(conversation)}
          >
            <span className={`avatar avatar--${conversation.color}`}>
              {conversation.initials}
              {conversation.online && <span className="online-dot" />}
            </span>
            <span className="conversation-copy">
              <span className="conversation-heading">
                <span className="conversation-name">{conversation.name}</span>
                <span className="conversation-time">{conversation.time}</span>
              </span>
              <span className="conversation-preview">{conversation.preview}</span>
            </span>
            {conversation.unread > 0 && <span className="unread-count">{conversation.unread}</span>}
          </button>
        ))}
        {visibleConversations.length === 0 && (
          <div className="empty-list">
            <MessageCircle size={20} />
            <p>No conversations found</p>
            <span>Try another search or start a new chat.</span>
          </div>
        )}
      </div>
      <footer className="inbox-footer">
        <span className="footer-status-dot" />
        <span>All caught up</span>
      </footer>
    </section>
  )
}