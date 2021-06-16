export type chat = {
    id: string;
    users: string[];
}

export type users = {
    id: string;
    email: string;
    lastSeen: string;
    photoUrl: string;
}

export type messages = {
    id: string;
    photoURL: string;
    timestamp: string;
    user: string;
    message: string;
}