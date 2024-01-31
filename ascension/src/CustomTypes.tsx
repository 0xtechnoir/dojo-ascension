export interface LogMessage {
  id: string;
  timestamp: number;
  message: string;
}

export interface ActivityLogState {
  messages: LogMessage[];
}
