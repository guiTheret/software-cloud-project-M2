interface cleaner {
    id: number,
    username: string,
    lastName: string,
    firstName: string,
    city: string,
    rayon: number,
    bio: string,
    profilPicture: string,
    joinDate: Date,
}

interface userInfo {
    username: string;
    isCleaner: number;
    email: string;
    id: number;
}

interface displayDate {
    date: Date;
    isSelected: boolean;
}