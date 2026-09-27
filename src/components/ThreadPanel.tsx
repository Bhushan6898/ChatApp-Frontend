import type { FormEvent, KeyboardEvent } from 'react'
import { ArrowLeft, Check, CheckCheck, Send, Smile, Star } from 'lucide-react'
import type { Conversation } from '../chatTypes'

type ThreadPanelProps = {
  activeConversation: Conversation
  draft: string
  socketConnected: boolean
  onBack: () => void
  onToggleStar: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onDraftChange: (draft: string) => void
  onComposerKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

export function ThreadPanel({
  activeConversation,
  draft,
  socketConnected,
  onBack,
  onToggleStar,
  onSubmit,
  onDraftChange,
  onComposerKeyDown,
}: ThreadPanelProps) {
  return (
    <section className="thread-panel" aria-label={`Conversation with ${activeConversation.name}`}>
      <header className="thread-header">
        <button className="back-button icon-button" type="button" aria-label="Back to conversations" onClick={onBack}>
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
          <button className={`icon-button star-button${activeConversation.starred ? ' is-starred' : ''}`} type="button" aria-label={activeConversation.starred ? 'Remove from starred' : 'Add to starred'} title={activeConversation.starred ? 'Remove from starred' : 'Add to starred'} onClick={onToggleStar}>
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
        <form className="composer" onSubmit={onSubmit}>
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={onComposerKeyDown}
            placeholder={`Message ${activeConversation.name.split(' ')[0]}...`}
            aria-label="Write a message"
            rows={1}
          />
          <div className="composer-bottom">
            <div className="composer-tools">
              <button className="composer-tool" type="button" title="Insert a smile" aria-label="Insert a smile" onClick={() => onDraftChange(`${draft}🙂`)}>
                <Smile size={18} />
              </button>
              <span className="composer-hint"><kbd>↵</kbd> to send <span>·</span> <kbd>⇧ ↵</kbd> for a new line</span>
            </div>
            <button className="send-button" type="submit" aria-label="Send message" disabled={!draft.trim()}>
              <span>Send</span><Send size={15} />
            </button>
          </div>
        </form>
        <p className="encryption-note"><Check size={12} />{socketConnected ? ' Connected to live messaging.' : ' Messages stay in this local preview while offline.'}</p>
      </div>
    </section>
  )
}