export type Message = {
  id: number
  text: string
  time: string
  sender: 'me' | 'them'
}

export type Conversation = {
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

export type Folder = 'inbox' | 'starred' | 'archived'