import { useState, type FormEvent, type KeyboardEvent } from 'react'
import {
  Archive,
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronDown,
  Inbox,
  MessageCircle,
  Plus,
  Search,
  Send,
  Smile,
  Star,
} from 'lucide-react'
import './App.css'

type Message = {
  id: number
  text: string
  time: string
  sender: 'me' | 'them'
}

type Conversation = {
  id: number
  name: string
  initials: string
  color: string
  role: string
  preview: string
  time: string
  unread: number
  starred: boolean
  archived: boolean
  group: boolean
  online: boolean
  messages: Message[]
}

const seedConversations: Conversation[] = [
  {
    id: 1,
    name: 'Nia Patel',
    initials: 'NP',
    color: 'coral',
    role: 'Product designer',
    preview: 'That feels like the right direction.',
    time: '10:42',
    unread: 2,
    starred: true,
    archived: false,
    group: false,
    online: true,
    messages: [
      { id: 1, text: 'Morning! I pulled together a few directions for the new workspace.', time: '10:18', sender: 'them' },
      { id: 2, text: 'The quieter palette is working really well. It feels focused without getting cold.', time: '10:24', sender: 'me' },
      { id: 3, text: 'Exactly what I was hoping for. I also tried giving the conversation list a little more breathing room.', time: '10:31', sender: 'them' },
      { id: 4, text: 'Nice. The hierarchy reads much better now, especially on the smaller layout.', time: '10:36', sender: 'me' },
      { id: 5, text: 'That feels like the right direction. I’ll tidy up the mobile states and share a new pass after lunch.', time: '10:42', sender: 'them' },
    ],
  },
  {
    id: 2,
    name: 'Studio weekly',
    initials: 'SW',
    color: 'mustard',
    role: '4 members',
    preview: 'Milo: I’ve added the notes from today.',
    time: '09:56',
    unread: 0,
    starred: false,
    archived: false,
    group: true,
    online: false,
    messages: [
      { id: 1, text: 'I’ve added the notes from today’s review to the shared doc.', time: '09:51', sender: 'them' },
      { id: 2, text: 'Perfect, thanks Milo. I’ll take a look before our next check-in.', time: '09:56', sender: 'me' },
    ],
  },
  {
    id: 3,
    name: 'Theo Martin',
    initials: 'TM',
    color: 'blue',
    role: 'Engineering',
    preview: 'You: Great, thanks for checking.',
    time: 'Yesterday',
    unread: 0,
    starred: false,
    archived: false,
    group: false,
    online: false,
    messages: [
      { id: 1, text: 'The updated build is ready on my branch whenever you want to review it.', time: 'Yesterday', sender: 'them' },
      { id: 2, text: 'Great, thanks for checking. I’ll give it a run this afternoon.', time: 'Yesterday', sender: 'me' },
    ],
  },
  {
    id: 4,
    name: 'Amara Okafor',
    initials: 'AO',
    color: 'lilac',
    role: 'Research lead',
    preview: 'The interviews were so helpful.',
    time: 'Yesterday',
    unread: 0,
    starred: true,
    archived: false,
    group: false,
    online: true,
    messages: [
      { id: 1, text: 'The interviews were so helpful. I sent over the themes that came up most often.', time: 'Yesterday', sender: 'them' },
    ],
  },
  {
    id: 5,
    name: 'Launch planning',
    initials: 'LP',
    color: 'green',
    role: '6 members',
    preview: 'You: Let’s keep Thursday open.',
    time: 'Tue',
    unread: 0,
    starred: false,
    archived: false,
    group: true,
    online: false,
    messages: [
      { id: 1, text: 'Let’s keep Thursday open for the final run-through.', time: 'Tue', sender: 'me' },
    ],
  },
  {
    id: 6,
    name: 'Jules Rivera',
    initials: 'JR',
    color: 'rose',
    role: 'Operations',
    preview: 'Sounds good, talk soon!',
    time: 'Mon',
    unread: 0,
    starred: false,
    archived: true,
    group: false,
    online: false,
    messages: [
      { id: 1, text: 'Sounds good, talk soon!', time: 'Mon', sender: 'them' },
    ],
  },
]

