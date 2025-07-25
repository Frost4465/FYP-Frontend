export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  token: string;
  lastSeen: Date;
  contacts: IContact[];
}

export interface IContact {
  id: string;
  userName: string;
}

export interface IPreviewData {
  title: string;
  image?: string;
  description: string;
  domain: string;
  link: string;
}

export interface IAttachment {
  id: number;
  type: string;
  name: string;
  size: string;
  url: string;
  thumbnail?: string;
  file?: File;
}

export interface IRecording {
  id: number;
  size: string;
  src: string;
  duration: string;
  file?: File;
}

export interface IMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export interface IConversation {
  id: string;
  type: string;
  userName?: string;
  contacts: IContact[];
  messages: IMessage[];
  replyMessage?: IMessage;
  unread?: number;
  draftMessage: string;
  members: number[];
  isGroup: boolean;
  groupName: string;
  groupIcon: string;
  text: string;
  sender: string;
  timestamp: string;
}

export interface MessageVo  {
  id: string;
  chatId: string;
  sender: string;
  senderName: string;
  text: string;
  attachments: string[];
  timestamp: string;
  status: string;
  replyTo: string | null;
}

export interface IContactGroup {
  letter: string;
  contacts: IContact[];
}

export interface INotification {
  flag: string;
  title: string;
  message: string;
}

export interface ISettings {
  lastSeen: boolean;
  readReceipt: boolean;
  joiningGroups: boolean;
  privateMessages: boolean;
  darkMode: boolean;
  borderedTheme: boolean;
  allowNotifications: boolean;
  keepNotifications: boolean;
}

export interface ICall {
  type: string;
  direction: string;
  status: string;
  date: string;
  length: string;
  members: IContact[];
  adminIds: number[];
}

export interface IEmoji {
  n: string[];
  u: string;
  r?: string;
  v?: string[];
}
