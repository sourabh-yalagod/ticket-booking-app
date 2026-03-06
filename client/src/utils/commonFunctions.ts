const formatDate = ([year, month, day]: [number, number, number]) => {
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
};

const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
};

export { formatDate, formatDuration }