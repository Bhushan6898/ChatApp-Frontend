import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import { io, type Socket } from 'socket.io-client'
import { InboxPanel } from './components/InboxPanel'
import { SideRail } from './components/SideRail'
import { ThreadPanel } from './components/ThreadPanel'
import { AuthScreen } from './components/AuthScreen'
import { useAuth } from './hooks/useAuth'
import type { Conversation, Folder } from './chatTypes'
import './App.css'

type SocketMessage = {
  id: number
  conversationId: number
  text: string
  time: string
  sender: 'me' | 'them'
}

type ServerToClientEvents = {
  'message:receive': (message: SocketMessage) => void
}

type ClientToServerEvents = {
  'message:send': (message: SocketMessage) => void
}

const socketUrl = import.meta.env.VITE_SOCKET_URL
const socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = socketUrl
  ? io(socketUrl, { autoConnect: false }) as Socket<ServerToClientEvents, ClientToServerEvents>
  : null

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
    preview: 'Rohan: I’ve added the notes from today.',
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
    name: 'Arjun Mehta',
    initials: 'AM',
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
    name: 'Ananya Sharma',
    initials: 'AS',
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
    name: 'Riya Kapoor',
    initials: 'RK',
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

function App() {
  const { session: authSession, isCheckingSession, apiConnectionStatus, apiConnectionResponse, login, register, logout } = useAuth()
  const [conversations, setConversations] = useState(seedConversations)
  const [activeId, setActiveId] = useState(1)
  const [folder, setFolder] = useState<Folder>('inbox')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)

  useEffect(() => {
    if (!socket || !authSession) return

    function receiveMessage(message: SocketMessage) {
      setConversations((current) => current.map((conversation) => {
        if (conversation.id !== message.conversationId || conversation.messages.some((item) => item.id === message.id)) {
          return conversation
        }

        return {
          ...conversation,
          preview: message.sender === 'me' ? `You: ${message.text}` : message.text,
          time: message.time,
          messages: [...conversation.messages, {
            id: message.id,
            text: message.text,
            time: message.time,
            sender: message.sender,
          }],
        }
      }))
    }

    function handleConnect() {
      setSocketConnected(true)
    }

    function handleDisconnect() {
      setSocketConnected(false)
    }

    socket.on('message:receive', receiveMessage)
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.connect()

    return () => {
      socket.off('message:receive', receiveMessage)
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.disconnect()
    }
  }, [authSession])

  function signOut() {
    void logout().catch(() => undefined)
    window.location.hash = '#/login'
  }

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
    const message: SocketMessage = {
      id: Date.now(),
      conversationId: activeConversation.id,
      text,
      time,
      sender: 'me',
    }
    socket?.emit('message:send', message)
    setConversations((current) => current.map((item) => item.id === activeConversation.id
      ? { ...item, preview: `You: ${text}`, time, messages: [...item.messages, { id: message.id, text, time, sender: 'me' }] }
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
      name: 'Aditi Rao',
      initials: 'AR',
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

  if (isCheckingSession) {
    return <main className="auth-loading" aria-live="polite">Checking your session...</main>
  }

  if (!authSession) {
    return <AuthScreen apiConnectionStatus={apiConnectionStatus} apiConnectionResponse={apiConnectionResponse} onLogin={login} onRegister={register} />
  }

  return (
    <main className={`chat-app${mobileThreadOpen ? ' chat-app--thread-open' : ''}`}>
      <SideRail
        folder={folder}
        userName={authSession.user.name}
        onFolderChange={setFolder}
        onSignOut={signOut}
      />
      <InboxPanel
        folder={folder}
        signedInUser={authSession.user}
        visibleConversations={visibleConversations}
        activeId={activeId}
        search={search}
        onSearchChange={setSearch}
        onCreateConversation={createConversation}
        onSelectConversation={selectConversation}
      />
      <ThreadPanel
        activeConversation={activeConversation}
        draft={draft}
        socketConnected={socketConnected}
        onBack={() => setMobileThreadOpen(false)}
        onToggleStar={toggleStar}
        onSubmit={sendMessage}
        onDraftChange={setDraft}
        onComposerKeyDown={handleComposerKeyDown}
      />
    </main>
  )
}

export default App
