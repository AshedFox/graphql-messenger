export const formatDatetime = (datetime: number) => {
    const date = new Date(datetime);

    if (isToday(date)) {
        return date.toLocaleTimeString();
    } else if (isYesterday(date)) {
        return "Вчера";
    } else {
        return date.toLocaleDateString();
    }
}

export const isYesterday = (date: Date) => {
    const today = new Date()
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    return date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
}
export const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
}