type Folder = 'inbox' | 'starred' | 'archived'

function App() {
  const [conversations, setConversations] = useState(seedConversations)
  const [activeId, setActiveId] = useState(1)
  const [folder, setFolder] = useState<Folder>('inbox')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)

  const visibleConversations = conversations.filter((conversation) => {
    const query = search.trim().toLowerCase()
    const inFolder = folder === 'starred'
      ? conversation.starred && !conversation.archived
      : folder === 'archived'
        ? conversation.archived
        : !conversation.archived
    const matchesSearch = !query || `${conversation.name} ${conversation.preview}`.toLowerCase().includes(query)
    return inFolder && matchesSearch
  })

  const activeConversation = conversations.find((conversation) => conversation.id === activeId) ?? conversations[0]

  function selectConversation(conversation: Conversation) {
    setActiveId(conversation.id)
    setMobileThreadOpen(true)
    setConversations((current) => current.map((item) => item.id === conversation.id ? { ...item, unread: 0 } : item))
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !activeConversation) return

    const time = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date())
    setConversations((current) => current.map((item) => item.id === activeConversation.id
      ? { ...item, preview: `You: ${text}`, time, messages: [...item.messages, { id: Date.now(), text, time, sender: 'me' }] }
      : item))
    setDraft('')
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  function toggleStar() {
    setConversations((current) => current.map((item) => item.id === activeConversation.id ? { ...item, starred: !item.starred } : item))
  }

  function createConversation() {
    const nextId = Math.max(...conversations.map((item) => item.id)) + 1
    const conversation: Conversation = {
      id: nextId,
      name: 'Ari Lane',
      initials: 'AL',
      color: 'green',
      role: 'New conversation',
      preview: 'Start a conversation',
      time: 'Now',
      unread: 0,
      starred: false,
      archived: false,
      group: false,
      online: true,
      messages: [],
    }
    setConversations((current) => [conversation, ...current])
    setFolder('inbox')
    setSearch('')
    setActiveId(nextId)
    setMobileThreadOpen(true)
  }

  return (
    <main className={`chat-app${mobileThreadOpen ? ' chat-app--thread-open' : ''}`}>
      <aside className="side-rail" aria-label="Main navigation">
        <button className="brand-mark" type="button" aria-label="Morrow home" onClick={() => setFolder('inbox')}>m<span>.</span></button>
        <div className="rail-rule" />
        <button className={`rail-button${folder === 'inbox' ? ' is-active' : ''}`} type="button" aria-label="Inbox" title="Inbox" onClick={() => setFolder('inbox')}>
          <Inbox size={19} strokeWidth={1.8} />
          <span className="rail-indicator" />
        </button>
        <button className={`rail-button${folder === 'starred' ? ' is-active' : ''}`} type="button" aria-label="Starred" title="Starred" onClick={() => setFolder('starred')}>
          <Star size={19} strokeWidth={1.8} />
        </button>
        <button className={`rail-button${folder === 'archived' ? ' is-active' : ''}`} type="button" aria-label="Archived" title="Archived" onClick={() => setFolder('archived')}>
          <Archive size={19} strokeWidth={1.8} />
        </button>
        <div className="rail-spacer" />
        <button className="profile-avatar" type="button" title="Your profile" aria-label="Your profile">SK</button>
          <span className="profile-avatar" title="Signed in as Sam" aria-label="Signed in as Sam">SK</span>
      </aside>

      <section className="inbox-panel" aria-label="Conversations">
        <header className="inbox-header">
          <div className="workspace-switcher">
            <span className="workspace-dot" />
            <span>Northstar Studio</span>
            <ChevronDown size={14} />
          </div>
          <div className="inbox-title-row">
            <div>
              <p className="eyebrow">YOUR SPACE</p>
              <h1>{folder === 'starred' ? 'Starred' : folder === 'archived' ? 'Archive' : 'Messages'}</h1>
            </div>
            <button className="icon-button add-button" type="button" title="New conversation" aria-label="New conversation" onClick={createConversation}>
              <Plus size={19} />
            </button>
          </div>
          <label className="search-field">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" aria-label="Search conversations" />
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
              onClick={() => selectConversation(conversation)}
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

      <section className="thread-panel" aria-label={`Conversation with ${activeConversation.name}`}>
        <header className="thread-header">
          <button className="back-button icon-button" type="button" aria-label="Back to conversations" onClick={() => setMobileThreadOpen(false)}>
            <ArrowLeft size={19} />
          </button>
          <span className={`avatar thread-avatar avatar--${activeConversation.color}`}>
            {activeConversation.initials}
            {activeConversation.online && <span className="online-dot" />}
          </span>
          <div className="thread-person">
            <h2>{activeConversation.name}</h2>
            <p><span className={activeConversation.online ? 'presence-dot' : 'presence-dot presence-dot--off'} />{activeConversation.online ? 'Available now' : activeConversation.role}</p>
          </div>
          <div className="thread-actions">
            <button className={`icon-button star-button${activeConversation.starred ? ' is-starred' : ''}`} type="button" aria-label={activeConversation.starred ? 'Remove from starred' : 'Add to starred'} title={activeConversation.starred ? 'Remove from starred' : 'Add to starred'} onClick={toggleStar}>
              <Star size={18} fill={activeConversation.starred ? 'currentColor' : 'none'} />
            </button>
            <span className="header-divider" />
            <span className="thread-date">Today</span>
          </div>
        </header>

        <div className="message-scroll">
          <div className="thread-intro">
            <span className={`avatar intro-avatar avatar--${activeConversation.color}`}>{activeConversation.initials}</span>
            <h3>{activeConversation.name}</h3>
            <p>{activeConversation.role} · You started this conversation</p>
            <span className="intro-date">TODAY</span>
          </div>
          <div className="message-list" aria-live="polite">
            {activeConversation.messages.map((message, index) => {
              const previousMessage = activeConversation.messages[index - 1]
              const showSender = message.sender === 'them' && previousMessage?.sender !== 'them'
              return (
                <div className={`message-row message-row--${message.sender}`} key={message.id}>
                  {showSender && <span className={`avatar message-avatar avatar--${activeConversation.color}`}>{activeConversation.initials}</span>}
                  <div className="message-content">
                    {showSender && <span className="message-sender">{activeConversation.name}<span>{message.time}</span></span>}
                    <div className="message-bubble">{message.text}</div>
                    {message.sender === 'me' && <span className="message-receipt">{message.time} <CheckCheck size={13} /></span>}
                  </div>
                </div>
              )
            })}
            {activeConversation.messages.length === 0 && <p className="first-message-hint">A fresh start. Say hello to {activeConversation.name.split(' ')[0]}.</p>}
          </div>
        </div>

        <div className="composer-wrap">
          <form className="composer" onSubmit={sendMessage}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder={`Message ${activeConversation.name.split(' ')[0]}...`}
              aria-label="Write a message"
              rows={1}
            />
            <div className="composer-bottom">
              <div className="composer-tools">
                <button className="composer-tool" type="button" title="Insert a smile" aria-label="Insert a smile" onClick={() => setDraft((current) => `${current}🙂`)}>
                  <Smile size={18} />
                </button>
                <span className="composer-hint"><kbd>↵</kbd> to send <span>·</span> <kbd>⇧ ↵</kbd> for a new line</span>
              </div>
              <button className="send-button" type="submit" aria-label="Send message" disabled={!draft.trim()}>
                <span>Send</span><Send size={15} />
              </button>
            </div>
          </form>
          <p className="encryption-note"><Check size={12} /> Your messages are shown in this local preview.</p>
        </div>
      </section>
    </main>
  )
}

export default App
